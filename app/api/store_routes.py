from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Store
from ..forms.store_form import StoreForm

store_routes = Blueprint('stores', __name__)

@store_routes.route('/me', methods=['GET'])
@login_required
def get_user_store():
    """Get the store for the current user."""

    store = Store.query.filter_by(user_id=current_user.id, active=True).first()

    if store:
        return {'store': store.to_dict()}
    return {'errors': {'message': 'Store not found.'}}, 404

@store_routes.route('/', methods=['POST'])
@login_required
def create_store():
    """Create a new store for the current user."""

    form = StoreForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if Store.query.filter_by(user_id=current_user.id, active=True).first():
            return {'errors': {'message': 'Store already exists for this user.'}}, 400

        store = Store(
            user_id=current_user.id,
            name=form.data['name'],
            logo_url=form.data.get('logo_url'),
            theme_color=form.data.get('theme_color'),
            description=form.data.get('description'),
            active=True
        )

        db.session.add(store)
        db.session.commit()
        return {'store': store.to_dict()}, 201
    return {'errors': form.errors}, 400

@store_routes.route('/me', methods=['PUT'])
@login_required
def update_my_store():
    """Update the store for the current user."""

    store = Store.query.filter_by(user_id=current_user.id, active=True).first()

    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    form = StoreForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        store.name = form.data.get('name')
        store.logo_url = form.data.get('logo_url')
        store.theme_color = form.data.get('theme_color')
        store.description = form.data.get('description')
        db.session.commit()
        return {'store': store.to_dict()}
    return {'errors': form.errors}, 400

@store_routes.route('/me', methods=['DELETE'])
@login_required
def delete_my_store():
    """Soft delete (archive) the store for the current user."""

    store = Store.query.filter_by(user_id=current_user.id, active=True).first()

    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404
        
    store.active = False
    db.session.commit()
    return {'message': 'Store archived.'}
