from flask import jsonify, Blueprint, request
from api import socketio, db
from .models import Messages
from flask_socketio import send, emit, join_room

socketio_handler = Blueprint('socketio_new_handler', __name__)


@socketio.on("message")
def handleMessage(msg):
    send({"message": msg["message"], "name": msg["username"]}, broadcast=True, room=msg["room_id"])
    return None


@socketio.on('join')
def on_join(data):
    join_room(data)
    return None
