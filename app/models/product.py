# app/modesl/product.py

from .db import db, environment, SCHEMA, add_prefix_for_prod

product_tags = db.Table(
    'product_tags',
    db.Column('product_id', db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey(add_prefix_for_prod('tags.id')), primary_key=True)
)

class Product(db.Model):
    __tablename__ = 'products'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stores.id')), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500))
    image_url = db.Column(db.String(255))

    tags = db.relationship('Tag', secondary=product_tags, back_populates='products')
    orders = db.relationship('Order', secondary='order_products', back_populates='products')

    def to_dict(self):
        return {
            'id': self.id,
            'store_id': self.store_id,
            'title': self.title,
            'price': self.price,
            'description': self.description,
            'image_url': self.image_url,
            'tags': [tag.name for tag in self.tags]
        }

class Tag(db.Model):
    __tablename__ = 'tags'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    products = db.relationship('Product', secondary=product_tags, back_populates='tags')
