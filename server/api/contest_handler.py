import json
from flask import jsonify, Blueprint, request
from api import db
from api.models import Contest
from datetime import date
contest_handler = Blueprint('contest_new_handler', __name__)


@contest_handler.route('/contest', methods=['POST'])
def create_contest():
    # Create new contests
    if request.method == 'POST':
        request_json = request.get_json()

        title = request_json.get("title")
        description = request_json.get("description")
        prize_contest = request_json.get("prize_contest")
        deadline_date = request_json.get("deadline_date")
        update_time = date.today()
        contest_creator = request_json.get('contest_creator')
        
        new_contest = Contest(
                                title=title, 
                                description=description, 
                                prize_contest=prize_contest, 
                                deadline_date=deadline_date, 
                                update_time=update_time, 
                                contest_creater=contest_creator
                            )
        db.session.add(new_contest)
        db.session.commit()

        return jsonify({'successMessage': 'Contest Created!'})


@contest_handler.route('/contests', methods=['GET'])
def get_all_contests():
    # Do any contests exist?
    try:
        all_contests = Contest.query.all()
        if len(all_contests) == 0:
            raise Exception
    except Exception:
        return jsonify("No contests listed")
    # Return all contests
    else:
        return jsonify(all_contests)


@contest_handler.route('/contest/<contest_id>', methods=['PUT', 'GET'])
def get_contest(contest_id):
    # Does contest exist?
    try:
        contest = Contest.query.get(contest_id)
        if contest == None:
            raise Exception
    except Exception:
        return jsonify("Contest does not exist")

    # Return contest contents
    if request.method == 'GET':
        return jsonify(contest)

    # Update contest contents
    if request.method == 'PUT':
        contest.title = request.form['title']
        contest.description = request.form['description']
        contest.prize_contest = request.form['amount']
        contest.deadline_date = request.form['deadline_date']
        contest.update_time = date.today()

        db.session.commit()

        return jsonify({'successMessage': 'Contest Updated!'})