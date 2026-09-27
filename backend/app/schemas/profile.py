from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProfileBase(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = []
    experience_years: Optional[int] = 0
    experience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    expected_salary: Optional[int] = None
    notice_period: Optional[str] = None
    resume_headline: Optional[str] = None
    preferred_locations: List[str] = []
    job_types: List[str] = []
    work_modes: List[str] = []

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    # User fields
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    
    # Profile fields
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[int] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    expected_salary: Optional[int] = None
    notice_period: Optional[str] = None
    resume_headline: Optional[str] = None
    preferred_locations: Optional[List[str]] = None
    job_types: Optional[List[str]] = None
    work_modes: Optional[List[str]] = None

class ProfileInDBBase(ProfileBase):
    profile_id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Profile(ProfileInDBBase):
    # Added from User model for frontend convenience
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None
