
from uuid import UUID
from models.users import User

def test_create_user():
    """
    Test creating a User instance.
    """
    email = "test@example.com"
    password_hash = "some_hash"
    
    user = User(email=email, password_hash=password_hash)
    
    assert isinstance(user.id, UUID)
    assert user.email == email
    assert user.password_hash == password_hash
