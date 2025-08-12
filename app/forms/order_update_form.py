# app/forms/order_update_form.py


from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, AnyOf

# This form is used for updating orders
class OrderUpdateForm(FlaskForm):
    # This field if for the status of the order
    # It must be either 'pending' or 'fulfilled'
    status = StringField(
        'Status',
        validators=[
            DataRequired(),
            AnyOf(['pending', 'fulfilled'], message="Status must be 'pending' or 'fulfilled'.")
        ]
    )