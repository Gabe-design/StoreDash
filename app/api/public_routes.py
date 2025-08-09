# app/api/product_routes.py

from flask import Blueprint, request
from ..models import db, Store, Product, Order

public_routes = Blueprint('public', __name__)

@public_routes.route('/stores/<string:store_name>', methods=['GET'])
def public_storefront(store_name):
    """Get public store and products. Supports filtering by tag (?tag=...) and/or search by product name (?q=...)."""
    store = Store.query.filter_by(name=store_name).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    tag_filter = request.args.get('tag')
    q_filter = request.args.get('q')

    query = Product.query.filter_by(store_id=store.id)

    if q_filter:
        query = query.filter(Product.title.ilike(f"%{q_filter}%"))

    if tag_filter:
        query = query.join(Product.tags).filter(Tag.name == tag_filter)

    products = query.all()

    return {
        'store': store.to_dict(),
        'products': [p.to_dict() for p in products]
    }


@public_routes.route('/stores/<string:store_name>/orders', methods=['POST'])
def public_create_order(store_name):
    """Public: Create a new order for a store using store name."""
    store = Store.query.filter_by(name=store_name, active=True).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    data = request.get_json() or {}
    buyer_name = data.get('buyer_name')
    buyer_email = data.get('buyer_email')
    product_ids = data.get('product_ids', [])

    if not buyer_name or not buyer_email or not product_ids:
        return {'errors': {'message': 'buyer_name, buyer_email, and product_ids are required.'}}, 400

    products = Product.query.filter(Product.id.in_(product_ids), Product.store_id == store.id).all()
    if not products or len(products) != len(product_ids):
        return {'errors': {'message': 'Some products not found for this store.'}}, 400

    order = Order(
        store_id=store.id,
        buyer_name=buyer_name,
        buyer_email=buyer_email,
        # So it can calculate total price based on products
        total_price=calculated_total,
        # So it always defaults to pending after creating purchase
        status='pending' 
    )
    order.products = products
    db.session.add(order)
    db.session.commit()

    return {'order': order.to_dict()}, 201
