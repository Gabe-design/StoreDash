# app/api/product_routes.py

from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Store, Product, Tag
from ..forms.product_form import ProductForm

product_routes = Blueprint('products', __name__)

@product_routes.route('', methods=['GET'])
@login_required
def get_products():
    """Query for all products for the current user's store and returns them in a list of product dictionaries."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    products = Product.query.filter_by(store_id=store.id).all()
    return {'products': [product.to_dict() for product in products]}

@product_routes.route('', methods=['POST'])
@login_required
def create_product():
    """Create a new product for the current user's store."""

    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    store = Store.query.filter_by(user_id=current_user.id).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    if form.validate_on_submit():
        product = Product(
            store_id=store.id,
            title=form.data['title'],
            price=form.data['price'],
            description=form.data.get('description'),
            image_url=form.data.get('image_url')
        )

        tags_list = [tag.strip() for tag in (form.data.get('tags') or '').split(',') if tag.strip()]
        for tag_name in tags_list:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            product.tags.append(tag)
        db.session.add(product)
        db.session.commit()
        return {'products': product.to_dict()}
    return {'errors': form.errors}, 400

@product_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_product(id):
    """Query for a product by id and returns that product in a dictionary."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    product = Product.query.get(id)
    if not product or not store or product.store_id != store.id:
        return {'errors': {'message': 'Product not found.'}}, 404
    return {'products': product.to_dict()}

@product_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_product(id):
    """Update a product by id for the current user's store."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    product = Product.query.get(id)
    if not product or not store or product.store_id != store.id:
        return {'errors': {'message': 'Product not found.'}}, 404

    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        product.title = form.data['title']
        product.price = form.data['price']
        product.description = form.data.get('description')
        product.image_url = form.data.get('image_url')

        if form.data.get('tags') is not None:
            product.tags = []
            tags_list = [tag.strip() for tag in (form.data.get('tags') or '').split(',') if tag.strip()]
            for tag_name in tags_list:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                product.tags.append(tag)

        db.session.commit()
        return {'products': product.to_dict()}
    return {'errors': form.errors}, 400

@product_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):
    """Delete a product by id for the current user's store."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    product = Product.query.get(id)
    if not product or not store or product.store_id != store.id:
        return {'errors': {'message': 'Product not found.'}}, 404

    db.session.delete(product)
    db.session.commit()
    return {'message': 'Product Deleted.'}