from flask import jsonify, Blueprint, request
from api import socketio
from flask_socketio import send, emit
from datetime import datetime

socketio_handler = Blueprint('socketio_new_handler', __name__)


@socketio.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None
