from app.models import db, Wordle, WordleSession
from datetime import date

def seed_wordles():
    wordle1 = Wordle(
        word='exist',
        puzzle_day=date(2022,10,17)
    )
    wordle2 = Wordle(
        word='known',
        puzzle_day=date(2022,10,18)
    )
    wordle3 = Wordle(
        word='human',
        puzzle_day=date(2022,10,19)
    )
    wordle4 = Wordle(
        word='major',
        puzzle_day=date(2022,10,20)
    )
    wordle5 = Wordle(
        word='hurry',
        puzzle_day=date(2022,10,21)
    )
    wordle6 = Wordle(
        word='ghost',
        puzzle_day=date(2022,10,22)
    )
    wordle7 = Wordle(
        word='build',
        puzzle_day=date(2022,10,23)
    )

    db.session.add(wordle1)
    db.session.add(wordle2)
    db.session.add(wordle3)
    db.session.add(wordle4)
    db.session.add(wordle5)
    db.session.add(wordle6)
    db.session.add(wordle7)

    db.session.commit()

def undo_wordles():
    db.session.execute('TRUNCATE wordles RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE wordle_sessions RESTART IDENTITY CASCADE;')
    db.session.commit()
