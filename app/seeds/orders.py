# app/seeds/orders.py

from app.models import db, Order, Product, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# This function will seed the orders
def seed_orders():
    # This will fetch products from DB so we can attach them to orders
    summer_tee = Product.query.filter_by(title="Summer Tee").first()
    coffee_mug = Product.query.filter_by(title="Ceramic Coffee Mug").first()
    graphic_tee = Product.query.filter_by(title="Graphic Tee").first()

    # Thnis are the example orders
    order1 = Order(
        user_id=1,
        store_id=1,
        buyer_name="Alice",
        buyer_email="alice@example.com",
        total_price=summer_tee.price,
        created_at=datetime.utcnow()
    )
    order1.products.append(summer_tee)

    order2 = Order(
        user_id=None, 
        store_id=2,
        buyer_name="Bob",
        buyer_email="bob@example.com",
        total_price=coffee_mug.price * 2,
        created_at=datetime.utcnow()
    )
    order2.products.append(coffee_mug)
    # order2.products.append(coffee_mug)  # This will be a quantity of 2

    order3 = Order(
        user_id=2,
        store_id=3,
        buyer_name="Charlie",
        buyer_email="charlie@example.com",
        total_price=graphic_tee.price + summer_tee.price,
        created_at=datetime.utcnow()
    )
    order3.products.append(graphic_tee)
    order3.products.append(summer_tee)

    db.session.add_all([order1, order2, order3])
    db.session.commit()

# This will undo the orders by truncating the order_products table and orders table
def undo_orders():
    if environment == "production":
        db.session.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA};")
        exists = db.session.execute(
            text("SELECT to_regclass(:qname)"),
            {"qname": f"{SCHEMA}.order_products"}
        ).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.order_products RESTART IDENTITY CASCADE;")
        exists = db.session.execute(
            text("SELECT to_regclass(:qname)"),
            {"qname": f"{SCHEMA}.orders"}
        ).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM order_products"))
        db.session.execute(text("DELETE FROM orders"))
    db.session.commit()
