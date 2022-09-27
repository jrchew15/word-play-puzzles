from flask.cli import AppGroup
from .users import seed_users, undo_users
from .words import seed_words, undo_words
from .wordgons import seed_wordgons, undo_wordgons

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_words()
    seed_wordgons()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_words()
    undo_wordgons()
    # Add other undo functions here
