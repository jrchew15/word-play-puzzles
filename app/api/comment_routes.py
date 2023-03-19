from flask import Blueprint, request
from flask_login import login_required, current_user

from ..models import db, Comment
from ..forms.comment_form import CommentForm
from .utils import validation_errors_to_error_messages

from datetime import date, datetime

comment_routes = Blueprint('comment',__name__)

@comment_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_comment(id):
    comment = Comment.query.get(id)
    if comment.user_id is not current_user.id:
        return {'errors':['Unauthorized']}, 405

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        comment.body = form.body.data
        db.session.commit()
        return comment.to_dict(), 201

    return {'errors':validation_errors_to_error_messages(form.errors)}, 401

@comment_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_comment(id):
    comment = Comment.query.get(id)
    if comment.user_id is not current_user.id:
        return {'errors':['Unauthorized']}, 405

    db.session.delete(comment)
    db.session.commit()
    return {'message':'Successfully deleted'}, 201
