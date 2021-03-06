import eventlet
eventlet.monkey_patch()

from flask import Flask, session
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.register_handler import register_handler
from api.auth_handler import auth_handler
from api.gmail_auth_handler import gmail_auth_handler
from api.campaign_handler import campaign_handler
from api.prospect_handler import prospect_handler
from api.gmail_webhook_handler import gmail_webhook_handler
from addon import bcrypt, jwt, rq, sio
from pymodm import connect
import datetime
import json
from pymodm import MongoModel
from bson import ObjectId


app = Flask(__name__)
app.config.from_object("config.Config")
app.secret_key = "Not secret key"

bcrypt.init_app(app)
jwt.init_app(app)
rq.init_app(app)
sio.init_app(app, cors_allowed_origins="*", message_queue="redis://localhost:6379/0")

connect(app.config["DB_ADDR"], alias=app.config["DB_ALIAS"])

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(register_handler)
app.register_blueprint(auth_handler)
app.register_blueprint(gmail_auth_handler)
app.register_blueprint(campaign_handler)
app.register_blueprint(prospect_handler)
app.register_blueprint(gmail_webhook_handler)

@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(minutes=5)


class ModelEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, MongoModel):
            return obj.to_dict()
        elif isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)


app.json_encoder = ModelEncoder

if __name__ == '__main__':
    sio.run(app)
    # python app.py
    # rq worker --with-scheduler
    # yarn start
# GCP Pub/Sub
# GCP Oauth

