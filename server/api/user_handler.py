from flask import jsonify, Blueprint, request, send_file
from api import db, bcrypt, s3
from models import User
from api.middleware import require_auth, get_current_user
import jwt
from datetime import datetime, timedelta
import app
from config import S3_BUCKET, S3_REGION


user_handler = Blueprint("user_handler", __name__)
exp = 120  # in minutes


@user_handler.route('/api/register', methods=['POST'])
def register():
    request_json = request.get_json()

    if request_json is None:
        return jsonify({"Error": "required input missing"}), 400

    username = request_json.get("username")
    password = request_json.get("password")
    email = request_json.get("email")

    # input missing
    if username is None or password is None or email is None:
        return jsonify({"Error": "required input missing"}), 400

    # check input errors
    if len(password) < 6:
        return jsonify({"password_error": "Password must have at least 6 characters."}), 400

    check_user = User.query.filter((User.email == email) | (User.username == username)).all()

    if len(check_user) > 0:
        check_username = map(lambda x: x.username, check_user)
        check_email = map(lambda x: x.email, check_user)
        response = {}
        if username in check_username:
            response['user_error'] = "username already exist"
        if email in check_email:
            response['email_error'] = "email already exist"
        return jsonify(response), 400

    user = User(username=username, email=email, password=bcrypt.generate_password_hash(password).decode('utf-8'))
    db.session.add(user)
    db.session.commit()

    token = jwt.encode({"user": username, "exp": datetime.utcnow() + timedelta(minutes=exp)}, \
                       app.app.config['JWT_SECRET'])

    response = jsonify({"message": "success"})
    response.status_code = 201
    response.set_cookie('auth_token', value=token, httponly=True)
    return response


@user_handler.route('/api/login', methods=['POST'])
def login():
    request_json = request.get_json()

    if request_json is None:
        return jsonify({"error": "required input missing"}), 400

    username = request_json.get("username")
    password = request_json.get("password")

    # input missing
    if username is None or password is None:
        return jsonify({"error": "required input missing"}), 400

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"user_error": "user does not exist"}), 400

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"password_error": "incorrect password"}), 400

    token = jwt.encode({"user": username, "exp": datetime.utcnow() + timedelta(minutes=exp)}, \
                       app.app.config['JWT_SECRET'])

    response = jsonify({"message": "success"})
    response.status_code = 201
    response.set_cookie('auth_token', value=token, httponly=True)
    return response


@user_handler.route('/api/edit_profile', methods=['POST'])
@require_auth
@get_current_user
def edit_profile(current_user):
    s3_key = request.form["file_name"]

    try:
        if len(s3_key) > 0:
            s3.upload_fileobj(request.files['icon'], S3_BUCKET, s3_key, ExtraArgs={'ACL': 'public-read'})
            current_user.icon = s3_key
            db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"error": "unexpected error"}), 400

    return jsonify({"message": "success"}), 200


@user_handler.route('/api/get_user', methods=['GET'])
@require_auth
@get_current_user
def get_user_profile(current_user):
    icon = None if current_user.icon is None else \
        "http://%s.s3.%s.amazonaws.com/%s" % (S3_BUCKET, S3_REGION, current_user.icon)

    # requires to call get_custom_icon if custom_icon is true
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'icon': icon
    })


@user_handler.route('/api/get_profile/<username>', methods=['GET'])
def get_profile(username):
    user = User.query.filter_by(username=username).first()
    icon = None if user.icon is None else \
        "http://%s.s3.%s.amazonaws.com/%s" % (S3_BUCKET, S3_REGION, user.icon)

    # requires to call get_custom_icon if custom_icon is true
    return jsonify({
        'username': user.username,
        'email': user.email,
        'icon': icon
    })


@user_handler.route('/api/test_protected', methods=['POST', 'GET'])
@require_auth
def protected():
    return jsonify({"message": "hello"}), 200


@user_handler.route('/api/search_user', methods=['GET'])
def search_user():
    contains = request.args.get('contains')

    users = User.query.filter(User.username.ilike("%%%s%%" % contains)).all()

    result = []
    for user in users:
        result.append({
            "username": user.username,
            "icon": user.icon
        })
    return jsonify(result), 201
