from .base import CoreModel
from pydantic import EmailStr


class User(CoreModel):
    email: EmailStr
    password_hash: str
