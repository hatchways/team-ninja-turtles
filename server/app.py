from flask import Flask
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.user_handler import user_handler

app = Flask(__name__)


app.register_blueprint(user_handler)
app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

