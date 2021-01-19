from flask import jsonify, Blueprint, request
from api.models import User
import stripe
import jwt
import app
from api.middleware import require_auth

payment_handler = Blueprint("payment_handler", __name__)


# Mock data
def get_price_val(data):
    return 1000, 'usd'


@payment_handler.route("/api/get_stripe_id", methods=["GET"])
def get_stripe_id():
    token = request.cookies.get("auth_token")
    username = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])['user']

    user = User.query.filter_by(username=username).first()
    if user.stripe_id == 0:
        user.stripe_id = stripe.Customer.create(email=user.email, description=user.username)

    return jsonify({"stripe_id": user.stripe_id}), 200


@payment_handler.route("/api/create_payment", methods=["POST"])
def create_payment():
    try:
        data = request.get_json()
        price, currency = get_price_val(data)
        intent = stripe.PaymentIntent.create(
            amount=price,
            currency=currency
        )
        return jsonify({"client_secret": intent["client_secret"]}), 201
    except Exception as e:
        return jsonify(error=str(e)), 403

