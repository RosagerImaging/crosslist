
from uuid import UUID, uuid4
from models.listings import Listing

def test_create_listing():
    """
    Test creating a Listing instance.
    """
    product_id = uuid4()
    marketplace_id = uuid4()
    url = "https://www.test-marketplace.com/listing/123"
    price = 123.45
    status = "active"
    
    listing = Listing(
        product_id=product_id, 
        marketplace_id=marketplace_id, 
        url=url, 
        price=price, 
        status=status
    )
    
    assert isinstance(listing.id, UUID)
    assert listing.product_id == product_id
    assert listing.marketplace_id == marketplace_id
    assert listing.url == url
    assert listing.price == price
    assert listing.status == status
