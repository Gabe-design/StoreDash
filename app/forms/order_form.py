# app/forms/order_form.py

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, Length

class OrderForm(FlaskForm):
    buyer_name = StringField('Buyer Name', validators=[DataRequired(), Length(max=100)])
    buyer_email = StringField('Buyer Email', validators=[DataRequired(), Email(), Length(max=255)])
    status = StringField('Status', validators=[DataRequired(), Length(max=32)])
    product_ids = StringField('Product IDs', validators=[DataRequired()])  # Comma-separated IDs
