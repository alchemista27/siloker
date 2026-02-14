-- Create jobs table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  company text NOT NULL,
  location text NOT NULL,
  salary_min integer NOT NULL,
  salary_max integer NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to jobs
CREATE POLICY "Allow public read access to jobs"
  ON jobs
  FOR SELECT
  USING (true);

-- Create policy to allow public insert to applications
CREATE POLICY "Allow public insert to applications"
  ON applications
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public read access to applications
CREATE POLICY "Allow public read access to applications"
  ON applications
  FOR SELECT
  USING (true);

-- Create index for slug lookup
CREATE INDEX idx_jobs_slug ON jobs(slug);

-- Create index for location filter
CREATE INDEX idx_jobs_location ON jobs(location);

-- Create index for job_id lookup in applications
CREATE INDEX idx_applications_job_id ON applications(job_id);
