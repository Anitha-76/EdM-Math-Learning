# LinkedIn Job Tracker - Semi-Automated System

A Python-based system to help you track LinkedIn job applications efficiently. Save job postings, automatically extract details, organize in Google Sheets, and receive daily email alerts.

## 🎯 Features

- **Semi-Automated Job Saving**: Manually save interesting jobs, automatically extract details
- **Google Sheets Integration**: All jobs organized in a structured spreadsheet
- **Email Notifications**: Daily digests and individual job alerts
- **Job Description Archival**: Save full job descriptions for reference
- **Application Tracking**: Track status, deadlines, and follow-ups
- **Browser Bookmarklet**: Quick one-click job saving

## 📋 Prerequisites

1. **Python 3.8+** installed on your computer
2. **Gmail account** (for email notifications)
3. **Google account** (for Google Sheets)
4. **LinkedIn account** (for browsing jobs)

## 🚀 Installation & Setup

### Step 1: Install Python Dependencies

Open terminal/command prompt in the project folder and run:

```bash
pip install -r requirements.txt
```

### Step 2: Set Up Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Sheets API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Desktop app"
   - Download the JSON file
5. Rename the downloaded file to `credentials.json`
6. Place `credentials.json` in this project folder

### Step 3: Configure Email Settings

Edit [`config.py`](config.py) file:

```python
EMAIL_CONFIG = {
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "sender_email": "your_email@gmail.com",  # UPDATE THIS
    "sender_password": "your_app_password",   # UPDATE THIS (see below)
    "recipient_email": "your_email@gmail.com", # UPDATE THIS
    "send_daily_digest": True,
    "digest_time": "09:00",
}
```

**Getting Gmail App Password:**
1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Generate new app password
4. Copy the 16-character password
5. Use this in `config.py` (NOT your regular Gmail password)

### Step 4: Create Your Job Tracker Sheet

Run the setup command:

```bash
python main.py --setup
```

This will:
- Authenticate with Google Sheets (browser will open)
- Create a new spreadsheet
- Set up column headers
- Display the spreadsheet URL

**Save the spreadsheet ID** from the URL for future use!

## 📖 How to Use

### Method 1: Using the Bookmarklet (Recommended)

1. **Install Bookmarklet:**
   - Open [`bookmarklet.html`](bookmarklet.html) in your browser
   - Drag the "Save LinkedIn Job" button to your bookmarks bar

2. **Save Jobs:**
   - Browse LinkedIn jobs as usual
   - When you find an interesting job, click the bookmarklet
   - Copy the URL from the popup
   - Paste it into [`saved_jobs.txt`](saved_jobs.txt)

3. **Process Jobs:**
   ```bash
   python main.py --process
   ```

### Method 2: Manual URL Copying

1. **Browse LinkedIn** and open job postings
2. **Copy URLs** from browser address bar
3. **Paste into** [`saved_jobs.txt`](saved_jobs.txt) (one URL per line)
4. **Run processor:**
   ```bash
   python main.py --process
   ```

## 🎮 Commands

```bash
# Initial setup (first time only)
python main.py --setup

# Process new jobs from saved_jobs.txt
python main.py --process

# Send daily digest email
python main.py --digest

# Set spreadsheet ID (if you have existing sheet)
python main.py --set-sheet YOUR_SPREADSHEET_ID
```

## 📊 Google Sheets Structure

Your tracker includes these columns:

| Column | Description |
|--------|-------------|
| Job Title | Position title |
| Company | Company name |
| Location | Job location |
| Job Type | Full-time, Part-time, etc. |
| Experience Level | Entry, Mid-Senior, etc. |
| Posted Date | When job was posted |
| URL | Link to job posting |
| Description | Job description (truncated) |
| Status | Saved, Applied, Interview, etc. |
| Application Date | When you applied |
| Follow-up Date | Reminder date |
| Notes | Your notes |
| Extracted Date | When added to tracker |

## 📧 Email Notifications

### Daily Digest
Automatically sent each morning with:
- New jobs saved yesterday
- Pending follow-up reminders
- Application deadlines

### Individual Job Alerts
Sent immediately when a new job is added to the tracker.

### Configure Email Settings
Edit [`config.py`](config.py) to customize:
- Email schedule
- Reminder intervals
- Notification preferences

## 🔄 Automation (Optional)

### Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., Daily at 8 AM)
4. Action: Start a program
5. Program: `python`
6. Arguments: `"C:\path\to\LinkedIn\main.py" --process`

