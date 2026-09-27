import api from './axios';

export interface Profile {
  profile_id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experience_years: number;
  experience: Array<{ title?: string; company?: string; start_date?: string; end_date?: string; current?: boolean; description?: string; [key: string]: any }>;
  education: Array<{ degree?: string; institution?: string; field?: string; year?: number; [key: string]: any }>;
  expected_salary?: number;
  notice_period?: string;
  resume_headline?: string;
  preferred_locations: string[];
  job_types: string[];
  work_modes: string[];
  created_at: string;
  updated_at?: string;
}

export type ProfileUpdate = Partial<Omit<Profile, 'profile_id' | 'user_id' | 'created_at' | 'updated_at' | 'email' | 'profile_image'>>;

export const profilesApi = {
  getMyProfile: async (): Promise<Profile> => {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  updateMyProfile: async (data: ProfileUpdate): Promise<Profile> => {
    const response = await api.put('/profiles/me', data);
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/profiles/me/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
