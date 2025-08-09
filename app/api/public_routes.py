# app/api/product_routes.py

from flask import Blueprint, request
from ..models import db, Store, Product, Tag

public_routes = Blueprint('public', __name__)

@public_routes.route('/stores/<string:store_name>', methods=['GET'])
def public_storefront(store_name):
    """Get public store and products. Supports filtering by tag (?tag=...) and/or search by product name (?q=...)."""\

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
