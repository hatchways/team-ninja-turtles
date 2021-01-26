from flask import jsonify, Blueprint
from api.models import InspirationalImage
from api import db, s3
from config import S3_BUCKET, S3_REGION
from datetime import datetime
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

@inspirational_images_handler.route('/inspirational_images', methods=['GET'])
def getImages():
    # Do any images exist?
    try:
        all_images = InspirationalImage.query.all()
        if not bool(all_images):
            raise Exception
    except Exception:
        return jsonify("No contests listed")
    # Return all images
    else:
        dictionary = {}
        counter = 0
        for image in all_images:
            dictionary[counter] = image.__dict__
            counter += 1
        return json.dumps(dictionary, default=str)