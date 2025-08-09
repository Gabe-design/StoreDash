# app/api/order_routes.py

from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Store, Order, Product
from ..forms.order_form import OrderForm
from ..forms.order_create_form import OrderCreateForm

order_routes = Blueprint('orders', __name__)

@order_routes.route('', methods=['GET'])
@login_required
def get_orders():
    """Query for all orders for the current user's store."""

    store = Store.query.filter_by(user_id=current_user.id).first()

    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404
    orders = Order.query.filter_by(store_id=store.id).all()
    return {'orders': [order.to_dict() for order in orders]}

@order_routes.route('', methods=['POST'])
def create_order():

    """Public: Create a new order for a store. (No login required)"""

    data = request.get_json() or {}
    store_id = data.get('store_id')
    store = Store.query.get(store_id)

    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    form = OrderCreateForm(data=data)
    form['csrf_token'].data = request.cookies.get('csrf_token', '')

    if form.validate_on_submit():
        product_ids = data.get('products', [])
        if not isinstance(product_ids, list) or not all(isinstance(pid, int) for pid in product_ids):
            return {'errors': {'message': 'Products must be a list of integers.'}}, 400

        products = Product.query.filter(Product.id.in_(product_ids), Product.store_id == store.id).all()
        if len(products) != len(product_ids):
            return {'errors': {'message': 'Some products not found for this store.'}}, 400

        order = Order(
            store_id=store.id,
            buyer_name=form.data['buyer_name'],
            buyer_email=form.data['buyer_email'],
            status='pending'
        )
        order.products = products
        db.session.add(order)
        db.session.commit()
        return {'order': order.to_dict()}, 201

    return {'errors': form.errors}, 400

@order_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_order(id):
    """Query for an order by id for the current user's store."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    order = Order.query.get(id)

    if not order or not store or order.store_id != store.id:
        return {'errors': {'message': 'Order not found.'}}, 404
    return {'orders': order.to_dict()}

@order_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_order(id):
    """Update an order's status for the current user's store."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    order = Order.query.get(id)
    
    if not order or not store or order.store_id != store.id:
        return {'errors': {'message': 'Order not found.'}}, 404

    form = OrderForm()
    form['csrf_token'].data = request.cookies.get('csrf_token', '')

    if form.validate_on_submit():
        order.status = form.data.get('status') or order.status
        db.session.commit()
        return {'orders': order.to_dict()}
    return {'errors': form.errors}, 400

@order_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_order(id):
    """Delete an order for the current user's store."""

    store = Store.query.filter_by(user_id=current_user.id).first()
    order = Order.query.get(id)

    if not order or not store or order.store_id != store.id:
        return {'errors': {'message': 'Order not found.'}}, 404
    db.session.delete(order)
    db.session.commit()
    return {'message': 'Order Deleted.'}
