from app.models import db, WordGon, WordGonSession
from json import load
from datetime import datetime

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

    json_obj = open('app/seeds/user-made-seeds.txt','r')

    dct = load(json_obj)
    puzzles = dct['puzzles']

    all_sets = []
    idx = 0
    for puzzle in puzzles:
        new_set = set(puzzle['letters'])
        if all_sets.count(new_set) > 0:
            print('REPEAT AT ', idx, puzzle)
            continue
        all_sets.append(new_set)


        wordgon = WordGon(
            letters = puzzle['letters'],
            user_id = (idx % 10) + 2,
            shape = 'square',
            num_attempts = puzzle['numAttempts']
        )

        db.session.add(wordgon)
        idx += 1
    db.session.commit()


def undo_wordgons():
    db.session.execute('TRUNCATE word_gons RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE word_gons_sessions RESTART IDENTITY CASCADE;')
    db.session.commit()



def puzzles_of_the_day():
    json_obj = open('app/seeds/puzzle-seeds.txt','r')

    dct = load(json_obj)
    puzzles = dct['puzzles']

    all_sets = []
    idx = 0
    for puzzle in puzzles:
        new_set = set(puzzle['letters'])
        if all_sets.count(new_set) > 0:
            print('REPEAT AT ', idx, puzzle)
            continue
        all_sets.append(new_set)


        new_date = datetime.strptime(puzzle['puzzleDay'],'%Y-%m-%d %H:%M:%S')
        wordgon = WordGon(
            letters = puzzle['letters'],
            user_id = 1,
            shape = 'square',
            num_attempts = puzzle['numAttempts'],
            puzzle_day = new_date
        )

        db.session.add(wordgon)
        idx += 1
    db.session.commit()
