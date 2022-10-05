from app.models import db, Comment

def seed_comments():
    comment1 = Comment(puzzle_id=1, user_id=2, body='I did it!')
    db.session.add(comment1)
    db.session.commit()

    comment2 = Comment(puzzle_id=1, user_id=1, body='Nice Job!', reply_to=1)
    db.session.add(comment2)
    db.session.commit()

def undo_comments():
    db.session.execute('TRUNCATE comments RESTART IDENTITY CASCADE;')
    db.session.commit()
