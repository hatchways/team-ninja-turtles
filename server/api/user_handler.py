from flask import jsonify, Blueprint, request
from api import db, bcrypt
from api.models import User

user_handler = Blueprint("user_handler", __name__)


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

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "email exist"}), 400

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"error": "username exist"}), 400

    user = User(username=username, email=email, password=bcrypt.generate_password_hash(password).decode('utf-8'))
    db.session.add(user)
    db.session.commit()

    # TODO: grant user a JWT

    return jsonify({}), 201


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

    # TODO: register an auth token and return to the user

    return jsonify({}), 201
