# app/models/order.py

from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

order_products = db.Table(
    'order_products',
    db.Column('order_id', db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), primary_key=True),
)

class Order(db.Model):
    __tablename__ = 'orders'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)  
    store_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stores.id')), nullable=False)
    buyer_name = db.Column(db.String(100), nullable=False)
    buyer_email = db.Column(db.String(255), nullable=False)  
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    store = db.relationship('Store', backref=db.backref('orders', lazy=True))
    products = db.relationship('Product', secondary=order_products, back_populates='orders')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'store_id': self.store_id,
            'buyer_name': self.buyer_name,
            'buyer_email': self.buyer_email,
            'total_price': self.total_price,
            'created_at': self.created_at.isoformat(),
            'products': [product.to_dict() for product in self.products]
        }
