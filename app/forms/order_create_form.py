# app/forms/create_order_form.py

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, Length

class OrderCreateForm(FlaskForm):
    buyer_name = StringField('Buyer Name', validators=[DataRequired(), Length(max=100)])
    buyer_email = StringField('Buyer Email', validators=[DataRequired(), Email(), Length(max=255)])
    # product_ids = StringField('Product IDs', validators=[DataRequired()]) 
