# app/forms/store_form.py

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length, Optional, URL

# This form is used for creating and updating store information
class StoreForm(FlaskForm):
    # This field is for the store name with a max length of 255 characters
    name = StringField('Name', validators=[DataRequired(), Length(max=255)])
    # This field is for the product image URL, which must be a valid URL
    # It is an optional field and has a max length of 255 characters
    logo_url = StringField('Logo URL', validators=[Optional(), URL(), Length(max=255)])
    # This field is for the store theme color, which can be any string with a max length of 50 characters
    theme_color = StringField('Theme Color', validators=[Optional(), Length(max=50)])
    # This field is for the store description with a max length of 500 characters
    description = StringField('Description', validators=[Optional(), Length(max=500)])