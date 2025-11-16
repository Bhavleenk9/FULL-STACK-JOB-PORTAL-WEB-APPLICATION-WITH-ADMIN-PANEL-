CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'seeker',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  logo_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company_id INTEGER,
  location TEXT,
  job_type TEXT,
  experience_level TEXT,
  salary_range TEXT,
  description TEXT,
  skills TEXT,
  posted_by INTEGER,
  post_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY(company_id) REFERENCES companies(id),
  FOREIGN KEY(posted_by) REFERENCES users(id)
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_path TEXT,
  cover_letter TEXT,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(job_id) REFERENCES jobs(id)
);
