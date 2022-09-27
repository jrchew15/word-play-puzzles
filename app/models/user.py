from datetime import date
from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(255))
    theme = db.Column(db.Enum('light','dark'), default='light')
    created_at = db.Column(db.Date, default=date.today())

    sessions = db.relationship("WordGonSession", back_populates="user")
    puzzles = db.relationship("WordGon", back_populates='user')
    comments = db.relationship("Comment", back_populates='user')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self, comment=False, current=False, login=False):
        response = {
            'id': self.id,
            'username': self.username,
            'profilePicture': self.profile_picture,
        }
        if comment:
            return response
        response['createdAt'] = self.created_at
        if current:
            response['email'] = self.email
            response['theme'] = self.theme
        if login:
            response['openSessions'] = [ session.to_dict() for session in self.sessions]
        return response
