from flask import jsonify, Blueprint, request
from api import db, s3
from .models import Contest, Submission, User
from config import S3_BUCKET
from datetime import date
import jwt
import app
submission_handler = Blueprint('submission_new_handler', __name__)


@submission_handler.route('/contestImage/submission/<contest_id>', methods=['POST'])
def create_submission(contest_id):
    try:
        s3.upload_fileobj(request.files['file'], S3_BUCKET, request.form["file_name"])
    except Exception as e:
        return jsonify({'error': 'File not found'})

    token = request.cookies.get("auth_token")
    if token is None:
        return jsonify({"error": "auth_token missing"}), 401

    username = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])['user']
    current_user = User.query.filter_by(username=username).first()
    
    image = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+request.form["file_name"]
    if request.method == 'POST':
        new_submission = Submission(contest_id=contest_id, submiter_id=current_user.id, active=True,
                                    image_link=image, update_time=date.today())
        db.session.add(new_submission)
        db.session.commit()

        return jsonify({'successMessage': 'New submission created successfully'})
