# app/seeds/orders.py

from app.models import db, Order, Product, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_orders():
    # Fetch products from DB so we can attach them to orders
    summer_tee = Product.query.filter_by(title="Summer Tee").first()
    coffee_mug = Product.query.filter_by(title="Ceramic Coffee Mug").first()
    graphic_tee = Product.query.filter_by(title="Graphic Tee").first()

    # Example orders
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
        user_id=None,  # guest checkout
        store_id=2,
        buyer_name="Bob",
        buyer_email="bob@example.com",
        total_price=coffee_mug.price * 2,
        created_at=datetime.utcnow()
    )
    order2.products.append(coffee_mug)
    # order2.products.append(coffee_mug)  # quantity 2

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

def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.order_products RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM order_products"))
        db.session.execute(text("DELETE FROM orders"))
    db.session.commit()