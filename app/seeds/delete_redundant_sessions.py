from app.models import db, User, WordleSession, WordGonSession

def delete_redundant_wordles():
    users = [user for user in User.query.all() if len(user.wordle_sessions)>0]
    for user in users:
        seshes = []
        ids = [session.puzzle_id for session in user.wordle_sessions]
        for i in range(len(ids)):
            if ids.index(ids[i]) != i:
                seshes.append(user.wordle_sessions[i])
        for sesh in seshes:
            db.session.delete(sesh)
    db.session.commit()

def delete_redundant_wordgons():
    users = [user for user in User.query.all() if len(user.sessions)>0]
    for user in users:
        seshes = []
        ids = [session.puzzle_id for session in user.sessions]
        for i in range(len(ids)):
            if ids.index(ids[i]) != i:
                seshes.append(user.sessions[i])
        for sesh in seshes:
            db.session.delete(sesh)
    db.session.commit()
