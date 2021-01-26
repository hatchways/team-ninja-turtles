from flask import jsonify, Blueprint, request, send_file
from api import db, bcrypt, s3
from api.models import User
from api.middleware import require_auth
import jwt
from datetime import datetime, timedelta
import app
from config import S3_BUCKET


user_handler = Blueprint("user_handler", __name__)
exp = 20  # in minutes


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
        return jsonify({"Error": "Password must have at least 6 characters."}), 400

    if User.query.filter_by(email=email, username=username).first() is not None:
        return jsonify({"error": "email or username already exist"}), 400

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
        return jsonify({"Error": "required input missing"}), 400

    username = request_json.get("username")
    password = request_json.get("password")

    # input missing
    if username is None or password is None:
        return jsonify({"Error": "required input missing"}), 400

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"Error": "user does not exist"}), 400

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"Error": "incorrect password"}), 400

    token = jwt.encode({"user": username, "exp": datetime.utcnow() + timedelta(minutes=exp)}, \
                       app.app.config['JWT_SECRET'])

    response = jsonify({"message": "success"})
    response.status_code = 201
    response.set_cookie('auth_token', value=token, httponly=True)
    return response


@require_auth
@user_handler.route('/api/edit_profile', methods=['POST'])
def edit_profile():
    s3_key = request.form["file_name"]

    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
    current_user = User.query.filter_by(username=data['user']).first()

    try:
        s3.upload_file(request.files['icon'], S3_BUCKET, s3_key)
    except Exception as e:
        return jsonify({"error": "unexpected error"}), 400

    current_user.icon = s3_key
    db.session.commit()

    return jsonify({"message": "success"}), 200


@require_auth
@user_handler.route('/api/get_user', methods=['GET'])
def get_user_profile():
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
    current_user = User.query.filter_by(username=data['user']).first()

    # requires to call get_custom_icon if custom_icon is true
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'custom_icon': current_user.icon is not None and len(current_user.icon) > 0
    })


@require_auth
@user_handler.route('/api/get_icon', methods=['GET'])
def get_icon():
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
    current_user = User.query.filter_by(username=data['user']).first()

    if current_user.icon is None or len(current_user.icon) == 0:
        return jsonify({"error": "user does not use custom icon"}), 400

    print('temp/%s' % current_user.icon)

    s3.download_file(S3_BUCKET, current_user.icon, 'temp/%s' % current_user.icon)

    return send_file('temp/%s' % current_user.icon)


@require_auth
@user_handler.route('/api/test_protected', methods=['POST', 'GET'])
def protected():
    return jsonify({"message": "hello"}), 200
