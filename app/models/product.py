# app/modesl/product.py

from .db import db, environment, SCHEMA, add_prefix_for_prod
from .order import order_products 

# This is the many-to-many relationship table for products and tags
# This allows a product to have multiple tags and a tag to be associated with multiple products
product_tags = db.Table(
    # This is the name of the table
    'product_tags',
    db.Model.metadata,
    db.Column('product_id', db.Integer, db.ForeignKey(add_prefix_for_prod('products.id')), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey(add_prefix_for_prod('tags.id')), primary_key=True),
    # This will ensure the table goes into the correct schema in production
    schema=SCHEMA if environment == "production" else None
)

# This is the Product model
class Product(db.Model):
    # This is the name of the table
    __tablename__ = 'products'
    
    # This is for production environment to add schema
    if environment == "production":
        # This is the schema for the table
        __table_args__ = {'schema': SCHEMA}

    # These are the columns in the products table
    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stores.id')), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500))
    image_url = db.Column(db.String(255))
    in_stock = db.Column(db.Boolean, default=True, nullable=False)

    # These are the relationships for the product model
    tags = db.relationship('Tag', secondary=product_tags, back_populates='products')
    orders = db.relationship('Order', secondary=order_products, back_populates='products')

    # This is the method to convert the product to a dictionary format
    # This is useful for returning the product data in API responses
    def to_dict(self):
        return {
            'id': self.id,
            'store_id': self.store_id,
            'title': self.title,
            'price': self.price,
            'description': self.description,
            'image_url': self.image_url,
            'in_stock': self.in_stock,
            'tags': [tag.name for tag in self.tags]
        }

# This is the Tag model
class Tag(db.Model):
    # This is the name of the table
    __tablename__ = 'tags'

    # This is for production environment to add schema
    if environment == "production":
        # This is the schema for the table
        __table_args__ = {'schema': SCHEMA}

    # These are the columns in the tags table
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    products = db.relationship('Product', secondary=product_tags, back_populates='tags')
