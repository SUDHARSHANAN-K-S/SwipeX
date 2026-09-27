from pydantic import BaseModel
from typing import Optional, List
import enum
from datetime import datetime
from app.models.application import ApplicationStatus
from app.schemas.job import Job
from app.schemas.resume import Resume
from app.schemas.user import User

class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    job_id: str
    resume_id: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus

class ApplicationInDBBase(ApplicationBase):
    application_id: str
    user_id: str
    job_id: str
    resume_id: Optional[str]
    status: ApplicationStatus
    applied_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Application(ApplicationInDBBase):
    pass

class ApplicationWithDetails(ApplicationInDBBase):
    job: Optional[Job] = None
    resume: Optional[Resume] = None
    user: Optional[User] = None

class JobInteractionType(str, enum.Enum):
    applied = "Applied"
    saved = "Saved"
    skipped = "Skipped"

class JobInteraction(BaseModel):
    interaction_id: str
    job: Job
    type: JobInteractionType
    status: str
    interaction_date: datetime
