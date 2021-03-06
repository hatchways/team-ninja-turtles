from flask import Flask
from flask_migrate import Migrate
from api.ping_handler import ping_handler
from api import db, bcrypt, socketio
from api.home_handler import home_handler
from api.contest_handler import contest_handler
from api.user_handler import user_handler
from api.submission_handler import submission_handler
from api.socketio_handler import socketio_handler
from api.payment_handler import payment_handler
from api.inspirational_images_handler import inspirational_images_handler
import os

app = Flask(__name__)

# Handle COR preflight
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', app.config['DOM_NAME'])
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


POSTGRES = {
    'user': os.environ.get('DB_USER'),
    'pw': os.environ.get('DB_PASS'),
    'db': os.environ.get('DB_DB'),
    'host': os.environ.get('DB_HOST'),
    'port': os.environ.get('DB_PORT')
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['JWT_SECRET'] = os.environ.get('JWT_SECRET') if os.environ.get('JWT_SECRET') else "bad_secret_key"
app.config['DOM_NAME'] = "http://localhost:3000"
app.config['STRIPE_SK'] = os.environ.get("STRIPE_SECRET")

db.init_app(app)
bcrypt.init_app(app)

socketio.init_app(app, cors_allowed_origins="*")

app.register_blueprint(user_handler)
app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(contest_handler)
app.register_blueprint(submission_handler)
app.register_blueprint(socketio_handler)
app.register_blueprint(payment_handler)
app.register_blueprint(inspirational_images_handler)

migrate = Migrate(app, db)
