from .db import db


class WordGon(db.Model):
    __tablename__ = 'word_gons'

    id = db.Column(db.Integer, primary_key=True)
    letters = db.Column(db.String(25), nullable=False, unique=True)
    user_id = db.Column(db.Integer, nullable=False)
    shape = db.Column(db.Enum('square','trapezoid','pentagon'), nullable=False)
    num_attempts = db.Column(db.Integer, min=1, max=12)
    puzzle_day = db.Column(db.Date, default=None)

    def to_dict(self):
        return {
            "id": self.id,
            "letters": self.letters,
            "userId": self.user_id,
            "shape": self.shape,
            "numAttempts": self.num_attempts,
            "puzzleDay": self.puzzle_day
        }
