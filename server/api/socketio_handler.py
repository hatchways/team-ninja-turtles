from flask import jsonify, Blueprint, request
from api import socketio, db
from api.middleware import require_auth
from flask_socketio import send, emit, join_room
import jwt
from models import User, RoomSession, Message
import app


socketio_handler = Blueprint('socketio_handler', __name__)


@socketio.on("message")
def handle_message(msg):
    user = User.query.filter_by(username=msg["username"]).first()
    session = RoomSession.query.filter_by(id=msg["roomID"]).first()
    message = Message(user=user, message=msg["message"], session=session)
    db.session.add(message)
    db.session.commit()
    send({"message": message.message,
          "name": message.user.username,
          "time": message.timestamp.strftime("%Y-%m-%d %H:%M:%S")},
         broadcast=True, room=msg["roomID"])
    return None


@socketio.on('join')
@require_auth
def on_join(data):
    join_room(data)
    return None


@socketio_handler.route("/get_all_session", methods=["GET"])
@require_auth
def get_all_session():
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
    username = data['user']
    user = User.query.filter_by(username=username).first()

    result = []

    for session in user.sessions:
        target_user = session.users[1] if session.users[0].username == username else session.users[0]
        result.append({
            "session": session.id,
            "user": {
                "username": target_user.username,
                "icon": target_user.icon
            }
        })

    return jsonify(result), 201


@socketio_handler.route("/message_log/<session_id>", methods=["GET"])
@require_auth
def get_log(session_id):
    session = RoomSession.query.filter_by(id=session_id).first()
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
    user = User.query.filter_by(username=data['user']).first()

    if session is None:
        return jsonify({"error": "session not found"}), 400

    if user not in session.users:
        return jsonify({"error": "unauthorized room access"}), 404

    query = session.messages

    log = []
    for msg in query:
        log.append({
            "user": msg.user.username,
            "text": msg.message,
            "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify(log), 201


@socketio_handler.route("/create_room", methods=['POST'])
@require_auth
def create_room():
    token = request.cookies.get("auth_token")
    data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
    users = [data['user'], request.get_json().get('user')]

    session = RoomSession.query.filter(RoomSession.users.any(User.username == users[0])).\
        filter(RoomSession.users.any(User.username == users[1])).first()

    user1 = User.query.filter_by(username=users[0]).first()
    user2 = User.query.filter_by(username=users[1]).first()

    if session is None:
        session = RoomSession()
        session.users.append(user1)
        session.users.append(user2)
        db.session.add(session)
        db.session.commit()

    return jsonify({
        "session": session.id,
        "user": {
            "username": user2.username,
            "icon": user2.icon
        }
    }), 201



