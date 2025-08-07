# app/models/store.py

from .db import db, environment, SCHEMA, add_prefix_for_prod

class Store(db.Model):
    __tablename__ = 'stores'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    logo_url = db.Column(db.String(255))
    theme_color = db.Column(db.String(50))
    description = db.Column(db.String(500))
    active = db.Column(db.Boolean, default=True)

    user = db.relationship('User', backref=db.backref('store', uselist=False))

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
