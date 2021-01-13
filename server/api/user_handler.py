import json
from flask import jsonify, Blueprint, request

user_handler = Blueprint("user_handler", __name__)


@user_handler.route('/api/register', methods=['POST'])
def register():
    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]

    if len(password) < 6:
        return jsonify({"Error": "Password must have at least 6 characters."}), 400

    # TODO: check if email exist

    # TODO: check if username exist

    # TODO: create user on the database.

    return jsonify({}), 201


@user_handler.route('/api/login', methods=['POST'])
def login():
    username = request.form["username"]
    password = request.form["password"]

    # TODO: check if username exist

    # TODO: check if password is correct for the user

    # TODO: register an auth token and return to the user

    return jsonify({}), 200
