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

# Create the visualization
fig, ax = plt.subplots(figsize=(14, 8))

# Plot the temperature range with filled area
months = monthly_stats['month']
avg_high = monthly_stats['avg_high']
avg_low = monthly_stats['avg_low']
max_high = monthly_stats['max_high']
min_low = monthly_stats['min_low']

# Fill between average high and low
ax.fill_between(months, avg_low, avg_high, alpha=0.3, color='steelblue', label='Average Temperature Range')

# Plot average high and low lines
ax.plot(months, avg_high, 'o-', color='crimson', linewidth=2, markersize=8, label='Average High Temperature')
ax.plot(months, avg_low, 'o-', color='dodgerblue', linewidth=2, markersize=8, label='Average Low Temperature')

# Add shaded area for extreme ranges
ax.fill_between(months, min_low, max_high, alpha=0.1, color='gray', label='Extreme Temperature Range')

# Customize the plot
ax.set_xlabel('Month', fontsize=12, fontweight='bold')
ax.set_ylabel('Temperature (°F)', fontsize=12, fontweight='bold')
ax.set_title('Cambridge Temperature Range Across Seasons (2024)\nJanuary to December',
             fontsize=14, fontweight='bold', pad=20)

# Set x-axis to show month names
ax.set_xticks(months)
ax.set_xticklabels(monthly_stats['month_name'], rotation=45, ha='right')

# Add grid for better readability
ax.grid(True, alpha=0.3, linestyle='--')

# Add legend
ax.legend(loc='upper left', fontsize=10, framealpha=0.9)

# Add season labels with more saturated, distinct colors
season_colors = {
    'Winter': '#4A90E2',    # Bright blue
    'Spring': '#50C878',    # Emerald green
    'Summer': '#FF6B35',    # Vibrant orange-red
    'Fall': '#D4A017'       # Golden yellow
}

# Add background color for seasons with higher alpha for better visibility
ax.axvspan(0.5, 2.5, alpha=0.25, color=season_colors['Winter'], zorder=0)
ax.axvspan(2.5, 5.5, alpha=0.25, color=season_colors['Spring'], zorder=0)
ax.axvspan(5.5, 8.5, alpha=0.25, color=season_colors['Summer'], zorder=0)
ax.axvspan(8.5, 11.5, alpha=0.25, color=season_colors['Fall'], zorder=0)
ax.axvspan(11.5, 12.5, alpha=0.25, color=season_colors['Winter'], zorder=0)

# Add season text labels at the top with darker, more visible colors
ax.text(1.5, ax.get_ylim()[1] * 0.95, 'Winter', ha='center', fontsize=10, fontweight='bold', color='#1E4D7B')
ax.text(4, ax.get_ylim()[1] * 0.95, 'Spring', ha='center', fontsize=10, fontweight='bold', color='#2B6F3F')
ax.text(7, ax.get_ylim()[1] * 0.95, 'Summer', ha='center', fontsize=10, fontweight='bold', color='#CC3300')
ax.text(10, ax.get_ylim()[1] * 0.95, 'Fall', ha='center', fontsize=10, fontweight='bold', color='#8B6914')
ax.text(12, ax.get_ylim()[1] * 0.95, 'Winter', ha='center', fontsize=10, fontweight='bold', color='#1E4D7B')

# Adjust layout to prevent label cutoff
plt.tight_layout()

# Save the figure
plt.savefig('cambridge_temp_range_seasons.png', dpi=300, bbox_inches='tight')
print("Graph saved as 'cambridge_temp_range_seasons.png'")

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
