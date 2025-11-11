"""
Afghanistan Population Data Analysis Script
Analyzes population estimates and medium variant projections
"""

import pandas as pd
import numpy as np

def load_data(filepath):
    """Load Afghanistan population data from Excel file"""
    try:
        # Read all sheets from the Excel file
        excel_file = pd.ExcelFile(filepath)
        print(f"Available sheets: {excel_file.sheet_names}")

        # Load the data (adjust sheet name if needed)
        df = pd.read_excel(filepath, sheet_name=0)
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def analyze_population_data(df):
    """Analyze population data with estimates and medium variants"""
    print("\n" + "="*60)
    print("AFGHANISTAN POPULATION DATA ANALYSIS")
    print("="*60)

    # Display basic information
    print("\nDataset Information:")
    print(f"Shape: {df.shape}")
    print(f"\nColumns: {df.columns.tolist()}")

    # Display first few rows
    print("\nFirst 5 rows:")
    print(df.head())

    # Display data types
    print("\nData Types:")
    print(df.dtypes)

    # Basic statistics
    print("\nBasic Statistics:")
    print(df.describe())

    # Check for missing values
    print("\nMissing Values:")
    print(df.isnull().sum())

    return df

def compare_variants(df):
    """Compare estimates variant and medium variant"""
    print("\n" + "="*60)
    print("COMPARING ESTIMATES AND MEDIUM VARIANTS")
    print("="*60)

    # This will depend on your actual column names
    # Adjust the column names based on your data structure

    # Look for columns containing 'estimate', 'medium', or 'variant'
    estimate_cols = [col for col in df.columns if 'estimate' in col.lower()]
    medium_cols = [col for col in df.columns if 'medium' in col.lower()]

    print(f"\nEstimate-related columns: {estimate_cols}")
    print(f"Medium-related columns: {medium_cols}")

    # If we have year and population columns
    if len(df.columns) > 1:
        print("\nSample data comparison:")
        print(df.head(10))

    return estimate_cols, medium_cols

def main():
    """Main analysis function"""
    filepath = "Afghanistan.xlsx"

    # Load data
    print("Loading Afghanistan population data...")
    df = load_data(filepath)

    if df is not None:
        # Analyze data
        df_analyzed = analyze_population_data(df)

        # Compare variants
        estimate_cols, medium_cols = compare_variants(df_analyzed)

        # Save processed data
        output_file = "afghanistan_population_processed.csv"
        df_analyzed.to_csv(output_file, index=False)
        print(f"\nProcessed data saved to: {output_file}")

        return df_analyzed
    else:
        print("Failed to load data")
        return None

if __name__ == "__main__":
    df = main()
