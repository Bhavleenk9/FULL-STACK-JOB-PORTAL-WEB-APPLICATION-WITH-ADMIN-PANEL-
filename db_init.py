import sqlite3
from pathlib import Path
from werkzeug.security import generate_password_hash

# Paths
DB_PATH = Path("jobportal.db")
SCHEMA = Path("schema.sql")

def init_db():
    if not SCHEMA.exists():
        print("❌ schema.sql not found. Please create it in the project root.")
        return

    # Create DB connection
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Create schema
    with open(SCHEMA, "r", encoding="utf-8") as f:
        cur.executescript(f.read())
    print("✅ Tables created successfully.")

    # ---------- Seed Admin User ----------
    cur.execute("SELECT id FROM users WHERE username = ?", ("admin",))
    if not cur.fetchone():
        pwd = generate_password_hash("admin123")
        cur.execute("""
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        """, ("admin", "admin@hirex.com", pwd, "admin"))
        print("👑 Admin user created — username: admin | password: admin123")
    else:
        print("ℹ️ Admin user already exists, skipping...")

    # ---------- Seed Companies ----------
    companies = [
        ("FreshFuelz", "https://freshfuelz.in", "Transforming waste into power for progress."),
        ("TechNova", "https://technova.example", "Innovative AI-driven software solutions."),
        ("Birgi Enterprises", "https://birgienterprises.in", "The name that stands for quality — Vermicompost & Bio Products.")
    ]
    for name, website, desc in companies:
        cur.execute("SELECT id FROM companies WHERE name = ?", (name,))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO companies (name, website, description) VALUES (?, ?, ?)",
                (name, website, desc)
            )
            print(f"🏢 Company added: {name}")

    # ---------- Seed Jobs ----------
    cur.execute("SELECT COUNT(*) FROM jobs")
    count = cur.fetchone()[0]
    if count == 0:
        cur.execute("SELECT id FROM companies WHERE name = 'FreshFuelz'")
        company_id = cur.fetchone()[0]
        jobs = [
            ("Junior Python Developer", company_id, "Punjab, India", "Full-time", "Fresher", "₹10k - ₹25k",
             "Build and maintain web APIs for internal tools.", "python,flask,sqlite", 1),
            ("Data Analyst Intern", company_id, "Chandigarh, India", "Internship", "Fresher", "₹5k - ₹10k",
             "Assist analytics team with dashboards and reports.", "excel,sql,python,powerbi", 1),
        ]
        cur.executemany("""
            INSERT INTO jobs (title, company_id, location, job_type, experience_level, salary_range, description, skills, posted_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, jobs)
        print("💼 Sample jobs seeded successfully.")
    else:
        print("ℹ️ Jobs already exist, skipping seeding.")

    conn.commit()
    conn.close()
    print(f"🎉 Database initialized successfully at: {DB_PATH.resolve()}")

if __name__ == "__main__":
    init_db()
