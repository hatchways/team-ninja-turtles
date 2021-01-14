import json
from flask import jsonify, Blueprint, request
from api import db
from api.models import Contest
from datetime import date
contest_handler = Blueprint('contest_new_handler', __name__)


@contest_handler.route('/contest', methods=['POST'])
def create_contest():
    if request.method == 'POST':

        title = request.form['title']
        description = request.form['description']
        prize_contest = request.form['amount']
        deadline_date = request.form['deadline_date']
        created_time = date.today()
        update_time = date.today()
        contest_creator = request.json['contestCreator']
        
        new_contest = Contest(title, description, prize_contest, deadline_date, created_time, update_time, contest_creator)
        db.session.add(new_contest)
        db.session.commit()

        return jsonify({'successMessage': 'Contest Created!'})


@contest_handler.route('/contests', methods=['GET'])
def get_all_contests():
    try:
        all_contests = Contest.query.all()
        if len(all_contests) == 0:
            raise Exception
    except Exception:
        return jsonify("No contests listed")
    else:
        return jsonify(all_contests)


@contest_handler.route('/contest/<contest_id>', methods=['PUT', 'GET'])
def get_contest(contest_id):
    try:
        contest = Contest.query.get(contest_id)
        if contest == None:
            raise Exception
    except Exception:
        return jsonify("Contest does not exist")

    if request.method == 'GET':
        return jsonify(contest)

    if request.method == 'PUT':
        contest.title = request.form['title']
        contest.description = request.form['description']
        contest.prize_contest = request.form['amount']
        contest.deadline_date = request.form['deadline_date']
        contest.update_time = date.today()

        db.session.commit()

        return jsonify({'successMessage': 'Contest Updated!'})