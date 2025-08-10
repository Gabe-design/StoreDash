from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Store
from ..forms.store_form import StoreForm

# This is the blueprint for store-related routes
store_routes = Blueprint('stores', __name__)

# This route gets the store for the current user
@store_routes.route('/me', methods=['GET'])
@login_required
def get_user_store():
    """Get the store for the current user."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id, active=True).first()

    # If the store is found, it will return the store in a dictionary format
    if store:
        return {'store': store.to_dict()}
    # If the store is not found, it will return an error
    return {'errors': {'message': 'Store not found.'}}, 404

# This route creates a new store for the current user
@store_routes.route('/', methods=['POST'])
@login_required
def create_store():
    """Create a new store for the current user."""

    # This will validate the form data for creating a store
    # And it will set the CSRF token from the request cookies
    form = StoreForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # This will check if the store already exists for the current user
    if form.validate_on_submit():
        # This will check if the user already has an active store
        if Store.query.filter_by(user_id=current_user.id, active=True).first():
            # If the user already has an active store, it will return an error
            return {'errors': {'message': 'Store already exists for this user.'}}, 400

        # This will create a new store with the form data
        store = Store(
            user_id=current_user.id,
            name=form.data['name'],
            logo_url=form.data.get('logo_url'),
            theme_color=form.data.get('theme_color'),
            description=form.data.get('description'),
            # Set the store as active by default for soft delete functionality
            active=True
        )

        # This will add the store to the database
        db.session.add(store)
        # This will commit the changes to the database
        db.session.commit()
        # This will return the created store in a dictionary format
        return {'store': store.to_dict()}, 201
    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route updates the store for the current user
@store_routes.route('/me', methods=['PUT'])
@login_required
def update_my_store():
    """Update the store for the current user."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id, active=True).first()

    # If the store is not found, it will return an error
    if not store:
        # If the store is not found, it will return an error
        return {'errors': {'message': 'Store not found.'}}, 404

    # This will validate the form data for updating the store
    # And it will set the CSRF token from the request cookies
    form = StoreForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # If the form is valid, it will update the store's details
    if form.validate_on_submit():
        store.name = form.data.get('name')
        store.logo_url = form.data.get('logo_url')
        store.theme_color = form.data.get('theme_color')
        store.description = form.data.get('description')
        # This will commit the changes to the database
        db.session.commit()
        # This will return the updated store in a dictionary format
        return {'store': store.to_dict()}
    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route deletes the store for the current user (soft delete)
@store_routes.route('/me', methods=['DELETE'])
@login_required
def delete_my_store():
    """Soft delete (archive) the store for the current user."""

    # This will get the store for the current user
    # It will also ensure that the store is active
    store = Store.query.filter_by(user_id=current_user.id, active=True).first()

    # If the store is not found, it will return an error
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    # This will set the store's active status to False (soft delete)
    store.active = False
    # This will commit the changes to the database
    db.session.commit()
    # This will return a success message
    return {'message': 'Store archived.'}
