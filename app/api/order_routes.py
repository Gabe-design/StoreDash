# app/api/order_routes.py

from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Store, Order, Product
from ..forms.order_form import OrderForm
# from ..forms.order_create_form import OrderCreateForm
from ..forms.order_update_form import OrderUpdateForm

# This is the blueprint for order-related routes
order_routes = Blueprint('orders', __name__)

# This route gets all orders for the current user's store
@order_routes.route('', methods=['GET'])
@login_required
def get_orders():
    """Query for all orders for the current user's store."""
    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()
    # If the store is not found, it will return an empty list
    if not store:
        return {'orders': []}, 200
    # This will query all orders for the store
    orders = Order.query.filter_by(store_id=store.id).all()
    # This will return the orders in a list of dictionaries
    return {'orders': [order.to_dict() for order in orders]}

# Commented out to avoid confusion with public order creation
# @order_routes.route('', methods=['POST'])
# def create_order():
#
#     """Public: Create a new order for a store. (No login required)"""
#
#     data = request.get_json() or {}
#     store_id = data.get('store_id')
#     store = Store.query.get(store_id)
#
#     if not store:
#         return {'errors': {'message': 'Store not found.'}}, 404
#
#     form = OrderCreateForm(data=data)
#     form['csrf_token'].data = request.cookies.get('csrf_token', '')
#
#     if form.validate_on_submit():
#         product_ids = data.get('products', [])
#         if not isinstance(product_ids, list) or not all(isinstance(pid, int) for pid in product_ids):
#             return {'errors': {'message': 'Products must be a list of integers.'}}, 400
#
#         products = Product.query.filter(Product.id.in_(product_ids), Product.store_id == store.id).all()
#         if len(products) != len(product_ids):
#             return {'errors': {'message': 'Some products not found for this store.'}}, 400
#
#         order = Order(
#             store_id=store.id,
#             buyer_name=form.data['buyer_name'],
#             buyer_email=form.data['buyer_email'],
#             status='pending'
#         )
#         order.products = products
#         db.session.add(order)
#         db.session.commit()
#         return {'order': order.to_dict()}, 201
#
#     return {'errors': form.errors}, 400

# This route gets an order by its ID for the current user's store
@order_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_order(id):
    """Query for an order by id for the current user's store."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()
    # This will get the order by its ID
    order = Order.query.get(id)

    # If the order is not found or does not belong to the store, it will return an error
    if not order or not store or order.store_id != store.id:
        return {'errors': {'message': 'Order not found.'}}, 404
    # This will return the order in a dictionary format
    return {'orders': order.to_dict()}

# This route  will update an order's status for the current user's store
@order_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_order(id):
    """Update an order's status for the current user's store."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()
    # This will get the order by its ID
    order = Order.query.get(id)
    # If the order is not found or does not belong to the store, it will return an error
    if not order or not store or order.store_id != store.id:
        return {'errors': {'message': 'Order not found.'}}, 404

    # This will validate the form data for updating the order
    form = OrderUpdateForm()
    # This will set the CSRF token from the request cookies
    form['csrf_token'].data = request.cookies.get('csrf_token', '')

    # This is for if the form is valid, it will update the order's status
    if form.validate_on_submit():
        order.status = form.data['status']
        db.session.commit()
        return {'orders': order.to_dict()}
    
    # And if the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route deletes an order for the current user's store
@order_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_order(id):
    """Delete an order for the current user's store."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()
    # This will get the order by its ID
    order = Order.query.get(id)

    # This is for if the order is not found and/or does not belong to the store, it will return an error
    if not order or not store or order.store_id != store.id:
        return {'errors': {'message': 'Order not found.'}}, 404
    # This will delete the order from the database
    db.session.delete(order)
    # This will commit the changes to the database
    db.session.commit()
    # And this will return a success message
    return {'message': 'Order Deleted.'}
