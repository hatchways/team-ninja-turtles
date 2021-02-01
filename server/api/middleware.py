from functools import wraps
from flask import jsonify, request, g
from models import User
import jwt
import app


def require_auth(route):
    @wraps(route)
    def auth(*arg, **kwargs):
        token = request.cookies.get("auth_token")

        if token is None:
            return jsonify({"error": "auth_token missing"}), 401

        if token is None:
            return jsonify({"error": "auth_token missing"}), 401

        try:
            jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
        except:
            return jsonify({'message': 'invalid Token'}), 401

        return route(*arg, **kwargs)

    return auth


def get_current_user(route):
    @wraps(route)
    def get_user(*arg, **kwargs):
        token = request.cookies.get("auth_token")
        data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
        current_user = User.query.filter_by(username=data['user']).first()
        g.current_user = current_user

        return route(*arg, **kwargs)
    return get_user
