from datetime import datetime
from .user import User
from .db import db

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    puzzle_id = db.Column(db.Integer, db.ForeignKey('word_gons.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    body = db.Column(db.String(255), nullable=False)
    reply_to = db.Column(db.Integer, db.ForeignKey('comments.id'), )
    created_at = db.Column(db.Date, default=datetime.now())
    updated_at = db.Column(db.Date, default=datetime.now(), onupdate=datetime.now())

    puzzle = db.relationship("WordGon", back_populates="comments")
    user = db.relationship("User", back_populates="comments")
    parent = db.relationship("Comment", back_populates="children")
    children = db.relationship("Comment", back_populates="parent")

    def to_dict(self):
        children = self.children
        response = {
            "id": self.id,
            "puzzleId": self.puzzle_id,
            'userId': self.user_id,
            'body': self.body,
            'replyTo': self.reply_to,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
            'user': self.user.to_dict(comment=True),
            'children': children.to_dict() if len(children) > 0 else None
        }

        return response
