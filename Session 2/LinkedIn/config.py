# Configuration file for LinkedIn Job Tracker

# Job Search Criteria
JOB_CRITERIA = {
    "keywords": ["education", "edtech", "project manager", "non-profit"],
    "job_titles": ["Project Manager", "Program Manager", "Education Manager"],
    "industries": ["Education", "EdTech", "Non-Profit"],
    "experience_level": "Mid-Senior level",
}

# Google Sheets Configuration
GOOGLE_SHEETS_CONFIG = {
    "spreadsheet_name": "LinkedIn Job Applications Tracker",
    "worksheet_name": "Jobs",
}

# Email Configuration (for daily alerts)
EMAIL_CONFIG = {
    "smtp_server": "smtp.gmail.com",  # Change if not using Gmail
    "smtp_port": 587,
    "sender_email": "manitha.kpm@gmail.com",  # UPDATE THIS
    "sender_password": "tegn kbmf bfjc jlqp",  # Use App Password for Gmail
    "recipient_email": "manitha.kpm@gmail.com",  # UPDATE THIS
    "send_daily_digest": True,
    "digest_time": "09:00",  # Send digest at 9 AM daily
}

# Reminder Configuration
REMINDER_CONFIG = {
    "follow_up_days": 7,  # Remind to follow up after 7 days
    "application_deadline_reminder": 2,  # Remind 2 days before deadline
}

# File Paths
SAVED_JOBS_FILE = "saved_jobs.txt"  # File where job URLs are stored
CREDENTIALS_FILE = "credentials.json"  # Google Sheets API credentials
TOKEN_FILE = "token.json"  # Google Sheets API token
