# Main Script - LinkedIn Job Tracker
# Run this script to process saved job URLs and update Google Sheets

import os
from job_extractor import LinkedInJobExtractor
from google_sheets_manager import GoogleSheetsManager
from email_notifier import EmailNotifier
import config
from datetime import datetime


class LinkedInJobTracker:
    """Main application for tracking LinkedIn jobs"""

    def __init__(self):
        self.extractor = LinkedInJobExtractor()
        self.sheets_manager = GoogleSheetsManager()
        self.sheets_manager.set_spreadsheet_id('1XiK20cWEPF-rNU1BydJwtGHRIjvqUGAQhDA40mNMcT4')
        self.notifier = EmailNotifier()
        self.saved_jobs_file = config.SAVED_JOBS_FILE

    def read_saved_jobs(self):
        """Read job URLs from saved_jobs.txt file"""
        if not os.path.exists(self.saved_jobs_file):
            print(f"No {self.saved_jobs_file} found. Creating new file...")
            with open(self.saved_jobs_file, 'w') as f:
                f.write("# Add LinkedIn job URLs here (one per line)\n")
            return []

        with open(self.saved_jobs_file, 'r') as f:
            urls = [line.strip() for line in f.readlines()
                   if line.strip() and not line.startswith('#')]

        return urls

    def clear_saved_jobs(self):
        """Clear processed jobs from saved_jobs.txt"""
        with open(self.saved_jobs_file, 'w') as f:
            f.write("# Add LinkedIn job URLs here (one per line)\n")
            f.write(f"# Last processed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    def process_new_jobs(self):
        """Process new jobs from saved_jobs.txt"""
        print("=" * 60)
        print("LinkedIn Job Tracker - Processing New Jobs")
        print("=" * 60)

        # Read job URLs
        job_urls = self.read_saved_jobs()

        if not job_urls:
            print("\nNo new jobs to process.")
            print(f"Add LinkedIn job URLs to '{self.saved_jobs_file}' (one per line)")
            return

        print(f"\nFound {len(job_urls)} job(s) to process\n")

        # Extract job details
        print("Extracting job details...")
        jobs_data = self.extractor.extract_multiple_jobs(job_urls)

        if not jobs_data:
            print("No jobs were successfully extracted.")
            return

        print(f"\nSuccessfully extracted {len(jobs_data)} job(s)")

        # Add to Google Sheets
        print("\nAdding jobs to Google Sheets...")
        self.sheets_manager.add_jobs(jobs_data)

        # Send notifications
        if config.EMAIL_CONFIG['send_daily_digest']:
            print("\nSending email notifications...")
            for job in jobs_data:
                self.notifier.send_new_job_notification(job)

        # Clear processed jobs
        self.clear_saved_jobs()

        print("\n" + "=" * 60)
        print("✓ Processing complete!")
        print("=" * 60)
        print(f"\nView your jobs at:")
        print(f"https://docs.google.com/spreadsheets/d/{self.sheets_manager.spreadsheet_id}")

    def send_daily_digest(self):
        """Send daily digest of all saved jobs"""
        print("Sending daily digest...")

        # Get all jobs from sheets
        all_jobs = self.sheets_manager.get_all_jobs()

        # Filter jobs added today
        today = datetime.now().strftime('%Y-%m-%d')
        today_jobs = [job for job in all_jobs if today in str(job[-1])]  # Last column is extracted_date

        # Convert to dict format for email
        jobs_dict = []
        for job in today_jobs:
            if len(job) >= 8:
                jobs_dict.append({
                    'title': job[0],
                    'company': job[1],
                    'location': job[2],
                    'job_type': job[3],
                    'experience_level': job[4],
                    'posted_date': job[5],
                    'url': job[6],
                    'status': job[8] if len(job) > 8 else 'Saved'
                })

        # Send digest
        self.notifier.send_daily_digest(jobs_dict)
        print("Daily digest sent!")

    def setup_new_tracker(self):
        """Initial setup - create Google Sheets"""
        print("=" * 60)
        print("LinkedIn Job Tracker - Initial Setup")
        print("=" * 60)

        print("\nCreating Google Sheets tracker...")
        spreadsheet_id = self.sheets_manager.create_spreadsheet()

        if spreadsheet_id:
            print(f"\n✓ Setup complete!")
            print(f"\nYour job tracker spreadsheet:")
            print(f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}")
            print(f"\nSave this spreadsheet ID: {spreadsheet_id}")
            print("\nNext steps:")
            print(f"1. Add LinkedIn job URLs to '{self.saved_jobs_file}'")
            print("2. Run: python main.py --process")
        else:
            print("\n✗ Setup failed. Please check your credentials.")


def main():
    """Main entry point"""
    import sys

    tracker = LinkedInJobTracker()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "--setup":
            tracker.setup_new_tracker()
        elif command == "--process":
            tracker.process_new_jobs()
        elif command == "--digest":
            tracker.send_daily_digest()
        elif command == "--set-sheet":
            if len(sys.argv) > 2:
                sheet_id = sys.argv[2]
                tracker.sheets_manager.set_spreadsheet_id(sheet_id)
                print(f"Spreadsheet ID set to: {sheet_id}")
            else:
                print("Usage: python main.py --set-sheet <SPREADSHEET_ID>")
        else:
            print("Unknown command. Available commands:")
            print("  --setup      : Create new Google Sheets tracker")
            print("  --process    : Process new jobs from saved_jobs.txt")
            print("  --digest     : Send daily digest email")
            print("  --set-sheet  : Set spreadsheet ID to use")
    else:
        # Default: process new jobs
        tracker.process_new_jobs()


if __name__ == "__main__":
    main()
