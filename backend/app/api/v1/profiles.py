from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Any
import os
import shutil
import uuid

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User, UserRole
from app.models.profile import Profile
from app.schemas.profile import Profile as ProfileSchema, ProfileUpdate, ProfileCreate

router = APIRouter()

UPLOAD_DIR = "uploads/profiles"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _get_or_create_profile(db: Session, user: User) -> Profile:
    """Get existing profile or create one if it doesn't exist yet."""
    profile = db.query(Profile).filter(Profile.user_id == user.user_id).first()
    if not profile:
        profile = Profile(user_id=user.user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("/me", response_model=ProfileSchema)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get the current user's profile. Creates one if it doesn't exist."""
    if current_user.role != UserRole.job_seeker:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers have profiles.",
        )
    profile = _get_or_create_profile(db, current_user)
    
    # Map user fields for the response
    profile_dict = profile.__dict__.copy()
    profile_dict["first_name"] = current_user.first_name
    profile_dict["last_name"] = current_user.last_name
    profile_dict["email"] = current_user.email
    profile_dict["phone"] = current_user.phone
    profile_dict["profile_image"] = current_user.profile_image
    
    return profile_dict


@router.put("/me", response_model=ProfileSchema)
def update_my_profile(
    *,
    db: Session = Depends(get_db),
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update the current user's profile fields."""
    if current_user.role != UserRole.job_seeker:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers have profiles.",
        )
    profile = _get_or_create_profile(db, current_user)
    update_data = profile_in.model_dump(exclude_unset=True)
    
    user_fields = ["first_name", "last_name", "phone"]
    
    for field, value in update_data.items():
        if field in user_fields:
            setattr(current_user, field, value)
        else:
            setattr(profile, field, value)
            
    db.add(profile)
    db.add(current_user)
    db.commit()
    db.refresh(profile)
    db.refresh(current_user)
    
    profile_dict = profile.__dict__.copy()
    profile_dict["first_name"] = current_user.first_name
    profile_dict["last_name"] = current_user.last_name
    profile_dict["email"] = current_user.email
    profile_dict["phone"] = current_user.phone
    profile_dict["profile_image"] = current_user.profile_image
    
    return profile_dict

@router.post("/me/image", response_model=ProfileSchema)
def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if current_user.role != UserRole.job_seeker:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only job seekers can upload profile images.")
        
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{current_user.user_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.profile_image = f"/static/profiles/{unique_filename}"
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    profile = _get_or_create_profile(db, current_user)
    profile_dict = profile.__dict__.copy()
    profile_dict["first_name"] = current_user.first_name
    profile_dict["last_name"] = current_user.last_name
    profile_dict["email"] = current_user.email
    profile_dict["phone"] = current_user.phone
    profile_dict["profile_image"] = current_user.profile_image
    
    return profile_dict
