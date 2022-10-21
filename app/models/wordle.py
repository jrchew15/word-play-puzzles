from .db import db


class Wordle(db.Model):
    __tablename__ = 'wordles'

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(5), nullable=False, unique=True)
    puzzle_day = db.Column(db.Date, default=None)

    sessions = db.relationship("WordleSession", back_populates="wordle")

    def to_dict(self):
        return {
            "id": self.id,
            "word": self.word,
            "puzzleDay": str(self.puzzle_day),
        }
