from functools import wraps
from flask import jsonify, request
import jwt
import app


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

