from flask import Blueprint
from ..models import WordGon

wordgon_routes = Blueprint('wordgon',__name__)

@wordgon_routes.route('/')
def all_wordgons():
    puzzles = WordGon.query.all()
    return [puzzle.to_dict() for puzzle in puzzles]
