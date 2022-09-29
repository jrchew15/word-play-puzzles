from crypt import methods
from flask import Blueprint, request
from app.models import db, Word

word_routes = Blueprint('words', __name__)

@word_routes.route('/<word>')
def get_word(word):
    found = Word.query.filter(Word.word == word).first()
    return True if found else False

@word_routes.route('/<words>', methods=['POST'])
def add_word(word):
    new_word = Word(word=word, length=len(word))
    db.session.add(new_word)
    db.session.commit()
