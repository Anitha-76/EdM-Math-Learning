"""
Afghanistan Population Visualization Script
Creates plots comparing estimates variant and medium variant
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Set style for better-looking plots
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 8)

def load_data(filepath):
    """Load Afghanistan population data"""
    try:
        df = pd.read_excel(filepath, sheet_name=0)
        print(f"Data loaded successfully. Shape: {df.shape}")
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def create_comparison_plot(df):
    """Create visualization comparing estimates and medium variants"""

    # Identify the structure of your data
    print("\nColumn names:")
    print(df.columns.tolist())

    # Attempt to identify year and population columns
    # Adjust these based on your actual column names

    # Common patterns for population data columns
    year_col = None
    estimate_col = None
    medium_col = None

    for col in df.columns:
        col_lower = str(col).lower()
        if 'year' in col_lower or 'time' in col_lower or 'period' in col_lower:
            year_col = col
        elif 'estimate' in col_lower:
            estimate_col = col
        elif 'medium' in col_lower:
            medium_col = col

    print(f"\nIdentified columns:")
    print(f"Year column: {year_col}")
    print(f"Estimate column: {estimate_col}")
    print(f"Medium column: {medium_col}")

    # Create multiple visualizations
    fig = plt.figure(figsize=(16, 10))

    # Plot 1: Line plot comparing both variants
    plt.subplot(2, 2, 1)
    if year_col and (estimate_col or medium_col):
        if estimate_col:
            plt.plot(df[year_col], df[estimate_col],
                    marker='o', linewidth=2, label='Estimates Variant', color='#2E86AB')
        if medium_col:
            plt.plot(df[year_col], df[medium_col],
                    marker='s', linewidth=2, label='Medium Variant', color='#A23B72')
    else:
        # If columns not identified, plot first two numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) >= 2:
            plt.plot(df.index, df[numeric_cols[0]],
                    marker='o', linewidth=2, label=numeric_cols[0], color='#2E86AB')
            plt.plot(df.index, df[numeric_cols[1]],
                    marker='s', linewidth=2, label=numeric_cols[1], color='#A23B72')

    plt.xlabel('Year', fontsize=12, fontweight='bold')
    plt.ylabel('Population', fontsize=12, fontweight='bold')
    plt.title('Afghanistan Population: Estimates vs Medium Variant',
             fontsize=14, fontweight='bold', pad=20)
    plt.legend(loc='best', fontsize=10)
    plt.grid(True, alpha=0.3)

    # Plot 2: Bar plot comparison
    plt.subplot(2, 2, 2)
    if year_col and estimate_col and medium_col:
        x = np.arange(len(df))
        width = 0.35
        plt.bar(x - width/2, df[estimate_col], width,
               label='Estimates Variant', color='#2E86AB', alpha=0.8)
        plt.bar(x + width/2, df[medium_col], width,
               label='Medium Variant', color='#A23B72', alpha=0.8)
        plt.xlabel('Index', fontsize=12, fontweight='bold')
    else:
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) >= 2:
            x = np.arange(len(df))
            width = 0.35
            plt.bar(x - width/2, df[numeric_cols[0]], width,
                   label=numeric_cols[0], color='#2E86AB', alpha=0.8)
            plt.bar(x + width/2, df[numeric_cols[1]], width,
                   label=numeric_cols[1], color='#A23B72', alpha=0.8)

    plt.ylabel('Population', fontsize=12, fontweight='bold')
    plt.title('Side-by-Side Comparison', fontsize=14, fontweight='bold', pad=20)
    plt.legend(loc='best', fontsize=10)
    plt.grid(True, alpha=0.3, axis='y')

    # Plot 3: Difference plot
    plt.subplot(2, 2, 3)
    if estimate_col and medium_col:
        difference = df[medium_col] - df[estimate_col]
        if year_col:
            plt.plot(df[year_col], difference, marker='o',
                    linewidth=2, color='#F18F01')
            plt.axhline(y=0, color='black', linestyle='--', alpha=0.5)
        else:
            plt.plot(df.index, difference, marker='o',
                    linewidth=2, color='#F18F01')
            plt.axhline(y=0, color='black', linestyle='--', alpha=0.5)

        plt.xlabel('Year', fontsize=12, fontweight='bold')
        plt.ylabel('Difference (Medium - Estimates)', fontsize=12, fontweight='bold')
        plt.title('Difference Between Variants', fontsize=14, fontweight='bold', pad=20)
        plt.grid(True, alpha=0.3)

    # Plot 4: Growth rate or percentage comparison
    plt.subplot(2, 2, 4)
    if estimate_col and medium_col:
        # Calculate percentage difference
        pct_diff = ((df[medium_col] - df[estimate_col]) / df[estimate_col] * 100)
        if year_col:
            plt.bar(df[year_col], pct_diff, color='#06A77D', alpha=0.7)
        else:
            plt.bar(df.index, pct_diff, color='#06A77D', alpha=0.7)

        plt.xlabel('Year', fontsize=12, fontweight='bold')
        plt.ylabel('Percentage Difference (%)', fontsize=12, fontweight='bold')
        plt.title('Percentage Difference (Medium vs Estimates)',
                 fontsize=14, fontweight='bold', pad=20)
        plt.axhline(y=0, color='black', linestyle='--', alpha=0.5)
        plt.grid(True, alpha=0.3, axis='y')

    plt.tight_layout()
    plt.savefig('afghanistan_population_analysis.png', dpi=300, bbox_inches='tight')
    print("\nVisualization saved as: afghanistan_population_analysis.png")
    plt.show()

def create_summary_statistics_plot(df):
    """Create a summary statistics visualization"""

    numeric_cols = df.select_dtypes(include=[np.number]).columns

    if len(numeric_cols) >= 2:
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))

        # Box plots - side by side for better comparison
        box_data = [df[numeric_cols[0]].dropna(), df[numeric_cols[1]].dropna()]
        bp = axes[0].boxplot(box_data,
                             labels=['Estimates Variant', 'Medium Variant'],
                             patch_artist=True,
                             widths=0.6)

        # Color the box plots
        bp['boxes'][0].set_facecolor('#2E86AB')
        bp['boxes'][0].set_alpha(0.7)
        bp['boxes'][1].set_facecolor('#A23B72')
        bp['boxes'][1].set_alpha(0.7)

        # Style the plot
        axes[0].set_title('Distribution Comparison (Box Plot)',
                         fontsize=14, fontweight='bold')
        axes[0].set_ylabel('Population', fontsize=12, fontweight='bold')
        axes[0].grid(True, alpha=0.3, axis='y')
        axes[0].set_xlabel('Variant Type', fontsize=12, fontweight='bold')

        # Violin plots
        data_to_plot = [df[col].dropna() for col in numeric_cols[:2]]
        vp = axes[1].violinplot(data_to_plot, showmeans=True, showmedians=True)

        # Color the violin plots to match box plots
        for i, pc in enumerate(vp['bodies']):
            if i == 0:
                pc.set_facecolor('#2E86AB')
            else:
                pc.set_facecolor('#A23B72')
            pc.set_alpha(0.7)

        axes[1].set_xticks([1, 2])
        axes[1].set_xticklabels(['Estimates Variant', 'Medium Variant'])
        axes[1].set_title('Distribution Comparison (Violin Plot)',
                         fontsize=14, fontweight='bold')
        axes[1].set_ylabel('Population', fontsize=12, fontweight='bold')
        axes[1].set_xlabel('Variant Type', fontsize=12, fontweight='bold')
        axes[1].grid(True, alpha=0.3, axis='y')

        plt.tight_layout()
        plt.savefig('afghanistan_population_distribution.png', dpi=300, bbox_inches='tight')
        print("Distribution plot saved as: afghanistan_population_distribution.png")
        plt.show()

def main():
    """Main visualization function"""
    filepath = "Afghanistan.xlsx"

    print("Loading data for visualization...")
    df = load_data(filepath)

    if df is not None:
        print("\nCreating visualizations...")
        create_comparison_plot(df)
        create_summary_statistics_plot(df)
        print("\nVisualization complete!")
    else:
        print("Failed to load data for visualization")

if __name__ == "__main__":
    main()
