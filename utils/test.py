import random
import time

from model import db, KeyPress, Recording, Theme, User


def populate_test_db_keypresses():
    """Add recording data in fake db for testing."""

    for num in range(6):
        time_to_next_key = random.randint(0, 5000)
        fake_keypress = KeyPress(recording_id=1,
                                 key_pressed='a',
                                 time_to_next_key=time_to_next_key,
                                 theme=1)

        db.session.add(fake_keypress)

    db.session.commit()


def populate_test_db_recordings():
    """Add keypress data in fake db for testing."""

    fake_recording = Recording(user_id=1)

    db.session.add(fake_recording)
    db.session.commit()


def populate_test_db_themes():
    """Create theme data in fake db for testing."""

    fake_theme = Theme(name='fake_theme')

    db.session.add(fake_theme)
    db.session.commit()


def populate_test_db_users():
    """Create user data in fake db for testing."""

    fake_user = User(name='Angie',
                     email='angie@fake.com',
                     password='pass')

    db.session.add(fake_user)
    db.session.commit()