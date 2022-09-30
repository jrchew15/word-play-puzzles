from crypt import methods
from flask import Blueprint, request
from app.models import db, Word
import os
from ..forms.word_form import WordForm
import http.client

word_routes = Blueprint('words', __name__)

@word_routes.route('/<word>')
def get_word(word):
    if len(word) <= 1:
        return ({'errors':['word must be more than one letter']}, 400)

    found = Word.query.filter(Word.word == word).first()

    if found:
        return {'word':word}, 200

    conn = http.client.HTTPSConnection("wordsapiv1.p.rapidapi.com")

    headers = {
        'X-RapidAPI-Key': "0e76769061msh1affd841b6293c1p114f0ejsn5072e6ef9223",
        'X-RapidAPI-Host': "wordsapiv1.p.rapidapi.com"
        }

    conn.request("GET", f"/words/{word}/frequency", headers=headers)

    res = conn.getresponse()
    data = res.read()

    decoded = data.decode("utf-8")

    if decoded.find(f'"word":"{word}"') > 0:
        new_word = Word(word=word, length=len(word))
        db.session.add(new_word)
        db.session.commit()
        return ({'word':word}, 200)

    return ({'errors':['word not found']}, 400)

@word_routes.route('', methods=['POST'])
def add_word():
    form = WordForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    word = form.word.data
    if form.validate_on_submit():
        new_word = Word(word=word, length=len(word))
        db.session.add(new_word)
        db.session.commit()
        return {'word':word}, 200
    return {'errors':['Unauthorized']}, 405
