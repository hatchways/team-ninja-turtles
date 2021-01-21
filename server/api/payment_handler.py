from flask import jsonify, Blueprint, request
import stripe

payment_handler = Blueprint("payment_handler", __name__)

stripe.api_key = "sk_test_51IB2YjBC6Uxj9HYv7iZBoYA6ijfWk2Y9dVJsxYfrfv0v1SGEcoct35vVVEBiPNYeqRxUDxikGcYSlqOT2PRThQfz00io3SSVC2"


# Mock data
def get_price_val(data):
    return 1000, 'usd'


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

