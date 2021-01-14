from flask import jsonify, Blueprint, request
from api import db
from api.models import Contest,Submission,User
from datetime import date
submission_handler = Blueprint('submission_new_handler', __name__)


@submission_handler.route('/contestImage/submission/<contest_id>/<user_id>', methods=['POST'])
def create_submission(contest_id, user_id):
    contest = Contest.query.get(contest_id)
    submission_user = User.query.get(user_id)

    if request.method == 'POST':
        data = request.form
        new_submission = Submission(contest_id=contest.id, submiter_id=submission_user.id, active=data.get('status'),
                                    image_link=data.get('link'), update_time=date.today())
        db.session.add(new_submission)
        db.session.commit()

        return jsonify({'successMessage': 'New submission created successfully'})









