# app/forms/product_form.py

from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField
from wtforms.validators import DataRequired, Length, Optional, URL, NumberRange

# This form is used for creating and updating products
class ProductForm(FlaskForm):
    # This field is for the product title with a max length of 255 characters
    title = StringField('Title', validators=[DataRequired(), Length(max=255)])
    # This field is for the product price, which must be a positive decimal
    # It uses the NumberRange to make sure the price is not negative
    price = DecimalField('Price', validators=[DataRequired(), NumberRange(min=0)], places=2)
    # This field is for the product description with a max length of 500 characters
    description = StringField('Description', validators=[Optional(), Length(max=500)])
    # This field is for the product image URL, which must be a valid URL
    # It is an optional field and has a max length of 255 characters
    image_url = StringField('Image URL', validators=[Optional(), URL(), Length(max=255)])
    # This field is for the product tags, which can be a comma-separated list of tags
    # It is also an optional field and has a max length of 255 characters
    tags = StringField('Tags', validators=[Optional(), Length(max=255)])