
from uuid import UUID, uuid4
from models.marketplaces import Marketplace, UserMarketplace

def test_create_marketplace():
    """
    Test creating a Marketplace instance.
    """
    name = "Test Marketplace"
    api_url = "https://api.test-marketplace.com"
    
    marketplace = Marketplace(name=name, api_url=api_url)
    
    assert isinstance(marketplace.id, UUID)
    assert marketplace.name == name
    assert marketplace.api_url == api_url

def test_create_user_marketplace():
    """
    Test creating a UserMarketplace instance.
    """
    user_id = uuid4()
    marketplace_id = uuid4()
    encrypted_credentials = "some_encrypted_credentials"
    
    user_marketplace = UserMarketplace(
        user_id=user_id, 
        marketplace_id=marketplace_id, 
        encrypted_credentials=encrypted_credentials
    )
    
    assert isinstance(user_marketplace.id, UUID)
    assert user_marketplace.user_id == user_id
    assert user_marketplace.marketplace_id == marketplace_id
    assert user_marketplace.encrypted_credentials == encrypted_credentials
