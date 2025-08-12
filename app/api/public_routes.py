# app/api/product_routes.py

from flask import Blueprint, request
from ..models import db, Store, Tag, Product, Order

# This is the blueprint name for product-related routes
public_routes = Blueprint('public', __name__)

# This is the route to get all products for a public store
@public_routes.route('/stores/<string:store_name>', methods=['GET'])
def public_storefront(store_name):
    """Get public store and products. Supports filtering by tag (?tag=...) and/or search by product name (?q=...)."""
    # This is the public route to get products for a store by its name
    store = Store.query.filter_by(name=store_name).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    # This is the optional query parameters for filtering products
    tag_filter = request.args.get('tag')
    q_filter = request.args.get('q')
    # This is the query to get products for the store, with optional filtering
    query = Product.query.filter_by(store_id=store.id)
    # Apply filters if provided
    if q_filter:
        query = query.filter(Product.title.ilike(f"%{q_filter}%"))

    if tag_filter:
        query = query.join(Product.tags).filter(Tag.name == tag_filter)
    # This will execute the query and get the products
    products = query.all()
    # Returns the store and its products in a dictionary format
    return {
        'store': store.to_dict(),
        'products': [p.to_dict() for p in products]
    }

# This is the route to create an order for a public store
@public_routes.route('/stores/<string:store_name>/orders', methods=['POST'])
def public_create_order(store_name):
    """Public: Create a new order for a store using store name."""
    # This is the public route to create an order for a store by its name
    store = Store.query.filter_by(name=store_name, active=True).first()
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404
    # This is the data from the request to create an order
    data = request.get_json() or {}
    buyer_name = data.get('buyer_name')
    buyer_email = data.get('buyer_email')
    product_ids = data.get('product_ids', [])

    # This will validate required fields
    if not buyer_name or not buyer_email or not product_ids:
        return {
            'errors': {
                'message': 'buyer_name, buyer_email, and product_ids are required.'
            }
        }, 400

    # To ensure product_ids is a list of ints
    if not isinstance(product_ids, list) or not all(isinstance(pid, int) for pid in product_ids):
        return {'errors': {'message': 'product_ids must be a list of integers.'}}, 400

    # This is to query products for this store
    products = Product.query.filter(
        Product.id.in_(product_ids),
        Product.store_id == store.id
    ).all()
    # If no products found or mismatch in count, return error
    if not products or len(products) != len(product_ids):
        return {'errors': {'message': 'Some products not found for this store.'}}, 400

    # This calculates total price
    total_price = sum(p.price for p in products)

    # This creatse the order
    order = Order(
        store_id=store.id,
        buyer_name=buyer_name,
        buyer_email=buyer_email,
        total_price=total_price,
        # Always defaults to pending
        status='pending'  
    )
    # This associates products with the order
    order.products = products
    db.session.add(order)
    db.session.commit()
    # This returns the created order in a dictionary format
    return {'order': order.to_dict()}, 201