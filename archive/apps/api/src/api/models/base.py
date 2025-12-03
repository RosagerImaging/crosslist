from pydantic import BaseModel, Field
from uuid import UUID, uuid4


class CoreModel(BaseModel):
    id: UUID = Field(default_factory=uuid4)
