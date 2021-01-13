import json
from flask import jsonify, Blueprint, request
from api.models import contest_table, db
contest_handler = Blueprint('contest_new_handler', __name__)


@contest_handler.route('/create_new_contest', methods=['POST'])
def create_contest():
    if request.method == 'POST':
        body = request.json

        id = body['id']
        title = body['title']
        description = body['description']
        prize_contest = body['prize_contest']
        deadline_date = body['deadline_date']
        created_time = body['created_time']
        update_time = body['update_time']
        contest_creator = body['contestCreator']
        
        new_contest = contest_table(id, title, description, prize_contest, deadline_date, created_time, update_time, contest_creator)
        db.session.add(new_contest)
        db.session.commit()

        return jsonify({'successMessage': 'Contest Created!'})

@contest_handler.route('/contests', methods=['GET'])
def get_all_contests():
    if request.method == 'GET':
        all_contests = contest_table.query.all()
        return jsonify(all_contests)