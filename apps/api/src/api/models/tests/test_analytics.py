
from uuid import UUID, uuid4
from datetime import datetime
from models.analytics import AnalyticsData

def test_create_analytics_data():
    """
    Test creating an AnalyticsData instance.
    """
    user_id = uuid4()
    marketplace_id = uuid4()
    product_id = uuid4()
    listing_id = uuid4()
    event_type = "sale"
    event_data = {"price": 123.45, "currency": "USD"}
    
    analytics_data = AnalyticsData(
        user_id=user_id, 
        marketplace_id=marketplace_id, 
        product_id=product_id, 
        listing_id=listing_id, 
        event_type=event_type, 
        event_data=event_data
    )
    
    assert isinstance(analytics_data.id, UUID)
    assert analytics_data.user_id == user_id
    assert analytics_data.marketplace_id == marketplace_id
    assert analytics_data.product_id == product_id
    assert analytics_data.listing_id == listing_id
    assert analytics_data.event_type == event_type
    assert analytics_data.event_data == event_data
    assert isinstance(analytics_data.timestamp, datetime)
