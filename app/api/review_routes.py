# app/api/review_routes.py

from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Review, Product
from ..forms.review_form import ReviewForm

review_routes = Blueprint('reviews', __name__)

@review_routes.route('', methods=['POST'])
@login_required
def create_review():
    """Create a review for a product."""

    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    data = request.get_json() or {}
    product_id = data.get('product_id')
    product = Product.query.get(product_id)

    if not product:
        return {'errors': {'message': 'Product not found.'}}, 404

    if form.validate_on_submit():
        review = Review(
            user_id=current_user.id,
            product_id=product_id,
            rating=form.data['rating'],
            comment=form.data.get('comment')
        )
        db.session.add(review)
        db.session.commit()
        return {'review': review.to_dict()}, 201
    return {'errors': form.errors}, 400

@review_routes.route('/product/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    """Get all reviews for a product."""

    product = Product.query.get(product_id)

    if not product:
        return {'errors': {'message': 'Product not found.'}}, 404

    reviews = Review.query.filter_by(product_id=product_id).all()
    return {'reviews': [review.to_dict() for review in reviews]}, 200

@review_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_review(id):
    """Update a review (only by author)."""

    review = Review.query.get(id)

    if not review or review.user_id != current_user.id:
        return {'errors': {'message': 'Review not found or forbidden.'}}, 404

    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        review.rating = form.data['rating']
        review.comment = form.data.get('comment')
        db.session.commit()
        return {'review': review.to_dict()}
    return {'errors': form.errors}, 400

@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    """Delete a review (only by author)."""

    review = Review.query.get(id)

    if not review or review.user_id != current_user.id:
        return {'errors': {'message': 'Review not found or forbidden.'}}, 404

    db.session.delete(review)
    db.session.commit()
    return {'message': 'Review deleted.'}
