from flask import jsonify, Blueprint, request
from models import User
from api import db
import stripe
import jwt
import app
from api.middleware import require_auth, get_current_user

payment_handler = Blueprint("payment_handler", __name__)


@payment_handler.route("/api/get_stripe_intent", methods=["GET"])
@require_auth
@get_current_user
def get_stripe_intent(user):
    stripe.api_key = app.app.config['STRIPE_SK']

    if user.stripe_id is None:
        new_stripe_id = stripe.Customer.create(email=user.email, description=user.username).get("id")
        user.stripe_id = new_stripe_id
        db.session.commit()

    intent = stripe.SetupIntent.create(customer=user.stripe_id)

    return jsonify({"intent_id": intent.client_secret}), 200


@payment_handler.route("/api/create_payment", methods=["POST"])
def create_payment():
    try:
        request_json = request.get_json()
        amount = request_json.get("amount")
        currency = request_json.get("currency")
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency
        )
        return jsonify({"client_secret": intent["client_secret"], "msg": "Payment has been successfully processed"}), 201
    except Exception as e:
        return jsonify(error=str(e)), 403


@payment_handler.route("/api/get_stripe_id", methods=["GET"])
@require_auth
@get_current_user
def get_stripe_id(user):
    stripe.api_key = app.app.config['STRIPE_SK']

    if user.stripe_id is None:
       return jsonify({"error": "stripe id not found"}), 404

    intent = stripe.SetupIntent.create(customer=user.stripe_id)

    return jsonify({"intent_id": intent.client_secret}), 200