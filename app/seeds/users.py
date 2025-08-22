from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# This function will seed the users
def seed_users():
    user1 = User(
        email='demo@example.com',
        password='password123'
    )
    user2 = User(
        email='bob@example.com',
        password='password123'
    )
    user3 = User(
        email='charlie@example.com',
        password='password123'
    )

    db.session.add_all([user1, user2, user3])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA};")
        exists = db.session.execute(
            text("SELECT to_regclass(:qname)"), {"qname": f"{SCHEMA}.users"}
        ).scalar()
        if exists:
            db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
