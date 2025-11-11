import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Read the data
df = pd.read_csv('cambridge_temps.csv')

# Convert date column to datetime
df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')

# Extract month for grouping
df['month'] = df['date'].dt.month
df['month_name'] = df['date'].dt.strftime('%B')

# Assign seasons
def assign_season(month):
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    else:  # 9, 10, 11
        return 'Fall'

df['season'] = df['month'].apply(assign_season)

# Calculate temperature range
df['temp_range'] = df['high_temp_f'] - df['low_temp_f']

# Create single combined histogram with all seasons
fig, ax = plt.subplots(figsize=(16, 10))

# Define season colors - more saturated
season_info = {
    'Winter': {'color': '#4A90E2', 'data': df[df['season'] == 'Winter']},
    'Spring': {'color': '#50C878', 'data': df[df['season'] == 'Spring']},
    'Summer': {'color': '#FF6B35', 'data': df[df['season'] == 'Summer']},
    'Fall': {'color': '#D4A017', 'data': df[df['season'] == 'Fall']}
}

# Define bins
bins = np.arange(0, 105, 5)  # 5-degree bins

# Plot histogram for each season - all temperatures
for season_name, info in season_info.items():
    season_data = info['data']

    # Combine high and low temperatures for each season
    all_temps = pd.concat([season_data['high_temp_f'], season_data['low_temp_f']])

    # Plot histogram
    ax.hist(all_temps, bins=bins, alpha=0.5,
            color=info['color'], label=season_name,
            edgecolor='black', linewidth=0.8)

# Customize the plot
ax.set_title('Cambridge Temperature Distribution by Season (2024)\nAll Seasons Combined',
             fontsize=16, fontweight='bold', pad=20)
ax.set_xlabel('Temperature (°F)', fontsize=13, fontweight='bold')
ax.set_ylabel('Number of Temperature Readings', fontsize=13, fontweight='bold')
ax.grid(True, alpha=0.3, linestyle='--', axis='y')

# Create legend with season statistics
from matplotlib.patches import Patch
legend_elements = []
for season_name in ['Winter', 'Spring', 'Summer', 'Fall']:
    info = season_info[season_name]
    season_data = info['data']
    avg_high = season_data['high_temp_f'].mean()
    avg_low = season_data['low_temp_f'].mean()

    legend_elements.append(
        Patch(facecolor=info['color'], alpha=0.5, edgecolor='black',
              label=f"{season_name}: {avg_low:.1f}°F - {avg_high:.1f}°F")
    )

ax.legend(handles=legend_elements, loc='upper right', fontsize=12,
          title='Season (Avg Low - Avg High)', title_fontsize=12, framealpha=0.95)

# Set x-axis range
ax.set_xlim(10, 100)

plt.tight_layout()

# Save the figure
plt.savefig('cambridge_temp_histogram_combined.png', dpi=300, bbox_inches='tight')
print("Combined histogram saved as 'cambridge_temp_histogram_combined.png'")
plt.close()

# Create a second visualization - consolidated bar chart by season
fig2, ax2 = plt.subplots(figsize=(14, 8))

# Calculate seasonal statistics
seasonal_stats = df.groupby('season').agg({
    'high_temp_f': 'mean',
    'low_temp_f': 'mean',
    'temp_range': 'mean'
}).reindex(['Winter', 'Spring', 'Summer', 'Fall'])

# Define x positions and width
seasons = seasonal_stats.index
x = np.arange(len(seasons))
width = 0.5

# Get season colors in order
colors = ['#4A90E2', '#50C878', '#FF6B35', '#D4A017']

# Create stacked bars
avg_low = seasonal_stats['low_temp_f']
temp_range = seasonal_stats['high_temp_f'] - seasonal_stats['low_temp_f']

# Bottom bars (low temperature)
bars_low = ax2.bar(x, avg_low, width, label='Average Low Temperature',
                   color='dodgerblue', alpha=0.7, edgecolor='black', linewidth=1)

# Top bars (temperature range)
bars_range = ax2.bar(x, temp_range, width, bottom=avg_low,
                     color=colors, alpha=0.8, edgecolor='black',
                     linewidth=1)

# Add month labels for each season
season_months = {
    'Winter': 'Dec, Jan, Feb',
    'Spring': 'Mar, Apr, May',
    'Summer': 'Jun, Jul, Aug',
    'Fall': 'Sep, Oct, Nov'
}

# Add temperature value labels
for i, (season, row) in enumerate(seasonal_stats.iterrows()):
    high_temp = row['high_temp_f']
    low_temp = row['low_temp_f']

    # High temperature label (white text on colored background)
    ax2.text(i, high_temp - 3, f"{high_temp:.1f}°F",
            ha='center', va='top', fontsize=11, fontweight='bold', color='white')

    # Low temperature label
    ax2.text(i, low_temp + 3, f"{low_temp:.1f}°F",
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='white')

    # Month labels above bars
    ax2.text(i, high_temp + 3, season_months[season],
            ha='center', va='bottom', fontsize=9, style='italic')

# Customize the plot
ax2.set_xlabel('Season', fontsize=13, fontweight='bold')
ax2.set_ylabel('Temperature (°F)', fontsize=13, fontweight='bold')
ax2.set_title('Consolidated Seasonal Temperature Ranges - Cambridge 2024',
             fontsize=15, fontweight='bold', pad=20)

# Set x-axis
ax2.set_xticks(x)
ax2.set_xticklabels(seasons, fontsize=12, fontweight='bold')

# Add grid
ax2.grid(True, alpha=0.3, linestyle='--', axis='y')

# Legend
ax2.legend(loc='upper left', fontsize=11, framealpha=0.9)

# Set y-axis limits
ax2.set_ylim(0, seasonal_stats['high_temp_f'].max() + 15)

plt.tight_layout()

# Save the figure
plt.savefig('cambridge_temp_consolidated_seasons.png', dpi=300, bbox_inches='tight')
print("Consolidated seasonal chart saved as 'cambridge_temp_consolidated_seasons.png'")
plt.close()

# Print summary statistics
print("\n" + "="*70)
print("CONSOLIDATED SEASONAL TEMPERATURE ANALYSIS - CAMBRIDGE 2024")
print("="*70)
print(f"\n{'Season':<15} {'Months':<20} {'Avg High (°F)':<15} {'Avg Low (°F)':<15} {'Range (°F)':<12}")
print("-"*70)
for season in ['Winter', 'Spring', 'Summer', 'Fall']:
    season_data = df[df['season'] == season]
    avg_high = season_data['high_temp_f'].mean()
    avg_low = season_data['low_temp_f'].mean()
    avg_range = season_data['temp_range'].mean()
    months = season_months[season]
    print(f"{season:<15} {months:<20} {avg_high:>10.1f}     {avg_low:>10.1f}     {avg_range:>8.1f}")

print("\n" + "="*70)
print("Temperature Spread by Season (Standard Deviation)")
print("="*70)
for season in ['Winter', 'Spring', 'Summer', 'Fall']:
    season_data = df[df['season'] == season]
    high_std = season_data['high_temp_f'].std()
    low_std = season_data['low_temp_f'].std()
    print(f"\n{season}:")
    print(f"  High Temp Std Dev: {high_std:.2f}°F")
    print(f"  Low Temp Std Dev:  {low_std:.2f}°F")
