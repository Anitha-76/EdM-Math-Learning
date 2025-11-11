# Google Sheets Manager - Handles all Google Sheets operations

import os.path
import pickle
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict
from datetime import datetime
import config


SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


class GoogleSheetsManager:
    """Manages Google Sheets operations for job tracking"""

    def __init__(self):
        self.creds = None
        self.service = None
        self.spreadsheet_id = None
        self._authenticate()

    def _authenticate(self):
        """Authenticate with Google Sheets API"""
        # Token file stores user's access and refresh tokens
        if os.path.exists(config.TOKEN_FILE):
            with open(config.TOKEN_FILE, 'rb') as token:
                self.creds = pickle.load(token)

        # If credentials don't exist or are invalid, get new ones
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    config.CREDENTIALS_FILE, SCOPES)
                self.creds = flow.run_local_server(port=0)

            # Save credentials for next run
            with open(config.TOKEN_FILE, 'wb') as token:
                pickle.dump(self.creds, token)

        try:
            self.service = build('sheets', 'v4', credentials=self.creds)
        except HttpError as error:
            print(f'An error occurred: {error}')

    def create_spreadsheet(self):
        """Create a new spreadsheet for job tracking"""
        try:
            spreadsheet = {
                'properties': {
                    'title': config.GOOGLE_SHEETS_CONFIG['spreadsheet_name']
                },
                'sheets': [{
                    'properties': {
                        'title': config.GOOGLE_SHEETS_CONFIG['worksheet_name']
                    }
                }]
            }

            spreadsheet = self.service.spreadsheets().create(
                body=spreadsheet,
                fields='spreadsheetId,sheets.properties.sheetId'
            ).execute()

            self.spreadsheet_id = spreadsheet.get('spreadsheetId')
            self.sheet_id = spreadsheet.get('sheets')[0].get('properties').get('sheetId')
            print(f"Spreadsheet created with ID: {self.spreadsheet_id}")

            # Set up headers
            self._setup_headers()

            return self.spreadsheet_id

        except HttpError as error:
            print(f'An error occurred: {error}')
            return None

    def _setup_headers(self):
        """Set up column headers in the spreadsheet"""
        headers = [
            'Job Title', 'Company', 'Location', 'Job Type', 'Experience Level',
            'Posted Date', 'URL', 'Description', 'Status', 'Application Date',
            'Follow-up Date', 'Notes', 'Extracted Date'
        ]

        try:
            body = {
                'values': [headers]
            }

            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=f"{config.GOOGLE_SHEETS_CONFIG['worksheet_name']}!A1:M1",
                valueInputOption='RAW',
                body=body
            ).execute()

            # Format headers (bold, freeze row)
            # Get sheet ID if not already set
            if not hasattr(self, 'sheet_id'):
                sheet_metadata = self.service.spreadsheets().get(spreadsheetId=self.spreadsheet_id).execute()
                self.sheet_id = sheet_metadata.get('sheets')[0].get('properties').get('sheetId')

            requests = [
                {
                    'repeatCell': {
                        'range': {
                            'sheetId': self.sheet_id,
                            'startRowIndex': 0,
                            'endRowIndex': 1
                        },
                        'cell': {
                            'userEnteredFormat': {
                                'textFormat': {'bold': True},
                                'backgroundColor': {
                                    'red': 0.9,
                                    'green': 0.9,
                                    'blue': 0.9
                                }
                            }
                        },
                        'fields': 'userEnteredFormat(textFormat,backgroundColor)'
                    }
                },
                {
                    'updateSheetProperties': {
                        'properties': {
                            'sheetId': self.sheet_id,
                            'gridProperties': {'frozenRowCount': 1}
                        },
                        'fields': 'gridProperties.frozenRowCount'
                    }
                }
            ]

            body = {'requests': requests}
            self.service.spreadsheets().batchUpdate(
                spreadsheetId=self.spreadsheet_id,
                body=body
            ).execute()

            print("Headers set up successfully!")

        except HttpError as error:
            print(f'An error occurred: {error}')

    def add_jobs(self, jobs_data: List[Dict]):
        """Add job data to the spreadsheet"""
        if not self.spreadsheet_id:
            print("No spreadsheet ID set. Please create or set a spreadsheet first.")
            return

        try:
            values = []
            for job in jobs_data:
                row = [
                    job.get('title', ''),
                    job.get('company', ''),
                    job.get('location', ''),
                    job.get('job_type', ''),
                    job.get('experience_level', ''),
                    job.get('posted_date', ''),
                    job.get('url', ''),
                    job.get('description', ''),
                    job.get('status', 'Saved'),
                    job.get('application_date', ''),
                    job.get('follow_up_date', ''),
                    job.get('notes', ''),
                    job.get('extracted_date', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                ]
                values.append(row)

            body = {'values': values}

            result = self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=f"{config.GOOGLE_SHEETS_CONFIG['worksheet_name']}!A:M",
                valueInputOption='RAW',
                body=body
            ).execute()

            print(f"{result.get('updates').get('updatedRows')} rows added to spreadsheet")

        except HttpError as error:
            print(f'An error occurred: {error}')

    def set_spreadsheet_id(self, spreadsheet_id: str):
        """Set the spreadsheet ID to use"""
        self.spreadsheet_id = spreadsheet_id

    def get_all_jobs(self) -> List[List]:
        """Retrieve all jobs from the spreadsheet"""
        if not self.spreadsheet_id:
            print("No spreadsheet ID set.")
            return []

        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f"{config.GOOGLE_SHEETS_CONFIG['worksheet_name']}!A2:M"
            ).execute()

            values = result.get('values', [])
            return values

        except HttpError as error:
            print(f'An error occurred: {error}')
            return []

    def update_job_status(self, row_number: int, status: str, notes: str = ""):
        """Update the status of a specific job"""
        if not self.spreadsheet_id:
            print("No spreadsheet ID set.")
            return

        try:
            # Update status (column I, index 9)
            status_range = f"{config.GOOGLE_SHEETS_CONFIG['worksheet_name']}!I{row_number}"
            body = {'values': [[status]]}

            self.service.spreadsheets().values().update(
                spreadsheetId=self.spreadsheet_id,
                range=status_range,
                valueInputOption='RAW',
                body=body
            ).execute()

            # Update notes if provided (column L, index 12)
            if notes:
                notes_range = f"{config.GOOGLE_SHEETS_CONFIG['worksheet_name']}!L{row_number}"
                body = {'values': [[notes]]}

                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=notes_range,
                    valueInputOption='RAW',
                    body=body
                ).execute()

            print(f"Row {row_number} updated successfully")

        except HttpError as error:
            print(f'An error occurred: {error}')


if __name__ == "__main__":
    # Test the Google Sheets Manager
    manager = GoogleSheetsManager()

    # Create a new spreadsheet
    spreadsheet_id = manager.create_spreadsheet()

    print(f"\nSpreadsheet created! Access it at:")
    print(f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}")
