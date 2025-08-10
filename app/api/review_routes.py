# app/api/review_routes.py

from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Review, Product
from ..forms.review_form import ReviewForm

# This is the blueprint for review-related routes
review_routes = Blueprint('reviews', __name__)

# This route creates a new review for a product by the current user
@review_routes.route('', methods=['POST'])
@login_required
def create_review():
    """Create a review for a product."""

    # This will validate the form data for creating a review
    form = ReviewForm()
    # This will set the CSRF token from the request cookies
    form['csrf_token'].data = request.cookies['csrf_token']
    # This will get the product ID from the request data
    data = request.get_json() or {}
    # This will get the product by its ID
    product_id = data.get('product_id')
    # This will query the product by its ID
    product = Product.query.get(product_id)

    # If the product is not found, it will return an error
    if not product:
        return {'errors': {'message': 'Product not found.'}}, 404

    # If the form is valid, it will create a new review
    if form.validate_on_submit():
        # This will create a new review with the form data
        review = Review(
            user_id=current_user.id,
            product_id=product_id,
            rating=form.data['rating'],
            comment=form.data.get('comment')
        )
        # This will add the review to the database
        db.session.add(review)
        # This will commit the changes to the database
        db.session.commit()
        # This will return the created review in a dictionary format
        return {'review': review.to_dict()}, 201
    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route gets all reviews for a product
@review_routes.route('/product/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    """Get all reviews for a product."""

    # This will query the product by its ID
    product = Product.query.get(product_id)

    # If the product is not found, it will return an error
    if not product:
        return {'errors': {'message': 'Product not found.'}}, 404

    # This will query all reviews for the product
    reviews = Review.query.filter_by(product_id=product_id).all()
    # This will return the reviews in a list of dictionaries
    return {'reviews': [review.to_dict() for review in reviews]}, 200

# This route updates a review by its ID (only by the author)
@review_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_review(id):
    """Update a review (only by author)."""

    # This will get the review by its ID
    review = Review.query.get(id)

    # If the review is not found or does not belong to the current user, it will return an error
    if not review or review.user_id != current_user.id:
        return {'errors': {'message': 'Review not found or forbidden.'}}, 404

    # This will validate the form data for updating the review
    form = ReviewForm()
    # This will set the CSRF token from the request cookies
    form['csrf_token'].data = request.cookies['csrf_token']

    # If the form is valid, it will update the review's rating and comment
    if form.validate_on_submit():
        review.rating = form.data['rating']
        review.comment = form.data.get('comment')
        db.session.commit()
        # This will return the updated review in a dictionary format
        return {'review': review.to_dict()}
    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route deletes a review by its ID (only by the author)
@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    """Delete a review (only by author)."""

    # This will get the review by its ID
    review = Review.query.get(id)

    # If the review is not found or does not belong to the current user, it will return an error
    if not review or review.user_id != current_user.id:
        
        return {'errors': {'message': 'Review not found or forbidden.'}}, 404

    # This will delete the review from the database
    db.session.delete(review)
    # This will commit the changes to the database
    db.session.commit()
    # This will return the success message
    return {'message': 'Review deleted.'}
