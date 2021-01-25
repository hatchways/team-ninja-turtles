from flask import jsonify, Blueprint, request
from api.models import User
from api import db
import stripe
import jwt
import app
from api.middleware import require_auth

payment_handler = Blueprint("payment_handler", __name__)


# Mock data
def get_price_val(data):
    return 1000, 'usd'


@payment_handler.route("/api/get_stripe_intent", methods=["GET"])
def get_stripe_intent():
    token = request.cookies.get("auth_token")
    try:
        username = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])['user']
    except:
        return jsonify({'message': 'invalid Token'}), 401

    stripe.api_key = app.app.config['STRIPE_SK']
    user = User.query.filter_by(username=username).first()

    if user.stripe_id is None:
        new_stripe_id = stripe.Customer.create(email=user.email, description=user.username).get("id")
        user.stripe_id = new_stripe_id
        db.session.commit()

    intent = stripe.SetupIntent.create(customer=user.stripe_id)

    return jsonify({"intent_id": intent.client_secret}), 200


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

