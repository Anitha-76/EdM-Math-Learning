# Email Notifier - Sends daily digests and reminders

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import List, Dict
import config


class EmailNotifier:
    """Handles email notifications for job applications"""

    def __init__(self):
        self.smtp_server = config.EMAIL_CONFIG['smtp_server']
        self.smtp_port = config.EMAIL_CONFIG['smtp_port']
        self.sender_email = config.EMAIL_CONFIG['sender_email']
        self.sender_password = config.EMAIL_CONFIG['sender_password']
        self.recipient_email = config.EMAIL_CONFIG['recipient_email']

    def send_email(self, subject: str, body: str, html: bool = True):
        """Send an email"""
        try:
            message = MIMEMultipart('alternative')
            message['From'] = self.sender_email
            message['To'] = self.recipient_email
            message['Subject'] = subject

            if html:
                part = MIMEText(body, 'html')
            else:
                part = MIMEText(body, 'plain')

            message.attach(part)

            # Connect to SMTP server and send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)

            print(f"Email sent successfully: {subject}")
            return True

        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    def send_daily_digest(self, new_jobs: List[Dict], pending_followups: List[Dict] = None):
        """Send daily digest of new jobs and pending follow-ups"""

        subject = f"LinkedIn Job Tracker - Daily Digest ({datetime.now().strftime('%Y-%m-%d')})"

        # Build HTML email body
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                h2 {{ color: #0066cc; }}
                .job-card {{
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }}
                .job-title {{ font-weight: bold; font-size: 18px; color: #0066cc; }}
                .company {{ color: #666; font-size: 14px; }}
                .details {{ margin-top: 10px; }}
                .label {{ font-weight: bold; }}
                .reminder {{ background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; }}
                a {{ color: #0066cc; text-decoration: none; }}
                a:hover {{ text-decoration: underline; }}
            </style>
        </head>
        <body>
            <h1>Your Daily Job Tracker Update</h1>
            <p>Hello! Here's your daily summary from LinkedIn Job Tracker.</p>
        """

        # Add new jobs section
        if new_jobs:
            html_body += f"""
            <h2>🆕 New Jobs Saved Today ({len(new_jobs)})</h2>
            """

            for job in new_jobs:
                html_body += f"""
                <div class="job-card">
                    <div class="job-title">{job.get('title', 'N/A')}</div>
                    <div class="company">{job.get('company', 'N/A')} - {job.get('location', 'N/A')}</div>
                    <div class="details">
                        <p><span class="label">Experience Level:</span> {job.get('experience_level', 'N/A')}</p>
                        <p><span class="label">Job Type:</span> {job.get('job_type', 'N/A')}</p>
                        <p><span class="label">Posted:</span> {job.get('posted_date', 'N/A')}</p>
                        <p><a href="{job.get('url', '#')}" target="_blank">View Job Posting →</a></p>
                    </div>
                </div>
                """
        else:
            html_body += "<p>No new jobs saved today.</p>"

        # Add follow-up reminders section
        if pending_followups:
            html_body += f"""
            <h2>⏰ Follow-up Reminders ({len(pending_followups)})</h2>
            """

            for followup in pending_followups:
                html_body += f"""
                <div class="reminder">
                    <p><span class="label">Job:</span> {followup.get('title', 'N/A')} at {followup.get('company', 'N/A')}</p>
                    <p><span class="label">Action:</span> {followup.get('reminder_reason', 'Follow up required')}</p>
                </div>
                """

        html_body += """
            <hr>
            <p style="color: #666; font-size: 12px;">
                This is an automated email from LinkedIn Job Tracker.<br>
                To update your preferences, edit the config.py file.
            </p>
        </body>
        </html>
        """

        return self.send_email(subject, html_body, html=True)

    def send_new_job_notification(self, job: Dict):
        """Send immediate notification for a newly saved job"""

        subject = f"New Job Saved: {job.get('title', 'N/A')}"

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>New Job Added to Tracker</h2>
            <p>A new job has been saved to your LinkedIn Job Tracker:</p>

            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
                <h3 style="color: #0066cc;">{job.get('title', 'N/A')}</h3>
                <p><strong>Company:</strong> {job.get('company', 'N/A')}</p>
                <p><strong>Location:</strong> {job.get('location', 'N/A')}</p>
                <p><strong>Experience Level:</strong> {job.get('experience_level', 'N/A')}</p>
                <p><strong>Job Type:</strong> {job.get('job_type', 'N/A')}</p>
                <p><strong>Posted:</strong> {job.get('posted_date', 'N/A')}</p>
                <p><a href="{job.get('url', '#')}" style="color: #0066cc;">View Job Posting</a></p>
            </div>

            <p style="margin-top: 20px;">
                <a href="https://docs.google.com/spreadsheets" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Open Job Tracker
                </a>
            </p>
        </body>
        </html>
        """

        return self.send_email(subject, html_body, html=True)

    def send_reminder(self, reminder_type: str, job: Dict):
        """Send reminder for follow-ups or deadlines"""

        if reminder_type == "follow_up":
            subject = f"Follow-up Reminder: {job.get('title', 'N/A')}"
            message = f"It's been {config.REMINDER_CONFIG['follow_up_days']} days since you applied. Consider following up!"
        elif reminder_type == "deadline":
            subject = f"Application Deadline Approaching: {job.get('title', 'N/A')}"
            message = "The application deadline is approaching soon!"
        else:
            subject = "Job Application Reminder"
            message = "You have a pending action for this job application."

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #ffc107;">⏰ Reminder</h2>
            <p>{message}</p>

            <div style="border-left: 4px solid #ffc107; background-color: #fff3cd; padding: 15px;">
                <h3>{job.get('title', 'N/A')}</h3>
                <p><strong>Company:</strong> {job.get('company', 'N/A')}</p>
                <p><a href="{job.get('url', '#')}" style="color: #0066cc;">View Job Posting</a></p>
            </div>
        </body>
        </html>
        """

        return self.send_email(subject, html_body, html=True)


if __name__ == "__main__":
    # Test email notifier
    notifier = EmailNotifier()

    # Test with a sample job
    test_job = {
        'title': 'Project Manager - EdTech',
        'company': 'Education Company',
        'location': 'New York, NY',
        'experience_level': 'Mid-Senior level',
        'job_type': 'Full-time',
        'posted_date': '1 day ago',
        'url': 'https://linkedin.com/jobs/view/123456'
    }

    print("Sending test notification...")
    notifier.send_new_job_notification(test_job)
