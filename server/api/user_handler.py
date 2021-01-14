from flask import jsonify, Blueprint, request
from api import db, bcrypt
from api.models import User
import jwt
from datetime import datetime, timedelta
import app
from functools import wraps


user_handler = Blueprint("user_handler", __name__)
exp = 20  # in minutes


@user_handler.route('/api/register', methods=['POST'])
def register():
    username = request.form.get("username")
    password = request.form.get("password")
    email = request.form.get("email")

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

    return jsonify({"auth_token": token}), 201


@user_handler.route('/api/login', methods=['POST'])
def login():
    username = request.form["username"]
    password = request.form["password"]

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
    return jsonify({"auth_token": token}), 201


def require_auth(route):
    @wraps(route)
    def auth(*arg, **kwargs):
        request_data = request.json

        if request_data is None:
            return jsonify({"error": "auth_token missing"}), 401

        token = request_data.get("auth_token")

        if token is None:
            return jsonify({"error": "auth_token missing"}), 401

        try:
            jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
        except:
            return jsonify({'message': 'invalid Token'}), 401

        return route(*arg, **kwargs)

    return auth


@user_handler.route('/api/test_protected', methods=['POST', 'GET'])
@require_auth
def protected():
    return jsonify({"message": "hello"}), 200
