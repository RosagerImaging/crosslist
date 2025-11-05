from .base import CoreModel
from pydantic import Field
from uuid import UUID


class Listing(CoreModel):
    product_id: UUID
    marketplace_id: UUID
    url: str | None = None
    price: float | None = None
    status: str = Field(
        ..., description="Status of the listing (e.g., 'active', 'sold', 'draft')"
    )
