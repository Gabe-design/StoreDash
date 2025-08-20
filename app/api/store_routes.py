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
    store = Store.query.filter_by(user_id=current_user.id).first()

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
    form.csrf_token.data = request.cookies.get('csrf_token')

    # This will check if the store already exists for the current user
    if form.validate_on_submit():
        # This will check if the user already has a store
        if Store.query.filter_by(user_id=current_user.id).first():
            # If the user already has a store, it will return an error
            return {'errors': {'message': 'Store already exists for this user.'}}, 400

        # This will create a new store with the form data
        store = Store(
            user_id=current_user.id,
            name=form.data['name'],
            logo_url=form.data.get('logo_url'),
            theme_color=form.data.get('theme_color'),
            description=form.data.get('description')
        )

        try:
            # This will add the store to the database
            db.session.add(store)
            # This will commit the changes to the database
            db.session.commit()
            # This will return the created store in a dictionary format
            return {'store': store.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'errors': {'message': 'Database error', 'details': str(e)}}, 500

    # If the form is not valid, it will return the errors
    return {'errors': form.errors}, 400

# This route updates the store for the current user,
# or creates it if it does not already exist
@store_routes.route('/me', methods=['PUT'])
@login_required
def update_my_store():
    """Update the store for the current user, or create it if none exists."""

    # This will attempt to get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()

    # This will validate the form data for creating/updating the store
    form = StoreForm()
    form.csrf_token.data = request.cookies.get('csrf_token')

    # If the form is valid, proceed
    if form.validate_on_submit():
        if store:
            # If the store exists, update its details
            store.name = form.data.get('name')
            store.logo_url = form.data.get('logo_url')
            store.theme_color = form.data.get('theme_color')
            store.description = form.data.get('description')
        else:
            # If the store does not exist, create a new one with the given data
            store = Store(
                user_id=current_user.id,
                name=form.data.get('name'),
                logo_url=form.data.get('logo_url'),
                theme_color=form.data.get('theme_color'),
                description=form.data.get('description')
            )
            db.session.add(store)  # This will add the new store to the session

        try:
            # This will commit either the updates or the new store to the database
            db.session.commit()
            # This will return the updated or newly created store in a dictionary format
            return {'store': store.to_dict()}
        except Exception as e:
            db.session.rollback()
            return {'errors': {'message': 'Database error', 'details': str(e)}}, 500

    # If the form is not valid, return the validation errors
    return {'errors': form.errors}, 400


# This route deletes the store for the current user (hard delete)
@store_routes.route('/me', methods=['DELETE'])
@login_required
def delete_my_store():
    """Permanently delete the store for the current user."""

    # This will get the store for the current user
    store = Store.query.filter_by(user_id=current_user.id).first()

    # If the store is not found, it will return an error
    if not store:
        return {'errors': {'message': 'Store not found.'}}, 404

    try:
        # This will permanently delete the store from the database
        db.session.delete(store)
        # This will commit the changes to the database
        db.session.commit()
        # This will return a success message
        return {'message': 'Store permanently deleted.'}
    except Exception as e:
        db.session.rollback()
        return {'errors': {'message': 'Database error', 'details': str(e)}}, 500
