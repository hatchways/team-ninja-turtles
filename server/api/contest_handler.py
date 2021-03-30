import json
from flask import jsonify, Blueprint, request
from api import db
from models import Contest, Submission, User, InspirationalImage, InspirationalImageContestLink
from api.middleware import require_auth, get_current_user
from datetime import date, datetime
from api.inspirational_images_handler import get_contest_inspirational_images
import jwt
import app
contest_handler = Blueprint('contest_handler', __name__)


@contest_handler.route('/contest', methods=['POST'])
@require_auth
@get_current_user
def create_contest(current_user):
    # Create new contests
    if request.method == 'POST':
        request_json = request.get_json()

        title = request_json.get("title")
        description = request_json.get("description")
        prize_contest = request_json.get("prize_contest")
        deadline_date = datetime.strptime(request_json.get("deadline_date"), "%Y-%m-%dT%H:%M:%S.%fZ")
        update_time = datetime.utcnow()
        contest_creator = current_user.id
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
        return jsonify({'successMessage': "Sucessfully created contest", 'contest_id': new_contest.id})


@contest_handler.route('/contests', methods=['GET'])
def get_all_ongoing_contests():
    # Do any contests exist?
    try:
        contains = request.args.get('contains')
        all_contests = db.session.query(User, Contest).outerjoin(Contest, Contest.contest_creater == User.id).filter(Contest.title.ilike("%%%s%%" % contains)).all()
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
            if (user is not None) and (contest is not None) and contest.deadline_date > datetime.utcnow():
                # Load contest inspirational image
                ins_image_link = db.session.query(InspirationalImage.image_link).join(InspirationalImageContestLink, InspirationalImageContestLink.image_id==InspirationalImage.id).filter_by(contest_id=contest.id).first()
                lst.append({
                    "id" : contest.id,
                    "img": ins_image_link,
                    "name": contest.title,
                    "creator": user.username,
                    "prize": contest.prize_contest,
                    "date": contest.deadline_date.strftime("%Y-%m-%d %H:%M:%S"),
                    "desc": contest.description
                })

        return jsonify(lst), 200


@contest_handler.route('/contest/<contest_id>', methods=['PUT', 'GET'])
def get_contest(contest_id):
    # Does contest exist?
    try:
        contest = Contest.query.get(contest_id)
        if contest is None:
            raise Exception
    except Exception as e:
        return jsonify("Contest does not exist")

    try:
        token = request.cookies.get("auth_token")
        data = jwt.decode(token, app.app.config['JWT_SECRET'], algorithms=['HS256'])
        current_user = User.query.filter_by(username=data['user']).first()
    except Exception as e:
        print(e)
        current_user = None

    if request.method == 'GET':
        # Load user info
        try:
            contest_creator_user = User.query.filter_by(id=contest.contest_creater).first()
            if contest_creator_user is None:
                raise Exception
        except Exception as e:
            return jsonify("Contest owner not found")

        if current_user is None:
            all_submissions = []
        elif contest_creator_user == current_user: # Owner is trying to access, return designs as well
            # Load submissions
            all_submissions = db.session.query(Submission, User.username).\
                filter_by(contest_id=contest_id).join(User, User.id == Submission.submiter_id).all()
            setattr(contest, 'is_owner', True)
        else:
            all_submissions = db.session.query(Submission, User.username).\
                filter_by(contest_id=contest_id, submiter_id=current_user.id).\
                join(User, User.id == Submission.submiter_id).all()

        formatted_submissions = []

        for pair in all_submissions:
            submission, username = pair
            formatted_submissions.append({
                "img": submission.image_link,
                "submission_id": submission.id,
                "creater": username
            })

        attached_inspirational_images = get_contest_inspirational_images(contest_id)[0]

    # Return contest contents
        setattr(contest, 'designs', formatted_submissions)
        setattr(contest, 'creater_name', contest_creator_user.username)
        setattr(contest, 'attached_inspirational_images', attached_inspirational_images)
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
def get_owned_contests(user_id):
    # Do any contests exist for this user?
    try:
        user = User.query.filter_by(username=user_id).first()
        all_owned_contests = Contest.query.filter_by(contest_creater=user.id).all()
        if not bool(all_owned_contests):
            raise Exception
    except Exception:
        return jsonify("No contests listed")

    # Return all contests owned by user
    else:
        result = []
        counter = 0
        for contest in all_owned_contests:
            ins_image_link = db.session.query(InspirationalImage.image_link).\
                join(InspirationalImageContestLink,  InspirationalImageContestLink.image_id == InspirationalImage.id).\
                filter_by(contest_id=contest.id).first()

            result.append({
                "id": contest.id,
                "title": contest.title,
                "description": contest.description,
                "prize": contest.prize_contest,
                "deadline": contest.deadline_date,
                "img": ins_image_link
            })
            counter += 1
        return jsonify(result), 200


@contest_handler.route('/contests/submitted/', methods=['GET'])
@require_auth
@get_current_user
def get_submitted_to_contests(user):
    # Do any submissions exist for this user?
    try:
        all_user_submissions = Submission.query.filter_by(submiter_id=user.id).all()
        if not bool(all_user_submissions):
            raise Exception
    except Exception as e:
        return jsonify([]), 200
    
    # Return all contests owned by user
    else:
        dictionary = {}
        for submission in all_user_submissions:
            contest = Contest.query.filter_by(id=submission.contest_id).first()
            if contest.id not in contest:
                ins_image_link = db.session.query(InspirationalImage.image_link). \
                    join(InspirationalImageContestLink,
                         InspirationalImageContestLink.image_id == InspirationalImage.id). \
                    filter_by(contest_id=contest.id).first()

                dictionary[contest.id] = {
                    "id": contest.id,
                    "title": contest.title,
                    "description": contest.description,
                    "prize": contest.prize_contest,
                    "deadline": contest.deadline_date,
                    "img": ins_image_link
                }

        return jsonify([contest for contest in dictionary]), 201
    

@contest_handler.route('/contest_winner', methods=['POST'])
def set_contest_winner():
    # Does contest exist?
    request_json = request.get_json()

    contest_id = request_json.get("contest_id")
    winning_submission_id = request_json.get("winning_submission_id")
    try:
        contest = Contest.query.get(contest_id)
        if contest is None:
            raise Exception
    except Exception as e:
        return jsonify("Contest or winning user does not exist", str(e))
    
    else:
        if contest.deadline_date > datetime.utcnow():
            return jsonify("Deadline date has not been reached")
        contest.winner = winning_submission_id
        db.session.commit()
        #TODO: Payment goes through
        return jsonify("Succesfully declared winner")
