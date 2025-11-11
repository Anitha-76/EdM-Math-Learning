# Job Extractor Module - Extracts job details from LinkedIn URLs

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
from typing import Dict, Optional
import time


class LinkedInJobExtractor:
    """Extracts job information from LinkedIn job posting URLs"""

    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }

    def extract_job_details(self, job_url: str) -> Optional[Dict]:
        """
        Extract job details from a LinkedIn job URL

        Args:
            job_url: LinkedIn job posting URL

        Returns:
            Dictionary with job details or None if extraction fails
        """
        try:
            # Add delay to be respectful
            time.sleep(2)

            response = requests.get(job_url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            job_data = {
                'url': job_url,
                'title': self._extract_title(soup),
                'company': self._extract_company(soup),
                'location': self._extract_location(soup),
                'description': self._extract_description(soup),
                'posted_date': self._extract_posted_date(soup),
                'job_type': self._extract_job_type(soup),
                'experience_level': self._extract_experience_level(soup),
                'extracted_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'status': 'Saved',
                'notes': '',
                'application_date': '',
                'follow_up_date': '',
            }

            return job_data

        except Exception as e:
            print(f"Error extracting job details from {job_url}: {str(e)}")
            return None

    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract job title"""
        try:
            title = soup.find('h1', class_='top-card-layout__title')
            if title:
                return title.get_text(strip=True)

            # Alternative selectors
            title = soup.find('h1')
            if title:
                return title.get_text(strip=True)
        except:
            pass
        return "N/A"

    def _extract_company(self, soup: BeautifulSoup) -> str:
        """Extract company name"""
        try:
            company = soup.find('a', class_='topcard__org-name-link')
            if company:
                return company.get_text(strip=True)

            company = soup.find('span', class_='topcard__flavor')
            if company:
                return company.get_text(strip=True)
        except:
            pass
        return "N/A"

    def _extract_location(self, soup: BeautifulSoup) -> str:
        """Extract job location"""
        try:
            location = soup.find('span', class_='topcard__flavor topcard__flavor--bullet')
            if location:
                return location.get_text(strip=True)

            # Try alternative location selectors
            location = soup.find('span', class_='topcard__flavor--bullet')
            if location:
                return location.get_text(strip=True)
        except:
            pass
        return "N/A"

    def _extract_description(self, soup: BeautifulSoup) -> str:
        """Extract job description"""
        try:
            desc_div = soup.find('div', class_='show-more-less-html__markup')
            if desc_div:
                return desc_div.get_text(strip=True)[:1000]  # Limit to 1000 chars

            # Alternative selector
            desc_div = soup.find('div', class_='description__text')
            if desc_div:
                return desc_div.get_text(strip=True)[:1000]
        except:
            pass
        return "N/A"

    def _extract_posted_date(self, soup: BeautifulSoup) -> str:
        """Extract when the job was posted"""
        try:
            posted = soup.find('span', class_='posted-time-ago__text')
            if posted:
                return posted.get_text(strip=True)
        except:
            pass
        return "N/A"

    def _extract_job_type(self, soup: BeautifulSoup) -> str:
        """Extract job type (Full-time, Part-time, etc.)"""
        try:
            criteria_list = soup.find('ul', class_='description__job-criteria-list')
            if criteria_list:
                items = criteria_list.find_all('li')
                for item in items:
                    if 'Employment type' in item.get_text():
                        return item.find('span', class_='description__job-criteria-text').get_text(strip=True)
        except:
            pass
        return "N/A"

    def _extract_experience_level(self, soup: BeautifulSoup) -> str:
        """Extract experience level required"""
        try:
            criteria_list = soup.find('ul', class_='description__job-criteria-list')
            if criteria_list:
                items = criteria_list.find_all('li')
                for item in items:
                    if 'Seniority level' in item.get_text():
                        return item.find('span', class_='description__job-criteria-text').get_text(strip=True)
        except:
            pass
        return "N/A"

    def extract_multiple_jobs(self, job_urls: list) -> list:
        """
        Extract details for multiple job URLs

        Args:
            job_urls: List of LinkedIn job URLs

        Returns:
            List of job data dictionaries
        """
        jobs_data = []

        for i, url in enumerate(job_urls, 1):
            print(f"Extracting job {i}/{len(job_urls)}...")
            job_data = self.extract_job_details(url)

            if job_data:
                jobs_data.append(job_data)
            else:
                print(f"Failed to extract: {url}")

        return jobs_data


if __name__ == "__main__":
    # Test the extractor
    extractor = LinkedInJobExtractor()

    # Test with a sample URL (replace with actual LinkedIn job URL)
    test_url = "https://www.linkedin.com/jobs/view/1234567890/"
    job = extractor.extract_job_details(test_url)

    if job:
        print("Job extracted successfully!")
        for key, value in job.items():
            print(f"{key}: {value}")
    else:
        print("Failed to extract job details")
