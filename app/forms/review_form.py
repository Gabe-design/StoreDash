# app/forms/review_form.py

from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, NumberRange, Optional, Length

# This form is used for creating and updating product reviews
class ReviewForm(FlaskForm):
    # This is the field for the product ID, which is also required and must be a positive integer
    rating = IntegerField('Rating', validators=[DataRequired(), NumberRange(min=1, max=5)])
    # This field is for the review text, which is optional and can have a maximum length of 1000 characters
    comment = StringField('Comment', validators=[Optional(), Length(max=1000)])
