# app/models/review.py

from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

# This is the Review model
class Review(db.Model):
    # This is the name of the table
    __tablename__ = 'reviews'

    # This is for production environment to add schema
    if environment == "production":
        # This is the schema for the table
        __table_args__ = {'schema': SCHEMA}

    # These are the columns in the reviews table
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # These are the relationships for the review model
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    product = db.relationship('Product', backref=db.backref('reviews', lazy=True))

    # This is the method to convert the review to a dictionary format
    # This is useful for returning the review data in API responses
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
