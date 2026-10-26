export const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
] as const

export const educationLevels = [
  'Matric / Grade 12',
  'Certificate',
  'Diploma',
  'Bachelor’s degree',
  'Honours degree',
  'Master’s degree',
  'Doctorate',
  'Other',
] as const

export const careerStages = [
  'Student',
  'Recent graduate',
  'Early career',
  'Experienced professional',
  'Returning to work',
] as const

export const sectors = [
  'Administration',
  'Agriculture',
  'Business',
  'Education',
  'Engineering',
  'Finance',
  'Healthcare',
  'Public service',
  'Technology',
  'Trades',
] as const

export const workTypes = ['Permanent', 'Contract', 'Graduate programme', 'Internship', 'Part-time'] as const

export type Profile = {
  id: string
  full_name: string
  phone: string
  province: string
  career_stage: string
  education_level: string
  qualification: string
  professional_summary: string
  work_experience: string
  skills: string[]
  interests: string[]
  preferred_sectors: string[]
  work_types: string[]
  updated_at?: string
}

export type JobPosting = {
  id: string
  title: string
  employer: string
  location: string
  province: string | null
  description: string
  required_skills: string[]
  qualification_keywords: string[]
  sector: string
  employment_type: string
  application_deadline: string | null
  source_url: string
  posted_at: string
  is_active: boolean
  submitted_by?: string
}
