from app.models import db, Word


# Adds a demo user, you can add other users here if you want
def seed_words():
    word1 = Word(word='test', length=4)
    word2 = Word(word='orate', length=5)

    db.session.add(word1)
    db.session.add(word2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_words():
    db.session.execute('TRUNCATE words RESTART IDENTITY CASCADE;')
    db.session.commit()
