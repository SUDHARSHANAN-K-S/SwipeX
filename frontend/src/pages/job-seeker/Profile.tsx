import { useState, useEffect, useRef } from 'react';
import { MapPin, Mail, Loader2, Save, Edit2, Briefcase, IndianRupee, Clock, Code2, Phone, Camera, X, Plus, Target, CheckCircle2 } from 'lucide-react';
import { profilesApi, type Profile, type ProfileUpdate } from '../../api/profiles.api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<any>({
    first_name: '',
    last_name: '',
    phone: '',
    headline: '',
    resume_headline: '',
    bio: '',
    location: '',
    expected_salary: '',
    notice_period: '',
    skills: [],
    preferred_locations: [],
    job_types: [],
    work_modes: [],
    experience: [],
    education: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [locInput, setLocInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await profilesApi.getMyProfile();
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        headline: data.headline || '',
        resume_headline: data.resume_headline || '',
        bio: data.bio || '',
        location: data.location || '',
        expected_salary: data.expected_salary || '',
        notice_period: data.notice_period || '',
        skills: data.skills || [],
        preferred_locations: data.preferred_locations || [],
        job_types: data.job_types || [],
        work_modes: data.work_modes || [],
        experience: data.experience || [],
        education: data.education || []
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: string, value: string, setter: any) => {
    if (!value.trim()) return;
    setFormData((prev: any) => {
      const arr = prev[field];
      if (arr.includes(value.trim())) return prev;
      return { ...prev, [field]: [...arr, value.trim()] };
    });
    setter('');
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData((prev: any) => {
      const arr = [...prev[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleObjectArrayAdd = (field: string, emptyObj: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], emptyObj]
    }));
  };

  const handleObjectArrayUpdate = (field: string, index: number, key: string, value: any) => {
    setFormData((prev: any) => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const handleObjectArrayRemove = (field: string, index: number) => {
    setFormData((prev: any) => {
      const arr = [...prev[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const updateData: ProfileUpdate = {
        ...formData,
        expected_salary: formData.expected_salary ? Number(formData.expected_salary) : undefined,
      };
      const updated = await profilesApi.updateMyProfile(updateData);
      setProfile(updated);
      setMessage('Profile updated successfully.');
      setIsEditing(false);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    try {
      const updated = await profilesApi.uploadProfileImage(file);
      setProfile(updated);
      setMessage('Profile image updated!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Completion calculation
  const calculateCompletion = () => {
    if (!profile) return 0;
    const checks = [
      !!profile.first_name,
      !!profile.last_name,
      !!profile.phone,
      !!profile.headline,
      !!profile.bio,
      !!profile.location,
      !!profile.profile_image,
      profile.skills?.length > 0,
      profile.experience?.length > 0,
      profile.education?.length > 0,
      !!profile.expected_salary,
      profile.preferred_locations?.length > 0,
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const completion = calculateCompletion();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  const profileImageUrl = profile?.profile_image 
    ? `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${profile.profile_image}`
    : null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500 mt-1">Manage your professional identity and preferences.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Progress */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
            
            <div className="relative mx-auto w-28 h-28 mb-4 group">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white shadow-md bg-white" />
              ) : (
                <div className="w-full h-full rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md z-10 relative">
                  {profile?.first_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-20"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {profile?.headline ? profile.headline : <span className="italic text-slate-400">Add your professional headline</span>}
            </p>
            
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile?.phone}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile?.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> Profile Completion
            </h3>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-500">Progress</span>
              <span className="text-indigo-600">{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-6">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${completion}%` }}
                className={`h-full rounded-full ${completion === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
              />
            </div>
            {completion < 100 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Complete your profile:</p>
                {(!profile?.headline) && <MissingItem text="Add Professional Headline" />}
                {(!profile?.bio) && <MissingItem text="Add Professional Bio" />}
                {(!profile?.skills?.length) && <MissingItem text="Add Skills" />}
                {(!profile?.experience?.length) && <MissingItem text="Add Experience" />}
                {(!profile?.preferred_locations?.length) && <MissingItem text="Add Preferred Locations" />}
              </div>
            )}
            {completion === 100 && (
              <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                <CheckCircle2 className="w-5 h-5" /> Profile is complete!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
          {message && !isEditing && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100">{message}</div>}

          {!isEditing ? (
            <div className="space-y-6">
              {/* About Section */}
              <Section title="About">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{profile?.bio || 'No bio added yet.'}</p>
                {profile?.resume_headline && (
                   <p className="mt-4 text-sm font-medium text-slate-500 border-l-2 border-indigo-200 pl-3">
                     <strong>Resume Headline:</strong> {profile.resume_headline}
                   </p>
                )}
              </Section>

              {/* Skills */}
              <Section title="Skills">
                {profile?.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100">{s}</span>
                    ))}
                  </div>
                ) : <p className="text-slate-500 italic">No skills added.</p>}
              </Section>

              {/* Experience */}
              <Section title="Experience">
                {profile?.experience?.length ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400" />
                        <h4 className="text-base font-bold text-slate-900">{exp.title}</h4>
                        <p className="text-sm font-medium text-indigo-600 mb-1">{exp.company}</p>
                        <p className="text-xs font-semibold text-slate-500 mb-2">
                          {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                        </p>
                        {exp.description && <p className="text-sm text-slate-600">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500 italic">No experience added.</p>}
              </Section>

              {/* Education */}
              <Section title="Education">
                {profile?.education?.length ? (
                  <div className="space-y-6">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400" />
                        <h4 className="text-base font-bold text-slate-900">{edu.institution}</h4>
                        <p className="text-sm font-medium text-indigo-600 mb-1">{edu.degree} in {edu.field}</p>
                        <p className="text-xs font-semibold text-slate-500">Class of {edu.year}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500 italic">No education added.</p>}
              </Section>

              {/* Preferences */}
              <Section title="Job Preferences">
                <div className="grid sm:grid-cols-2 gap-6">
                  <PrefItem icon={<IndianRupee />} label="Expected Salary" value={profile?.expected_salary ? `₹${profile.expected_salary} LPA` : '-'} />
                  <PrefItem icon={<Clock />} label="Notice Period" value={profile?.notice_period || '-'} />
                  <PrefItem icon={<MapPin />} label="Preferred Locations" value={profile?.preferred_locations?.join(', ') || '-'} />
                  <PrefItem icon={<Briefcase />} label="Job Types" value={profile?.job_types?.join(', ') || '-'} />
                  <PrefItem icon={<Code2 />} label="Work Modes" value={profile?.work_modes?.join(', ') || '-'} />
                </div>
              </Section>

            </div>
          ) : (
            
            // EDIT MODE
            <form onSubmit={handleSave} className="space-y-6">
              
              <EditSection title="Personal Information">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First Name" value={formData.first_name} onChange={(v: string) => handleChange('first_name', v)} required />
                  <Input label="Last Name" value={formData.last_name} onChange={(v: string) => handleChange('last_name', v)} required />
                  <Input label="Phone Number" value={formData.phone} onChange={(v: string) => handleChange('phone', v)} placeholder="+91 9876543210" />
                </div>
              </EditSection>

              <EditSection title="Professional Information">
                <Input label="Professional Headline" value={formData.headline} onChange={(v: string) => handleChange('headline', v)} placeholder="e.g., Software Engineer, Data Analyst, UI/UX Designer" required />
                <Input label="Resume Sub-headline (Optional)" value={formData.resume_headline} onChange={(v: string) => handleChange('resume_headline', v)} placeholder="e.g. Ex-Google | B.Tech IIT" />
                
                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">About Me (Bio)</label>
                  <textarea 
                    value={formData.bio} 
                    onChange={e => handleChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none text-slate-800"
                    placeholder="Tell recruiters about yourself..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <Input label="Current Location" value={formData.location} onChange={(v: string) => handleChange('location', v)} placeholder="City, State, Country" />
                </div>
              </EditSection>

              <EditSection title="Skills">
                <div className="mb-3 flex flex-wrap gap-2">
                  <AnimatePresence>
                    {formData.skills.map((skill: string, i: number) => (
                      <motion.span 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100"
                      >
                        {skill}
                        <button type="button" onClick={() => handleArrayRemove('skills', i)} className="hover:text-indigo-900"><X className="w-3.5 h-3.5" /></button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleArrayAdd('skills', skillInput, setSkillInput); } }}
                    placeholder="Add a skill and press enter..."
                    className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all"
                  />
                  <button type="button" onClick={() => handleArrayAdd('skills', skillInput, setSkillInput)} className="px-4 bg-slate-100 rounded-xl hover:bg-slate-200 font-bold text-slate-700">Add</button>
                </div>
              </EditSection>

              <EditSection title="Experience">
                <div className="space-y-4">
                  {formData.experience.map((exp: any, i: number) => (
                    <div key={i} className="p-4 border-2 border-slate-100 rounded-2xl relative">
                      <button type="button" onClick={() => handleObjectArrayRemove('experience', i)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X className="w-5 h-5" /></button>
                      <div className="grid sm:grid-cols-2 gap-4 pr-8 mb-4">
                        <Input label="Job Title" value={exp.title || ''} onChange={(v: string) => handleObjectArrayUpdate('experience', i, 'title', v)} />
                        <Input label="Company" value={exp.company || ''} onChange={(v: string) => handleObjectArrayUpdate('experience', i, 'company', v)} />
                        <Input label="Start Date (YYYY-MM)" value={exp.start_date || ''} onChange={(v: string) => handleObjectArrayUpdate('experience', i, 'start_date', v)} />
                        <Input label="End Date (YYYY-MM)" value={exp.end_date || ''} onChange={(v: string) => handleObjectArrayUpdate('experience', i, 'end_date', v)} disabled={exp.current} />
                      </div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 cursor-pointer w-max">
                        <input type="checkbox" checked={exp.current || false} onChange={e => handleObjectArrayUpdate('experience', i, 'current', e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                        I currently work here
                      </label>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                      <textarea value={exp.description || ''} onChange={e => handleObjectArrayUpdate('experience', i, 'description', e.target.value)} rows={2} className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all resize-none text-slate-800" />
                    </div>
                  ))}
                  <button type="button" onClick={() => handleObjectArrayAdd('experience', {})} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 px-4 py-2 bg-indigo-50 rounded-xl w-max">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>
              </EditSection>

              <EditSection title="Education">
                <div className="space-y-4">
                  {formData.education.map((edu: any, i: number) => (
                    <div key={i} className="p-4 border-2 border-slate-100 rounded-2xl relative">
                      <button type="button" onClick={() => handleObjectArrayRemove('education', i)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><X className="w-5 h-5" /></button>
                      <div className="grid sm:grid-cols-2 gap-4 pr-8">
                        <Input label="Institution" value={edu.institution || ''} onChange={(v: string) => handleObjectArrayUpdate('education', i, 'institution', v)} />
                        <Input label="Degree (e.g. B.Tech)" value={edu.degree || ''} onChange={(v: string) => handleObjectArrayUpdate('education', i, 'degree', v)} />
                        <Input label="Field of Study" value={edu.field || ''} onChange={(v: string) => handleObjectArrayUpdate('education', i, 'field', v)} />
                        <Input label="Graduation Year" type="number" value={edu.year || ''} onChange={(v: string) => handleObjectArrayUpdate('education', i, 'year', v ? Number(v) : '')} />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleObjectArrayAdd('education', {})} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 px-4 py-2 bg-indigo-50 rounded-xl w-max">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
              </EditSection>

              <EditSection title="Job Preferences">
                
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Expected Salary (LPA)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" min="0" value={formData.expected_salary} onChange={e => handleChange('expected_salary', e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-800"
                        placeholder="e.g. 15"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Notice Period</label>
                    <select 
                      value={formData.notice_period} onChange={e => handleChange('notice_period', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium"
                    >
                      <option value="">Select notice period...</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Preferred Locations */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Preferred Locations</label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.preferred_locations.map((loc: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">{loc} <button type="button" onClick={() => handleArrayRemove('preferred_locations', i)}><X className="w-3.5 h-3.5 hover:text-red-500"/></button></span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={locInput} onChange={e => setLocInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleArrayAdd('preferred_locations', locInput, setLocInput); } }} placeholder="Add city and press enter..." className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm" />
                    </div>
                  </div>

                  {/* Multi-select chips for Job Types */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Job Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['Full-time', 'Part-time', 'Internship', 'Contract'].map(type => (
                        <ChipToggle 
                          key={type} label={type} 
                          active={formData.job_types.includes(type)} 
                          onClick={() => {
                            if (formData.job_types.includes(type)) {
                              setFormData((p:any) => ({...p, job_types: p.job_types.filter((t:string)=>t!==type)}));
                            } else {
                              setFormData((p:any) => ({...p, job_types: [...p.job_types, type]}));
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Multi-select chips for Work Modes */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Mode</label>
                    <div className="flex flex-wrap gap-2">
                      {['Remote', 'Hybrid', 'On-site'].map(mode => (
                        <ChipToggle 
                          key={mode} label={mode} 
                          active={formData.work_modes.includes(mode)} 
                          onClick={() => {
                            if (formData.work_modes.includes(mode)) {
                              setFormData((p:any) => ({...p, work_modes: p.work_modes.filter((m:string)=>m!==mode)}));
                            } else {
                              setFormData((p:any) => ({...p, work_modes: [...p.work_modes, mode]}));
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </EditSection>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-slate-200 flex justify-end gap-4 sticky bottom-6 z-10 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-xl border">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset
                    window.scrollTo(0, 0);
                  }}
                  disabled={isSaving}
                  className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors border-2 border-slate-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};


// Component Helpers

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
      <h3 className="font-bold text-slate-900">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const EditSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden transition-all focus-within:border-indigo-200">
    <div className="p-5 border-b-2 border-slate-100 bg-slate-50/80">
      <h3 className="font-bold text-slate-900">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, type="text", placeholder="", required=false, disabled=false }: any) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium disabled:bg-slate-50 disabled:text-slate-400"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  </div>
);

const PrefItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex gap-3">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const MissingItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {text}
  </div>
);

const ChipToggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
      active ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
    }`}
  >
    {label}
  </button>
);
