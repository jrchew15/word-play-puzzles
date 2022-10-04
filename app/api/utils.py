from datetime import datetime, date, timedelta

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(error)
    return errorMessages

def db_date_to_datetime(db_date):
    return datetime.strptime(db_date,'%Y-%m-%d %H:%M:%S')

def not_future_day(db_date):
    # datetime_day = db_date_to_datetime(db_date)
    today = date.today()

    return (db_date - today).days <= 0
