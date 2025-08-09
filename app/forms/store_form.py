# app/forms/store_form.py

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length, Optional, URL

class StoreForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=255)])
    logo_url = StringField('Logo URL', validators=[Optional(), URL(), Length(max=255)])
    theme_color = StringField('Theme Color', validators=[Optional(), Length(max=50)])
    description = StringField('Description', validators=[Optional(), Length(max=500)])