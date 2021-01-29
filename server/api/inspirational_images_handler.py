from flask import jsonify, Blueprint, request
from api.models import InspirationalImage, Contest, InspirationalImageContestLink
from api import db, s3
from config import S3_BUCKET, S3_REGION
from datetime import datetime
from sqlalchemy.orm import sessionmaker
import boto3
import json

inspirational_images_handler = Blueprint("inspirational_images_handler", __name__)

@inspirational_images_handler.route('/inspirational_images_migration')
def migrateImages():
    s3_resource = boto3.resource('s3')
    my_bucket = s3_resource.Bucket(S3_BUCKET)
    summaries = my_bucket.objects.filter(Prefix='assets/')
    image_link_prefix = "https://{bucket}.s3.{region}.amazonaws.com/".format(bucket=S3_BUCKET, region=S3_REGION)
    for s3_file in summaries:
        if (s3_file.key.endswith(".png") or
            s3_file.key.endswith(".jpeg") or
            s3_file.key.endswith(".gif")):

            image_link = image_link_prefix + s3_file.key
            new_image_model = InspirationalImage(image_link=image_link,
                                                update_time=datetime.utcnow())
            db.session.add(new_image_model)

    db.session.commit()
    return jsonify({'successMessage': 'Images updated'})

@inspirational_images_handler.route('/add_inspirational_images', methods=['POST'])
def addImages():

    request_json = request.get_json()
    image_link = request_json.get("link")
    new_image_model = InspirationalImage(image_link=image_link, update_time=datetime.utcnow())
    db.session.add(new_image_model)

    db.session.commit()
    return jsonify({'successMessage': 'Images updated'})

@inspirational_images_handler.route('/inspirational_images', methods=['GET'])
def getImages():
    # Do any images exist?
    try:
        all_images = InspirationalImage.query.order_by(InspirationalImage.created_time.desc()).all()
        if not bool(all_images):
            raise Exception
    except Exception:
        return jsonify("No images listed")
    # Return all images
    else:
        dictionary = {}
        counter = 0
        for image in all_images:
            dictionary[counter] = image.__dict__
            counter += 1
        return json.dumps(dictionary, default=str)

@inspirational_images_handler.route('/inspirational_images/<contest_id>', methods=['GET'])
def get_contest_inspirational_images(contest_id):
    try:
        all_data = db.session.query(Contest, InspirationalImage).filter(Contest.id == contest_id,
            InspirationalImageContestLink.contest_id == Contest.id, 
            InspirationalImageContestLink.image_id == InspirationalImage.id).order_by(InspirationalImageContestLink.contest_id).all()
        if not bool(all_data):
            raise Exception
    except Exception as e:
        return jsonify(str(e))

    else:
        images = []
        for data in all_data:
            images.append(data.InspirationalImage.image_link)
        return jsonify(images)