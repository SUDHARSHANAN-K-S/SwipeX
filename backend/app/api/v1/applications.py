from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User, UserRole
from app.models.application import Application
from app.models.job import Job
from app.models.saved_job import SavedJob
from app.models.swipe import Swipe, SwipeType
from app.schemas.application import Application as ApplicationSchema, ApplicationCreate, ApplicationUpdate, ApplicationWithDetails, JobInteraction, JobInteractionType

router = APIRouter()

@router.post("/", response_model=ApplicationSchema)
def create_application(
    *,
    db: Session = Depends(get_db),
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if current_user.role != UserRole.job_seeker:
        raise HTTPException(status_code=403, detail="Only job seekers can apply")
        
    job = db.query(Job).filter(Job.job_id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(Application).filter(
        Application.user_id == current_user.user_id,
        Application.job_id == app_in.job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
        
    application = Application(
        **app_in.model_dump(),
        user_id=current_user.user_id
    )
    db.add(application)
    
    # Increment applicant count
    job.applicant_count += 1
    
    db.commit()
    db.refresh(application)
    return application

@router.get("/", response_model=List[ApplicationWithDetails])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    # If job seeker, return their applications
    if current_user.role == UserRole.job_seeker:
        apps = db.query(Application).filter(Application.user_id == current_user.user_id).all()
        return apps
    
    # If recruiter, return applications for their jobs
    if current_user.role == UserRole.recruiter:
        company = current_user.companies[0] if current_user.companies else None
        if not company:
            return []
        apps = db.query(Application).join(Job).filter(Job.company_id == company.company_id).all()
        return apps
        
    return []

@router.get("/history", response_model=List[JobInteraction])
def get_job_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get complete job interaction history (Applied, Saved, Skipped) for a Job Seeker."""
    if current_user.role != UserRole.job_seeker:
        raise HTTPException(status_code=403, detail="Only job seekers have job history")

    user_id = current_user.user_id
    history = []

    # 1. Applications
    apps = db.query(Application).filter(Application.user_id == user_id).all()
    for app in apps:
        history.append(
            JobInteraction(
                interaction_id=app.application_id,
                job=app.job,
                type=JobInteractionType.applied,
                status=app.status.value,
                interaction_date=app.applied_at
            )
        )

    # 2. Saved Jobs
    saves = db.query(SavedJob).filter(SavedJob.user_id == user_id).all()
    for save in saves:
        # Check if already applied, applied takes precedence? Yes, but returning both is fine because frontend can filter. 
        # Actually it's better to just return it, the frontend can handle deduplication or we can check here.
        # Let's return everything so they appear in tabs correctly.
        history.append(
            JobInteraction(
                interaction_id=save.save_id,
                job=save.job,
                type=JobInteractionType.saved,
                status="Saved",
                interaction_date=save.saved_at
            )
        )

    # 3. Skipped Jobs (Left Swipes)
    swipes = db.query(Swipe).filter(
        Swipe.user_id == user_id, 
        Swipe.swipe_type == SwipeType.left
    ).all()
    
    for swipe in swipes:
        history.append(
            JobInteraction(
                interaction_id=swipe.swipe_id,
                job=swipe.job,
                type=JobInteractionType.skipped,
                status="Skipped",
                interaction_date=swipe.created_at
            )
        )

    # Sort descending by date
    history.sort(key=lambda x: x.interaction_date, reverse=True)
    return history

@router.put("/{app_id}/status", response_model=ApplicationSchema)
def update_application_status(
    *,
    db: Session = Depends(get_db),
    app_id: str,
    status_update: ApplicationUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    if current_user.role != UserRole.recruiter and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    application = db.query(Application).filter(Application.application_id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    application.status = status_update.status
    db.commit()
    db.refresh(application)
    
    # Trigger notification here
    
    return application
