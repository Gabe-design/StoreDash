# app/api/image_routes.py

import os
from flask import Blueprint, request, current_app
from werkzeug.utils import secure_filename
from datetime import datetime

# Thsi is the blueprint for image-related routes
image_routes = Blueprint('images', __name__)

# This is a helper function to check allowed file extensions
def allowed_file(filename):
    allowed = current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif'})
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

# This route handles image uploads
@image_routes.route('/upload', methods=['POST'])
def upload_image():
    """Upload an image for a product/store and return the file URL."""

    # This will check if the request has a file part
    if 'image' not in request.files:
        return {'errors': {'message': 'No file part.'}}, 400
    # This will get the file from the request
    file = request.files['image']
    if file.filename == '':
        return {'errors': {'message': 'No selected file.'}}, 400
    # This will check if the file is allowed
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = secure_filename(f"{timestamp}.{ext}")
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))
        url = f"/uploads/{filename}"
        return {'url': url}
    else:
        return {'errors': {'message': 'File type not allowed.'}}, 400
