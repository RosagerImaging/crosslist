
from uuid import UUID, uuid4
from models.products import Product

def test_create_product():
    """
    Test creating a Product instance.
    """
    user_id = uuid4()
    title = "Test Product"
    description = "This is a test product."
    sku = "TEST-SKU-123"
    
    product = Product(
        user_id=user_id, 
        title=title, 
        description=description, 
        sku=sku
    )
    
    assert isinstance(product.id, UUID)
    assert product.user_id == user_id
    assert product.title == title
    assert product.description == description
    assert product.sku == sku
