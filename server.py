import json
import os

from flask import flash, Flask, jsonify, redirect, render_template, request, session
from markupsafe import Markup
from model import connect_to_db, db, KeyPress, Recording, User
from sqlalchemy.orm.exc import NoResultFound

app = Flask(__name__)
app.secret_key = os.environ['FLASK_APP_SECRET_KEY']

ALERT_COLORS = {
    'red': 'danger',
    'yellow': 'warning',
    'green': 'success',
    'blue': 'info',
}


@app.route('/')
def index():
    """Show main music-making page to user."""

    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Show login page."""

    if request.method == 'GET':
        return render_template('login.html')

    elif request.method == 'POST':
        # TODO add option for redirect url in case user was trying to
        # access a specific page before they got sent to login

        email = request.form.get('email')
        password = request.form.get('password')

        response = attempt_login(email, password)

        return response


def attempt_login(email, password):
    """Try to log the user in."""

    user = get_user_by_email(email)

    if user:
        response = verify_password(user, password)
    else:
        flash_message('No registered user found. Please register.',
                      ALERT_COLORS['blue'])
        response = redirect('/register')

    return response


def get_user_by_email(email):
    """Return a single User based on the email address."""

    try:
        return db.session.query(User).filter_by(email=email).one()
    except NoResultFound:
        return None


def verify_password(user, password):
    """Ensure user-entered password matches password in db."""

    if user.password == password:
        session['user_id'] = user.id
        flash_message('You were successfully logged in.', ALERT_COLORS['green'])
        response = redirect('/')
    else:
        flash_message('Incorrect password.', ALERT_COLORS['red'])
        response = redirect('/login')

    return response


@app.route('/logout')
def logout():
    """Remove user info from browser session."""

    if 'user_id' in session:
        del session['user_id']
    flash_message('You were successfully logged out.', ALERT_COLORS['green'])

    return redirect('/')


@app.route('/save_recording', methods=['POST'])
def save_recording():
    """Save recording data to the database."""

    recording_str = request.form.get('recording', None)
    recording = json.loads(recording_str)

    if recording:
        recording_id = add_recording_to_db()

        for keypress in recording:
            add_keypress_to_db_session(recording_id, keypress)

        db.session.commit()

    # TODO different responses if something fails here
    return jsonify({'response': 'OK'})


def add_recording_to_db():
    """Create new Recording and add to db.

    Returns the id of the new recording.
    """

    # TODO use my sample user until I get user accounts set up
    user_id = 1  # session['user_id']
    new_recording = Recording(user_id=user_id)

    db.session.add(new_recording)
    db.session.commit()

    return new_recording.id


def add_keypress_to_db_session(recording_id, keypress):
    """Create new KeyPress and add to db."""

    key_pressed = keypress.get('key')
    pressed_at = keypress.get('timestamp')
    theme = keypress.get('theme')

    new_keypress = KeyPress(recording_id=recording_id,
                            key_pressed=key_pressed,
                            pressed_at=pressed_at,
                            theme=theme)

    db.session.add(new_keypress)


def flash_message(msg, alert_type):
    """Add a stylized flash message to the browser session."""

    html = """
        <div class="alert alert-%s alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
                %s
        </div>
        """ % (alert_type, msg)

    markup_msg = Markup(html)
    flash(markup_msg)


if __name__ == '__main__':
    app.debug = True
    connect_to_db(app)
    app.run(host='0.0.0.0')
