from .base import CoreModel
from uuid import UUID


class Product(CoreModel):
    user_id: UUID
    title: str
    description: str | None = None
    sku: str | None = None
