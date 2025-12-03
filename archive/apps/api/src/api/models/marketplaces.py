from .base import CoreModel
from pydantic import Field
from uuid import UUID


class Marketplace(CoreModel):
    name: str
    api_url: str


class UserMarketplace(CoreModel):
    user_id: UUID
    marketplace_id: UUID
    encrypted_credentials: str = Field(
        ..., description="Encrypted credentials for the marketplace"
    )
