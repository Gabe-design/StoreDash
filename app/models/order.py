# app/models/order.py

from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

# This is the many-to-many relationship table for orders and products
# This is so it allows an order to have multiple products and a product to be part of multiple orders
order_products = db.Table(
    # This is the name of the table
    'order_products',
    db.Model.metadata,
    # This is the foreign key to the orders table
    db.Column('order_id', db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), primary_key=True),
    # This is the foreign key to the products table
    db.Column('product_id', db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), primary_key=True),
    # This will ensure the table goes into the correct schema in production
    schema=SCHEMA if environment == "production" else None
)

# This is the Order model
class Order(db.Model):
    # This is the name of the table
    __tablename__ = 'orders'
    
    # This is for production environment to add schema
    if environment == "production":
        # This is the schema for the table
        __table_args__ = {'schema': SCHEMA}

    # These are the columns in the orders table
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)  
    store_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stores.id')), nullable=False)
    buyer_name = db.Column(db.String(100), nullable=False)
    buyer_email = db.Column(db.String(255), nullable=False)  
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(32), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # These three are the relationships for the order model
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    store = db.relationship('Store', backref=db.backref('orders', lazy=True))
    products = db.relationship('Product', secondary=order_products, back_populates='orders')

    # This is the method to convert the order to a dictionary format
    # This is useful for returning the order data in API responses
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'store_id': self.store_id,
            'buyer_name': self.buyer_name,
            'buyer_email': self.buyer_email,
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'products': [product.to_dict() for product in self.products]
        }
