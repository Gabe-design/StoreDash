# app/seeds/products.py

from app.models import db, Product, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    # Create tags first
    summer_tag = Tag(name="summer")
    mug_tag = Tag(name="mug")
    shirt_tag = Tag(name="shirt")

    db.session.add_all([summer_tag, mug_tag, shirt_tag])
    db.session.flush()  # ensures tags have IDs for relationship

    # Create products
    product1 = Product(
        store_id=1,
        title="Summer Tee",
        price=15.00,
        description="Lightweight t-shirt perfect for summer days.",
        image_url="https://placehold.co/300x300"
    )
    product1.tags.append(summer_tag)
    product1.tags.append(shirt_tag)

    product2 = Product(
        store_id=2,
        title="Ceramic Coffee Mug",
        price=10.00,
        description="Classic white mug for your morning coffee.",
        image_url="https://placehold.co/300x300"
    )
    product2.tags.append(mug_tag)

    product3 = Product(
        store_id=3,
        title="Graphic Tee",
        price=20.00,
        description="Trendy graphic t-shirt with a unique design.",
        image_url="https://placehold.co/300x300"
    )
    product3.tags.append(shirt_tag)

    db.session.add_all([product1, product2, product3])
    db.session.commit()

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.product_tags RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM product_tags"))
        db.session.execute(text("DELETE FROM tags"))
        db.session.execute(text("DELETE FROM products"))
    db.session.commit()