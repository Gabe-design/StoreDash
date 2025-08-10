# app/seeds/stores.py

from app.models import db, Store, environment, SCHEMA
from sqlalchemy.sql import text

# This function will seed the stores
def seed_stores():
    store1 = Store(
        user_id=1,
        name="Store Dash",
        logo_url="https://placehold.co/200x200",
        theme_color="#123abc",
        description="Cool shop!",
        active=True
    )
    store2 = Store(
        user_id=2,
        name="Mug Life",
        logo_url="https://placehold.co/200x200",
        theme_color="#ff6600",
        description="All mugs, all the time.",
        active=True
    )
    store3 = Store(
        user_id=3,
        name="Shirt Shack",
        logo_url="https://placehold.co/200x200",
        theme_color="#0099ff",
        description="Trendy shirts for everyone.",
        active=True
    )

    db.session.add_all([store1, store2, store3])
    db.session.commit()

# This function will undo the stores
def undo_stores():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stores RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stores"))
    db.session.commit()