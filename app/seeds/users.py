from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo',
        email='demo@aa.io',
        password='password',
        profile_picture='https://pbs.twimg.com/profile_images/864104988146114560/MSWTWwno_400x400.jpg'
        )
    marnie = User(
        username='marnie',
        email='marnie@aa.io',
        password='password',
        profile_picture='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOD7AU4H7VqeCl1PE_ybx1QAxFk9uOPS-AGSLvPBBppOd95NGgQbGUzGCH8p-oLyWxnKs&usqp=CAU'
        )
    hk = User(
        username='hollow_knight',
        email='hk@hollow.knight',
        password='password',
        profile_picture='https://pbs.twimg.com/profile_images/1120938488466165760/qoTm6nw3_400x400.jpg'
        )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(hk)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
