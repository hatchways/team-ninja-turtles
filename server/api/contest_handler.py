import json
from flask import jsonify, Blueprint, request
from api.models import contest_table, db
from datetime import date
contest_handler = Blueprint('contest_new_handler', __name__)


@contest_handler.route('/create_new_contest', methods=['POST'])
def create_contest():
    if request.method == 'POST':

        title = request.form['title']
        description = request.form['description']
        prize_contest = request.form['amount']
        deadline_date = request.form['deadline_date']
        created_time = date.today()
        update_time = date.today()
        contest_creator = request.json['contestCreator']
        
        new_contest = contest_table(title, description, prize_contest, deadline_date, created_time, update_time, contest_creator)
        db.session.add(new_contest)
        db.session.commit()

        return jsonify({'successMessage': 'Contest Created!'})

@contest_handler.route('/contests', methods=['GET'])
def get_all_contests():
    all_contests = contest_table.query.all()
    return jsonify(all_contests)

@contest_handler.route('/contest/<contest_id>')
def get_contest(contest_id):
    contest = contest_table.query.get(contest_id)
    return jsonify(contest)  

@contest_handler.route('/update_contest/<contest_id>', methods=['PUT'])
def update_contest(contest_id):
    if request.method == 'PUT':
        contest = contest_table.query.get(contest_id)

        title = request.form['title']
        description = request.form['description']
        prize_contest = request.form['amount']
        deadline_date = request.form['deadline_date']
        update_time = date.today()

        contest.title = title
        contest.description = description
        contest.prize_contest = prize_contest
        contest.deadline_date = deadline_date
        contest.update_time = update_time

        db.session.commit()

        return jsonify({'successMessage': 'Contest Updated!'})
        