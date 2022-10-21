from app.models import db, Wordle, WordleSession
from json import load
from datetime import date, timedelta

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

    words = 'curse, aside, abort, fight, write, pasta, music, joint, brand, hatch, ditch, about, kinda, stand, noted, broad, dried, count, gimme, costa, traps, mitch, messy, legal, names, serve, spoon, ranch, depth, women, paper, comet, barge, happy, party, merit, north, awake, olive, snack, knife, risky, sight, vodka, howdy, drunk, baked, tubes, elbow, refer, raise, medic, prior, vague, grave, rifle, yummy, novel, tired, worth, molly, clerk, rusty, smoke, tenth, adore, tokyo, widow, valve, delay, nanny, stiff, cease, after, smile, shout, today, pains, chief, alike, lions, table, cliff, prick, exile, rates, dunno, craft, until, makeralone, nixon, armor, steal, canal, stock, phase, stoop, world, bobby, steps, owned, scarf, scope, saxon, voted, fiend, third, moody, noose, stash, gonna, chips, aunty, sneak, rival, pearl, legit, guess, deeds, swell, slash, canoe, stage, cadet, shady, squad, april, swore, upper, photo, beach, poppy, dread, donut, snuff, click, ratio, madly, raven, frame, merry, awful, aroma, booth, newly, bring, wreck, solid, mixer, proud, earth, horse, queen, jacks, tours, magma, spear, grief, lowly, fault, lined, broth, beads, stamp, baron, delta, break, stray, setup, cloak, basis, diner, mercy, press, tramp, staff, stove, rider, boots, sting, spicy, creep, meter, amuse, split, habit, based, scrap, linen, burnt, stone, goods, tumor, dandy, watts, corky, blind, breed, honey, cream, shown, gases, royce, eager, mates, slave, crabs, color, stein, found, algae, assad, march, visit, chimp, snake, white, elder, spree, tough, haley, semen, shite, maker, civil, cramp, trunk, paige, piece, mummy, froze, backs, stalk, fatal, vouch, smart, being, admit, spell, armed, ducks, prank, shaft, chump, crown, homer, grand, growl, build, error, drive, learn, champ, butch, siege, poker, caine, dwell, argue, woken, stung, slack, tonic, voice, merle, paint, dirty, recon, early, round, tutor, randy, midst, heath, mango, grove, drift, stood, sonar, jelly, venue, fluid, patch, trick, pilot, chuck, meant, shark, cuffs, depot, entry, faint, latte, words, title, piles, blast, chaps, harsh, taped, charm, siren, prime, motel, favor, aisle, adult'
    lst = words.split(',')

    idx = 0
    for word in lst:
        new_date = date(2022,10,24) + timedelta(days=idx)

        wordle = Wordle(word=word,puzzle_day=new_date)
        db.session.add(wordle)
        idx += 1
    db.session.commit()

def undo_wordles():
    db.session.execute('TRUNCATE wordles RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE wordle_sessions RESTART IDENTITY CASCADE;')
    db.session.commit()