### macOS/Linux Cron Job

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 8 AM)
0 8 * * * cd /path/to/LinkedIn && python main.py --process
```

## 🎯 Workflow Example

**Daily Routine:**

1. **Morning (5 minutes):**
   - Check daily digest email
   - Review new jobs in Google Sheets

2. **Throughout the day:**
   - Browse LinkedIn
   - Click bookmarklet on interesting jobs
   - URLs saved to `saved_jobs.txt`

3. **Evening (automated):**
   - Run `python main.py --process`
   - Jobs extracted and added to sheets
   - Email notifications sent

4. **Weekly:**
   - Review application status in Google Sheets
   - Update notes and follow-up dates
   - Respond to reminders

## 🛠️ Customization

### Modify Job Search Criteria
Edit [`config.py`](config.py):

```python
JOB_CRITERIA = {
    "keywords": ["education", "edtech", "project manager"],
    "job_titles": ["Project Manager", "Program Manager"],
    "industries": ["Education", "EdTech", "Non-Profit"],
    "experience_level": "Mid-Senior level",
}
```

### Adjust Reminder Timing
```python
REMINDER_CONFIG = {
    "follow_up_days": 7,  # Remind after 7 days
    "application_deadline_reminder": 2,  # Remind 2 days before
}
```

## ⚠️ Important Notes

### LinkedIn's Terms of Service
- This tool is **semi-automated** to respect LinkedIn's ToS
- You manually select which jobs to save
- Extraction is rate-limited and respectful
- No automated job applications

### Rate Limiting
- The script includes delays between requests
- Don't process too many jobs at once (recommended: 10-20 per batch)
- If LinkedIn blocks requests, wait a few hours

### Data Privacy
- All data stored locally and in your Google Sheets
- No data shared with third parties
- Email credentials stored in `config.py` (keep secure)

## 🐛 Troubleshooting

### "No module named 'google'"
```bash
pip install -r requirements.txt
```

### "credentials.json not found"
- Download from Google Cloud Console
- Place in project folder
- Rename to exactly `credentials.json`

### Email not sending
- Check Gmail App Password (not regular password)
- Verify 2-Step Verification is enabled
- Check `config.py` settings

### Job extraction failed
- Verify URL is a LinkedIn job posting
- Check internet connection
- LinkedIn may have changed HTML structure (contact developer)

### Google Sheets authentication issues
- Delete `token.json` and re-authenticate
- Check credentials.json is valid
- Ensure Google Sheets API is enabled

## 📁 File Structure

```
LinkedIn/
├── config.py                  # Configuration settings
├── main.py                    # Main script
├── job_extractor.py          # Job detail extraction
├── google_sheets_manager.py  # Google Sheets operations
├── email_notifier.py         # Email notifications
├── requirements.txt          # Python dependencies
├── saved_jobs.txt            # Your saved job URLs
├── bookmarklet.html          # Browser bookmarklet
├── README.md                 # This file
├── credentials.json          # Google API credentials (you add this)
└── token.json               # Generated after first auth
```

## 🔐 Security Best Practices

1. **Never commit** `credentials.json` or `token.json` to version control
2. **Use App Passwords** for Gmail (not your actual password)
3. **Keep** `config.py` secure (contains email credentials)
4. **Don't share** your Google Sheets publicly

## 🎓 Tips for Job Hunting

1. **Be Consistent**: Check LinkedIn daily, save interesting jobs
2. **Quality over Quantity**: Focus on jobs you're genuinely interested in
3. **Take Notes**: Use the Notes column to track key points
4. **Follow Up**: Respond to email reminders promptly
5. **Customize Applications**: Use saved job descriptions to tailor your resume
6. **Track Everything**: Update status regularly

## 🆘 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify all prerequisites are met
3. Review error messages carefully
4. Check that all files are in the correct location

## 📝 Future Enhancements

Potential features to add:
- [ ] LinkedIn API integration (when available)
- [ ] Advanced job matching based on your profile
- [ ] Application deadline tracking
- [ ] Interview scheduling integration
- [ ] Resume version tracking
- [ ] Cover letter templates
- [ ] Analytics dashboard

## 📜 License

This is a personal productivity tool. Use responsibly and in accordance with LinkedIn's Terms of Service.

---

**Happy Job Hunting! 🚀**

*Remember: Finding the right job takes time. Stay organized, stay persistent, and stay positive!*
