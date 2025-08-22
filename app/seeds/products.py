# app/seeds/products.py

from app.models import db, Product, Tag, environment, SCHEMA
from sqlalchemy.sql import text

# This function will seed the products
def seed_products():
    # This will create tags first
    summer_tag = Tag(name="summer")
    mug_tag = Tag(name="mug")
    shirt_tag = Tag(name="shirt")

    # This adds tags to the session
    db.session.add_all([summer_tag, mug_tag, shirt_tag])
    # This ensures tags have IDs for relationship
    db.session.flush() 

    # This will create the product
    product1 = Product(
        store_id=1,
        title="Summer Tee",
        price=15.00,
        description="Lightweight t-shirt perfect for summer days.",
        image_url="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg"
    )
    # This will add tags to the product
    product1.tags.append(summer_tag)
    # This will also add a tag to the product
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

    # This will add the products to the session
    # And then it will commit the changes to the database
    db.session.add_all([product1, product2, product3])
    db.session.commit()

# This function will undo the products
def undo_products():
    if environment == "production":
        db.session.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA};")
        exists = db.session.execute(text("SELECT to_regclass(:qname)"), {"qname": f"{SCHEMA}.product_tags"}).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.product_tags RESTART IDENTITY CASCADE;")
        exists = db.session.execute(text("SELECT to_regclass(:qname)"), {"qname": f"{SCHEMA}.products"}).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
        exists = db.session.execute(text("SELECT to_regclass(:qname)"), {"qname": f"{SCHEMA}.tags"}).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM product_tags"))
        db.session.execute(text("DELETE FROM products"))
        db.session.execute(text("DELETE FROM tags"))
    db.session.commit()
