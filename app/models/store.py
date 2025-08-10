# app/models/store.py

from .db import db, environment, SCHEMA, add_prefix_for_prod

# This is the Store model
class Store(db.Model):
    # This is the name of the table
    __tablename__ = 'stores'
    
    # This is for production environment to add schema
    if environment == "production":
        # This is the schema for the table
        __table_args__ = {'schema': SCHEMA}

    # These are the columns in the stores table
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    logo_url = db.Column(db.String(255))
    theme_color = db.Column(db.String(50))
    description = db.Column(db.String(500))
    active = db.Column(db.Boolean, default=True)

    # This is the relationship for the store model
    user = db.relationship('User', backref=db.backref('store', uselist=False))

    # This is the method to convert the store to a dictionary format
    # This is useful for returning the store data in API responses
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'logo_url': self.logo_url,
            'theme_color': self.theme_color,
            'description': self.description,
            'active': self.active
        }
