# app/forms/order_update_form.py


from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, AnyOf

class OrderUpdateForm(FlaskForm):
    status = StringField(
        'Status',
        validators=[
            DataRequired(),
            AnyOf(['pending', 'fulfilled'], message="Status must be 'pending' or 'fulfilled'.")
        ]
    )