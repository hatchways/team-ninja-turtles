from flask import jsonify, Blueprint, request
from api import socketio
from flask_socketio import emit
from datetime import datetime
socketio_handler = Blueprint('socketio_new_handler', __name__)


@socketio.on('connect')
def connect_socket():
    emit('connect', {'data': datetime.now().isoformat()})
    return None