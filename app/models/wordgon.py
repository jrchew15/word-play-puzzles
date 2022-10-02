from .db import db


class WordGon(db.Model):
    __tablename__ = 'word_gons'

    id = db.Column(db.Integer, primary_key=True)
    letters = db.Column(db.String(25), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shape = db.Column(db.Enum('square','trapezoid','pentagon',name='shapes'), nullable=False)
    num_attempts = db.Column(db.Integer)
    puzzle_day = db.Column(db.Date, default=None)

    sessions = db.relationship("WordGonSession", back_populates="puzzle")
    user = db.relationship("User", back_populates='puzzles')
    comments = db.relationship("Comment", back_populates='puzzle')

    def to_dict(self, comments=False):
        return {
            "id": self.id,
            "letters": self.letters,
            "userId": self.user_id,
            "shape": self.shape,
            "numAttempts": self.num_attempts,
            "puzzleDay": self.puzzle_day,
            "user": self.user.to_dict(),
        }
