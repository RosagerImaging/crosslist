from .base import CoreModel
from pydantic import Field
from uuid import UUID
from datetime import datetime, timezone


class AnalyticsData(CoreModel):
    user_id: UUID
    marketplace_id: UUID | None = None
    product_id: UUID | None = None
    listing_id: UUID | None = None
    event_type: str = Field(
        ..., description="Type of event (e.g., 'view', 'sale', 'offer')"
    )
    event_data: dict | None = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
