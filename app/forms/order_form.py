# app/forms/order_form.py

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, Length

# This form is used for creating and updating orders
class OrderForm(FlaskForm):
    # This field is for the buyer's name with a max length of 100 characters
    buyer_name = StringField('Buyer Name', validators=[DataRequired(), Length(max=100)])
    # This field is for the buyer's email with a max length of 255 characters
    # It also requires a valid email format
    buyer_email = StringField('Buyer Email', validators=[DataRequired(), Email(), Length(max=255)])
    # This field is for the order status with a max length of 32 characters
    status = StringField('Status', validators=[DataRequired(), Length(max=32)])
    # This field is for the product IDs with a max length of 255 characters
    product_ids = StringField('Product IDs', validators=[DataRequired()])  # Comma-separated IDs
