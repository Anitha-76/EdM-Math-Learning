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

# Calculate temperature range (high - low)
df['temp_range'] = df['high_temp_f'] - df['low_temp_f']

# Calculate monthly statistics
monthly_stats = df.groupby('month').agg({
    'high_temp_f': ['mean', 'max'],
    'low_temp_f': ['mean', 'min'],
    'temp_range': 'mean',
    'month_name': 'first'
}).reset_index()

# Flatten column names
monthly_stats.columns = ['month', 'avg_high', 'max_high', 'avg_low', 'min_low', 'avg_range', 'month_name']

# Create the visualization with bar chart
fig, ax = plt.subplots(figsize=(16, 8))

# Organize data by seasons
# Reorder: Winter (Jan, Feb), Spring (Mar, Apr, May), Summer (Jun, Jul, Aug), Fall (Sep, Oct, Nov), Winter (Dec)
season_order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
monthly_stats_ordered = monthly_stats.set_index('month').loc[season_order].reset_index()

# Prepare data for stacked bars
months = monthly_stats_ordered['month']
x = np.arange(len(months))
width = 0.7

avg_low = monthly_stats_ordered['avg_low']
temp_range = monthly_stats_ordered['avg_high'] - monthly_stats_ordered['avg_low']

# Define season colors and positions - more saturated
season_colors_list = []
season_positions = {'Winter': [], 'Spring': [], 'Summer': [], 'Fall': []}

for i, month in enumerate(months):
    if month in [12, 1, 2]:
        season_colors_list.append('#4A90E2')  # Winter - Bright blue
        season_positions['Winter'].append(i)
    elif month in [3, 4, 5]:
        season_colors_list.append('#50C878')  # Spring - Emerald green
        season_positions['Spring'].append(i)
    elif month in [6, 7, 8]:
        season_colors_list.append('#FF6B35')  # Summer - Vibrant orange-red
        season_positions['Summer'].append(i)
    else:  # 9, 10, 11
        season_colors_list.append('#D4A017')  # Fall - Golden yellow
        season_positions['Fall'].append(i)

# Create stacked bar chart
# Bottom bars (low temperature)
bars_low = ax.bar(x, avg_low, width, label='Average Low Temperature',
                   color='dodgerblue', alpha=0.7, edgecolor='black', linewidth=0.5)

# Top bars (temperature range)
bars_range = ax.bar(x, temp_range, width, bottom=avg_low,
                     color=season_colors_list, alpha=0.8, edgecolor='black',
                     linewidth=0.5, label='Temperature Range')

# Customize the plot
ax.set_xlabel('Season', fontsize=12, fontweight='bold')
ax.set_ylabel('Temperature (°F)', fontsize=12, fontweight='bold')
ax.set_title('Cambridge Temperature Range Across Seasons (2024)\nBar Chart Visualization',
             fontsize=14, fontweight='bold', pad=20)

# Set x-axis to show season names at group centers
season_labels = []
season_tick_positions = []

# Calculate center position for each season
season_groups = [
    ('Winter', [0, 1]),      # Jan, Feb
    ('Spring', [2, 3, 4]),   # Mar, Apr, May
    ('Summer', [5, 6, 7]),   # Jun, Jul, Aug
    ('Fall', [8, 9, 10]),    # Sep, Oct, Nov
    ('Winter', [11])         # Dec
]

for season_name, positions in season_groups:
    center = np.mean(positions)
    season_tick_positions.append(center)
    season_labels.append(season_name)

ax.set_xticks(season_tick_positions)
ax.set_xticklabels(season_labels, fontsize=12, fontweight='bold')

# Add month labels above each bar
for i, (idx, row) in enumerate(monthly_stats_ordered.iterrows()):
    month_abbr = row['month_name'][:3]  # First 3 letters
    # Position month name above the bar
    ax.text(i, row['avg_high'] + 3, month_abbr,
            ha='center', va='bottom', fontsize=9, fontweight='bold', rotation=0)

# Add grid for better readability
ax.grid(True, alpha=0.3, linestyle='--', axis='y')

# Create custom legend with season colors
from matplotlib.patches import Patch
legend_elements = [
    Patch(facecolor='dodgerblue', alpha=0.7, edgecolor='black', label='Average Low Temperature'),
    Patch(facecolor='#4A90E2', alpha=0.8, edgecolor='black', label='Winter Range'),
    Patch(facecolor='#50C878', alpha=0.8, edgecolor='black', label='Spring Range'),
    Patch(facecolor='#FF6B35', alpha=0.8, edgecolor='black', label='Summer Range'),
    Patch(facecolor='#D4A017', alpha=0.8, edgecolor='black', label='Fall Range')
]
ax.legend(handles=legend_elements, loc='upper left', fontsize=10, framealpha=0.9)

# Add temperature value labels inside the bars
for i, (idx, row) in enumerate(monthly_stats_ordered.iterrows()):
    # Label for high temperature
    ax.text(i, row['avg_high'] - 2, f"{row['avg_high']:.0f}°",
            ha='center', va='top', fontsize=8, fontweight='bold', color='white')
    # Label for low temperature
    ax.text(i, row['avg_low'] + 2, f"{row['avg_low']:.0f}°",
            ha='center', va='bottom', fontsize=8, fontweight='bold', color='white')

# Set y-axis limits with some padding
ax.set_ylim(0, max(monthly_stats['avg_high']) + 10)

# Adjust layout to prevent label cutoff
plt.tight_layout()

# Save the figure
plt.savefig('cambridge_temp_range_bar_chart.png', dpi=300, bbox_inches='tight')
print("Bar chart saved as 'cambridge_temp_range_bar_chart.png'")

# Display the plot
plt.show()

# Print summary statistics
print("\n" + "="*60)
print("TEMPERATURE RANGE ANALYSIS - CAMBRIDGE 2024")
print("="*60)
print(f"\n{'Month':<12} {'Avg High (°F)':<15} {'Avg Low (°F)':<15} {'Range (°F)':<12}")
print("-"*60)
for _, row in monthly_stats.iterrows():
    print(f"{row['month_name']:<12} {row['avg_high']:>10.1f}     {row['avg_low']:>10.1f}     {row['avg_range']:>8.1f}")

# Calculate seasonal averages
seasons = {
    'Winter (Dec-Feb)': [12, 1, 2],
    'Spring (Mar-May)': [3, 4, 5],
    'Summer (Jun-Aug)': [6, 7, 8],
    'Fall (Sep-Nov)': [9, 10, 11]
}

print("\n" + "="*60)
print("SEASONAL AVERAGES")
print("="*60)
for season_name, months_list in seasons.items():
    season_data = monthly_stats[monthly_stats['month'].isin(months_list)]
    avg_high = season_data['avg_high'].mean()
    avg_low = season_data['avg_low'].mean()
    avg_range = season_data['avg_range'].mean()
    print(f"\n{season_name}:")
    print(f"  Average High: {avg_high:.1f}°F")
    print(f"  Average Low:  {avg_low:.1f}°F")
    print(f"  Average Range: {avg_range:.1f}°F")
