from flask import jsonify, Blueprint, request
from api import db
from .models import Contest, Submission, User
import app
from config import S3_BUCKET
from datetime import date
submission_handler = Blueprint('submission_new_handler', __name__)


@submission_handler.route('/contestImage/submission/<contest_id>', methods=['POST'])
def create_submission(contest_id):
    try:
        app.s3.upload_file(request.files["file"], S3_BUCKET, request.form["file_name"])
    except Exception as e:
        return jsonify({'error': e})
    
    if request.method == 'POST':
        data = request.form
        new_submission = Submission(contest_id=contest_id, submiter_id=data.get('user_id'), active=data.get('status'),
                                    image_link='https://s3.amazonaws.com/'+S3_BUCKET+'/'+data.get('file_name'), update_time=date.today())
        db.session.add(new_submission)
        db.session.commit()

        return jsonify({'successMessage': 'New submission created successfully'})