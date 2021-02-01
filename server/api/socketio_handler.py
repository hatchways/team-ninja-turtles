from flask import jsonify, Blueprint, request
from api import socketio, db
from api.middleware import require_auth
from flask_socketio import send, emit, join_room
import jwt
from models import User, RoomSession, Message
from app import app


socketio_handler = Blueprint('socketio_new_handler', __name__)


@socketio.on("message")
def handle_message(msg):
    send({"message": msg["message"], "name": msg["username"]}, broadcast=True, room=msg["room_id"])
    user = User.query.filter_by(username=msg["username"]).first()
    message = Message(user=user.id, session=msg["room_id"], message=msg["message"])
    db.session.add(message)
    db.session.commit()
    return None


@socketio.on('join')
@require_auth
def on_join(data):
    join_room(data)
    return None


@socketio.route("/message-log")
@require_auth
def get_log():
    session = RoomSession.query.filter_by(id=request.json['session']).first()
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=['HS256'])
    user = data['user']

    if session is None:
        return jsonify({"error": "session not found"}), 400

    if session.user1 != user or session.user2 != user:
        return jsonify({"error": "unauthorized room access"}), 404

    query = Message.query.filter_by(session=session.id).order_by(Message.timestamp.asc()).all()

    log = []
    for msg in query:
        log.append({
            "user": msg.user,
            "text": msg.message,
            "timestamp": msg.timestamp
        })

    return jsonify(log), 201


@socketio.route("/create-room")
@require_auth
def create_room():
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=['HS256'])
    users = [User.query.filter_by(username=data['user']).first(),
             User.query.filter_by(username=request.json['user']).first()]

    session = RoomSession.query.filter(RoomSession.user1.in_(users), RoomSession.user2.in_(users)).first()

    if session is None:
        session = RoomSession(user1=users[0].id, user2=users[1].id)
        db.session.add(session)
        db.session.commit()

    return jsonify({"session": session.id}), 201



