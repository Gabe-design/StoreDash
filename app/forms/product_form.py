# app/forms/product_form.py

from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField
from wtforms.validators import DataRequired, Length, Optional, URL, NumberRange

class ProductForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=255)])
    price = DecimalField('Price', validators=[DataRequired(), NumberRange(min=0)], places=2)
    description = StringField('Description', validators=[Optional(), Length(max=500)])
    image_url = StringField('Image URL', validators=[Optional(), URL(), Length(max=255)])
    tags = StringField('Tags', validators=[Optional(), Length(max=255)])