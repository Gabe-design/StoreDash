# app/seeds/reviews.py

from app.models import db, Review, Product, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# This function will seed the reviews
def seed_reviews():
    # This will get the products to review
    summer_tee = Product.query.filter_by(title="Summer Tee").first()
    coffee_mug = Product.query.filter_by(title="Ceramic Coffee Mug").first()
    graphic_tee = Product.query.filter_by(title="Graphic Tee").first()

    review1 = Review(
        user_id=1,
        product_id=summer_tee.id,
        rating=5,
        comment="Love this tee! Super comfy and fits perfectly.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    review2 = Review(
        user_id=2,
        product_id=coffee_mug.id,
        rating=4,
        comment="Great mug, keeps coffee warm. Just wish it was a bit bigger.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    review3 = Review(
        user_id=3,
        product_id=graphic_tee.id,
        rating=5,
        comment="Stylish and great quality fabric.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add_all([review1, review2, review3])
    db.session.commit()

# This function will undo the reviews
def undo_reviews():
    if environment == "production":
        db.session.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA};")
        # only truncate if the table actually exists in this schema
        exists = db.session.execute(
            text("SELECT to_regclass(:qname)"),
            {"qname": f"{SCHEMA}.reviews"}
        ).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
    db.session.commit()
