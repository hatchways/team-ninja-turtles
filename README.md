# flask-starter

## Starting the server:


1. Open a terminal and go to the server folder. Make sure you have **pipenv** installed (`pip install pipenv`)
2. Install the dependencies with `pipenv install`. This also createa a virtual environment, if there isn't one already
3. Activate the virtual environment and start the app with `pipenv run flask run`

Inspirational Images:
1. Updload inspirational images to your aws s3 bucket into a folder named "assets"
2. Route to "/inspirational_images_migration"; This will add all the images in your assets folder into the database model InspirationalImages