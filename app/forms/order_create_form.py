# app/forms/create_order_form.py

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, Length

# This is for the order creation form
class OrderCreateForm(FlaskForm):
    # This field is for the buyer's name with a max length of 100 characters
    buyer_name = StringField('Buyer Name', validators=[DataRequired(), Length(max=100)])
    # This field is for the buyer's email with a max length of 255 characters
    # It also requires a valid email format
    buyer_email = StringField('Buyer Email', validators=[DataRequired(), Email(), Length(max=255)])
    # product_ids = StringField('Product IDs', validators=[DataRequired()]) 
