# app/api/product_routes.py

from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Store, Product, Tag
from ..forms.product_form import ProductForm

# This is the blueprint for product-related routes
product_routes = Blueprint('products', __name__)

# This route gets all products for the current user's store
@product_routes.route('', methods=['GET'])
@login_required
def get_products():
    """Query for all products for the current user's store and returns them in a list of product dictionaries."""

    # This will get the store for the current user
    # And iff the store is not found, it will return an error
    store = Store.query.filter_by(user_id=current_user.id).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    # This will query all products for the store
    # And it will return the products in a list of dictionaries
    products = Product.query.filter_by(store_id=store.id).all()
    return {'products': [product.to_dict() for product in products]}


# This route creates a new product for the current user's store
@product_routes.route('', methods=['POST'])
@login_required
def create_product():
    """Create a new product for the current user's store."""

    # This will validate the form data for creating a product
    # And then it will set the CSRF token from the request cookies
    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()
    # And if the store is not found, it will return an error
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    # This will validate the form data for creating a product
    if form.validate_on_submit():
        # This will create a new product with the form data
        product = Product(
            store_id=store.id,
            title=form.data['title'],
            price=form.data['price'],
            description=form.data.get('description'),
            image_url=form.data.get('image_url')
        )

        # This will add the product to the database
        # And it will handle tags if provided
        tags_list = [tag.strip() for tag in (form.data.get('tags') or '').split(',') if tag.strip()]
        # This will ensure that tags are created or fetched from the database
        for tag_name in tags_list:
            tag = Tag.query.filter_by(name=tag_name).first()
            # If the tag does not exist, it will create a new one
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            # This will append the tag to the product's tags
            product.tags.append(tag)
        # This will add the product to the session and commit it to the database
        db.session.add(product)
        # This will commit the changes to the database
        db.session.commit()
        # This will return the product in a dictionary format
        return {'products': product.to_dict()}
    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route gets a product by its ID for the current user's store
@product_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_product(id):
    """Query for a product by id and returns that product in a dictionary."""

    # This will get the store for the current user
    # And it will get the product by its ID
    store = Store.query.filter_by(user_id=current_user.id).first()
    product = Product.query.get(id)
    # If the product is not found or does not belong to the store, it will return an error
    if not product or not store or product.store_id != store.id:
        return {'errors': {'message': 'Product not found.'}}, 404
    # This will return the product in a dictionary format
    return {'products': product.to_dict()}

# This route updates a product by its ID for the current user's store
@product_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_product(id):
    """Update a product by id for the current user's store."""

    # This will get the store for the current user
    # And it will get the product by its ID
    store = Store.query.filter_by(user_id=current_user.id).first()
    product = Product.query.get(id)
    # If the product is not found or does not belong to the store, it will return an error
    if not product or not store or product.store_id != store.id:
        return {'errors': {'message': 'Product not found.'}}, 404

    # This will validate the form data for updating the product
    # And it will also set the CSRF token from the request cookies
    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # This is for if the form is valid, it will update the product's details
    if form.validate_on_submit():
        product.title = form.data['title']
        product.price = form.data['price']
        product.description = form.data.get('description')
        product.image_url = form.data.get('image_url')

        # This will handle tags if provided
        if form.data.get('tags') is not None:
            product.tags = []
            tags_list = [tag.strip() for tag in (form.data.get('tags') or '').split(',') if tag.strip()]
            # This will ensure that tags are created or fetched from the database
            for tag_name in tags_list:
                # This will query the tag by its name
                tag = Tag.query.filter_by(name=tag_name).first()
                # If the tag does not exist, it will create a new one
                if not tag:
                    # This will create a new tag
                    tag = Tag(name=tag_name)
                    # This will add the tag to the session
                    db.session.add(tag)
                # This will append the tag to the product's tags
                product.tags.append(tag)

        # This will commit the changes to the database
        db.session.commit()
        # This will return the updated product in a dictionary format
        return {'products': product.to_dict()}
    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route deletes a product by its ID for the current user's store
@product_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):
    """Delete a product by id for the current user's store."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()
    # This will get the product by its ID
    product = Product.query.get(id)
    # If the product is not found or does not belong to the store, it will return an error
    if not product or not store or product.store_id != store.id:
        return {'errors': {'message': 'Product not found.'}}, 404

    # This will delete the product from the database
    db.session.delete(product)
    # This will commit the changes to the database
    db.session.commit()
    # And this will return a success message
    return {'message': 'Product Deleted.'}