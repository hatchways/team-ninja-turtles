from flask import jsonify, Blueprint, request, g
from api import db, s3
from models import Contest, Submission, User
from api.middleware import require_auth, get_current_user
from config import S3_BUCKET, S3_REGION
from datetime import date, datetime
import jwt
import app
submission_handler = Blueprint('submission_new_handler', __name__)


@submission_handler.route('/contestImage/submission/<contest_id>', methods=['POST'])
@require_auth
@get_current_user
def create_submission(contest_id):
    current_user = g.current_user

    # Replace all the ":" and " " with other charachters to have a consistent URL.
    # AWS would replace these charachters with others such as "+" or "%" and the link in the database would not match the actual link on AWS.
    file_name = (str(datetime.now()) + "_" + request.form["file_name"]).replace(":", "-").replace(" ", "_")
    folder_path = 'contest_id_{}/user_id_{}/{}'.format(
            contest_id,
            current_user.id,
            file_name)
    image = 'https://'+S3_BUCKET+".s3."+S3_REGION+'.amazonaws.com/'+folder_path

    try:
        s3.upload_fileobj(request.files['file'], S3_BUCKET, folder_path)
    except Exception as e:
        return jsonify({'error': str(e)})

    if request.method == 'POST':
        new_submission = Submission(contest_id=contest_id, submiter_id=current_user.id, active=True,
                                    image_link=image, update_time=date.today())
        db.session.add(new_submission)
        db.session.commit()

        return jsonify({'successMessage': 'New submission created successfully'})