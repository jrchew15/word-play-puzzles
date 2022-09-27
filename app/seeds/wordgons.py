from app.models import db, WordGon, WordGonSession

def seed_wordgons():
    puzzle = WordGon(
        letters = 'onhcxtiusrea',
        user_id = 3,
        shape='square',
        num_attempts=6
    )

    db.session.add(puzzle)

    session1 = WordGonSession(
        puzzle_id=1,
        user_id=1
        )
    session2 = WordGonSession(
        puzzle_id=1,
        user_id=2,
        guesses='exit,trouts,shanties,scout',
        num_guesses=4,
        completed=True
        )

    db.session.add(session1)
    db.session.add(session2)
    db.session.commit()

def undo_wordgons():
    db.session.execute('TRUNCATE word_gons RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE word_gons_sessions RESTART IDENTITY CASCADE;')
    db.session.commit()
