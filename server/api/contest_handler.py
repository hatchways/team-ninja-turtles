import json
from flask import jsonify, Blueprint, request, g
from api import db
from models import Contest, Submission, User, InspirationalImage
from api.middleware import require_auth, get_current_user
from datetime import date, datetime
contest_handler = Blueprint('contest_handler', __name__)


@contest_handler.route('/contest', methods=['POST'])
@require_auth
def create_contest():
    # Create new contests
    if request.method == 'POST':
        request_json = request.get_json()

        title = request_json.get("title")
        description = request_json.get("description")
        prize_contest = request_json.get("prize_contest")
        deadline_date = datetime.strptime(request_json.get("deadline_date"), "%Y-%m-%dT%H:%M:%S.%fZ")
        update_time = datetime.utcnow()
        contest_creator = request_json.get('contest_creator')
        inspirational_images = request_json.get('inspirational_images')

        # Do any images exist?
        try:
            all_inspirational_images = InspirationalImage.query.all()
            if not bool(all_inspirational_images):
                raise Exception
        except Exception as e:
            print(e)
        
        new_contest = Contest(
                                title=title, 
                                description=description, 
                                prize_contest=prize_contest, 
                                deadline_date=deadline_date, 
                                update_time=update_time, 
                                contest_creater=contest_creator
                            )
        for image in inspirational_images:
            for image_object in all_inspirational_images:
                if str(image_object.id) == image:
                    new_contest.inspirational_images.append(image_object)
                    break
        db.session.add(new_contest)
        db.session.commit()
        return jsonify({'successMessage': "Sucessfully created contest"})


@contest_handler.route('/contests', methods=['GET'])
@require_auth
def get_all_contests():
    # Do any contests exist?
    try:
        all_contests = db.session.query(User, Contest).outerjoin(Contest, Contest.contest_creater == User.id).all()
        if not bool(all_contests):
            raise Exception("no contest")
    except Exception as e:
        print(e)
        return jsonify([]), 400
    # Return all contests
    else:
        lst = []
        for pair in all_contests:
            user, contest = pair
            if (user is not None) and (contest is not None):
                lst.append({
                    "img": 0,
                    "name": contest.title,
                    "creator": user.username,
                    "prize": contest.prize_contest,
                    "date": contest.deadline_date.strftime("%Y-%m-%d %H:%M:%S"),
                    "desc": contest.description
                })

        return jsonify(lst), 201


@contest_handler.route('/contest/<contest_id>', methods=['PUT', 'GET'])
@require_auth
def get_contest(contest_id):
    # Does contest exist?
    try:
        contest = Contest.query.get(contest_id)
        if contest == None:
            raise Exception
    except Exception:
        return jsonify("Contest does not exist")

    #Load user info
    try:
        user = User.query.filter_by(id=contest.contest_creater).first()
        if user == None: 
            raise Exception
    except Exception:
        return jsonify("Contest owner not found")
    
    #Load submissions
    allSubmissions = db.session.query(Submission.image_link, User.username).filter_by(contest_id=contest_id).join(User, User.id == Submission.submiter_id).all()
    
    formatedSubmissions = []

    for pair in allSubmissions:
        imgLink, username = pair
        formatedSubmissions.append({
            "img": imgLink,
            "creater": username
        })

    # Return contest contents
    if request.method == 'GET':
        setattr(contest, 'designs', formatedSubmissions)
        setattr(contest, 'creater_name', user.username)
        return json.dumps(contest.__dict__, default=str)

    # Update contest contents
    if request.method == 'PUT':
        contest.title = request.json['title']
        contest.description = request.json['description']
        contest.prize_contest = request.json['amount']
        contest.deadline_date = request.json['deadline_date']
        contest.update_time = date.today()

        db.session.commit()

        return jsonify({'successMessage': 'Contest Updated!'})


@contest_handler.route('/contests/owned/<user_id>', methods=['GET'])
@require_auth
def get_owned_contests(user_id):
    # Do any contests exist for this user?
    try:
        all_owned_contests = Contest.query.filter_by(contest_creater = user_id).all()
        if not bool(all_owned_contests):
            raise Exception
    except Exception:
        return jsonify("No contests listed")

    # Return all contests owned by user
    else:
        dictionary = {}
        counter = 0
        for contest in all_owned_contests:
            dictionary["contest_{contest_number}".format(contest_number = counter)] = contest.__dict__
            counter += 1
        return json.dumps(dictionary, default=str)


@contest_handler.route('/contests/submitted/to/<user_id>', methods=['GET'])
@require_auth
def get_submitted_to_contests(user_id):
    # Do any submissions exist for this user?
    try:
        all_user_submissions = Submission.query.all()
        if not bool(all_user_submissions):
            raise Exception
    except Exception:
        return jsonify("No submissions listed")
    
    # Return all contests owned by user
    else:
        dictionary = {}
        counter = 0
        for submission in all_user_submissions:
            contest = Contest.query.filter_by(id=submission.contest_id).first()
            dictionary["contest_{contest_number}".format(contest_number = counter)] = contest.__dict__
            counter += 1
        return json.dumps(dictionary, default=str)

