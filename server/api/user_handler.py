from flask import jsonify, Blueprint, request
from api import db, bcrypt
from models.user_model import User
from api.middleware import require_auth
import jwt
from datetime import datetime, timedelta
import app


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


@user_handler.route('/api/test_protected', methods=['POST', 'GET'])
@require_auth
def protected():
    return jsonify({"message": "hello"}), 200
