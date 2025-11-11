import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from dash import Dash, dcc, html, Input, Output, callback
import numpy as np

# Read and prepare the data
df = pd.read_csv('cambridge_temps.csv')
df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
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
df['temp_range'] = df['high_temp_f'] - df['low_temp_f']

# Define season colors
season_colors = {
    'Winter': '#4A90E2',
    'Spring': '#50C878',
    'Summer': '#FF6B35',
    'Fall': '#D4A017'
}

# Initialize the Dash app
app = Dash(__name__)

# Define the layout
app.layout = html.Div([
    html.Div([
        html.H1("Cambridge Weather Analysis Dashboard 2024",
                style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': 30}),

        html.Div([
            # Season selector
            html.Div([
                html.Label('Select Season:', style={'fontWeight': 'bold', 'fontSize': 16}),
                dcc.Dropdown(
                    id='season-dropdown',
                    options=[
                        {'label': 'All Seasons', 'value': 'All'},
                        {'label': 'Winter (Dec, Jan, Feb)', 'value': 'Winter'},
                        {'label': 'Spring (Mar, Apr, May)', 'value': 'Spring'},
                        {'label': 'Summer (Jun, Jul, Aug)', 'value': 'Summer'},
                        {'label': 'Fall (Sep, Oct, Nov)', 'value': 'Fall'}
                    ],
                    value='All',
                    style={'width': '100%'}
                )
            ], style={'width': '48%', 'display': 'inline-block', 'marginRight': '4%'}),

            # Statistical measure selector
            html.Div([
                html.Label('Select Statistical Measure:', style={'fontWeight': 'bold', 'fontSize': 16}),
                dcc.Dropdown(
                    id='stats-dropdown',
                    options=[
                        {'label': 'Average (Mean)', 'value': 'mean'},
                        {'label': 'Median', 'value': 'median'},
                        {'label': 'Variance', 'value': 'variance'},
                        {'label': 'Standard Deviation', 'value': 'std'}
                    ],
                    value='mean',
                    style={'width': '100%'}
                )
            ], style={'width': '48%', 'display': 'inline-block'})
        ], style={'marginBottom': 30}),

        # Statistics cards
        html.Div(id='stats-cards', style={'marginBottom': 30}),

        # Main visualization area
        html.Div([
            dcc.Graph(id='temperature-distribution'),
        ], style={'marginBottom': 20}),

        html.Div([
            html.Div([
                dcc.Graph(id='temperature-timeline')
            ], style={'width': '50%', 'display': 'inline-block'}),

            html.Div([
                dcc.Graph(id='temperature-box-plot')
            ], style={'width': '50%', 'display': 'inline-block'})
        ]),

        html.Div([
            dcc.Graph(id='seasonal-comparison')
        ], style={'marginTop': 20})

    ], style={'padding': '20px', 'backgroundColor': '#f8f9fa'})
])

# Callback for updating all visualizations
@callback(
    [Output('stats-cards', 'children'),
     Output('temperature-distribution', 'figure'),
     Output('temperature-timeline', 'figure'),
     Output('temperature-box-plot', 'figure'),
     Output('seasonal-comparison', 'figure')],
    [Input('season-dropdown', 'value'),
     Input('stats-dropdown', 'value')]
)
def update_dashboard(selected_season, selected_stat):
    # Filter data based on selected season
    if selected_season == 'All':
        filtered_df = df.copy()
    else:
        filtered_df = df[df['season'] == selected_season].copy()

    # Calculate statistics
    def calculate_stat(data, stat_type):
        if stat_type == 'mean':
            return data.mean()
        elif stat_type == 'median':
            return data.median()
        elif stat_type == 'variance':
            return data.var()
        elif stat_type == 'std':
            return data.std()

    stat_name = {
        'mean': 'Average',
        'median': 'Median',
        'variance': 'Variance',
        'std': 'Standard Deviation'
    }[selected_stat]

    # Create statistics cards
    if selected_season == 'All':
        # Show stats for all seasons
        cards = []
        for season in ['Winter', 'Spring', 'Summer', 'Fall']:
            season_data = df[df['season'] == season]
            high_stat = calculate_stat(season_data['high_temp_f'], selected_stat)
            low_stat = calculate_stat(season_data['low_temp_f'], selected_stat)
            avg_stat = calculate_stat(season_data['avg_temp_f'], selected_stat)

            card = html.Div([
                html.H3(season, style={'color': season_colors[season], 'marginBottom': 10}),
                html.P(f"High: {high_stat:.2f}°F", style={'fontSize': 14, 'margin': '5px 0'}),
                html.P(f"Low: {low_stat:.2f}°F", style={'fontSize': 14, 'margin': '5px 0'}),
                html.P(f"Average: {avg_stat:.2f}°F", style={'fontSize': 14, 'margin': '5px 0'})
            ], style={
                'width': '22%',
                'display': 'inline-block',
                'marginRight': '2%',
                'padding': '20px',
                'backgroundColor': 'white',
                'borderRadius': '10px',
                'boxShadow': '0 2px 4px rgba(0,0,0,0.1)',
                'border': f'3px solid {season_colors[season]}'
            })
            cards.append(card)
        stats_cards = html.Div(cards)
    else:
        # Show stats for selected season
        high_stat = calculate_stat(filtered_df['high_temp_f'], selected_stat)
        low_stat = calculate_stat(filtered_df['low_temp_f'], selected_stat)
        avg_stat = calculate_stat(filtered_df['avg_temp_f'], selected_stat)
        range_stat = calculate_stat(filtered_df['temp_range'], selected_stat)

        # Calculate min/max for comparison
        high_max = filtered_df['high_temp_f'].max()
        high_min = filtered_df['high_temp_f'].min()
        low_max = filtered_df['low_temp_f'].max()
        low_min = filtered_df['low_temp_f'].min()

        stats_cards = html.Div([
            # Statistical Measures Section
            html.Div([
                html.H3(f"{stat_name} Temperature Statistics",
                       style={'textAlign': 'center', 'marginBottom': 20, 'color': '#2c3e50'}),
                html.Div([
                    html.Div([
                        html.H2(f"{high_stat:.2f}°F", style={'color': '#e74c3c', 'margin': 0}),
                        html.P("High Temperature", style={'color': '#7f8c8d', 'margin': '5px 0'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '15px', 'backgroundColor': '#fee', 'borderRadius': '8px', 'marginRight': '2%'}),

                    html.Div([
                        html.H2(f"{low_stat:.2f}°F", style={'color': '#3498db', 'margin': 0}),
                        html.P("Low Temperature", style={'color': '#7f8c8d', 'margin': '5px 0'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '15px', 'backgroundColor': '#e3f2fd', 'borderRadius': '8px', 'marginRight': '2%'}),

                    html.Div([
                        html.H2(f"{avg_stat:.2f}°F", style={'color': '#27ae60', 'margin': 0}),
                        html.P("Average Temperature", style={'color': '#7f8c8d', 'margin': '5px 0'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '15px', 'backgroundColor': '#e8f5e9', 'borderRadius': '8px', 'marginRight': '2%'}),

                    html.Div([
                        html.H2(f"{range_stat:.2f}°F", style={'color': '#f39c12', 'margin': 0}),
                        html.P("Temperature Range", style={'color': '#7f8c8d', 'margin': '5px 0'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '15px', 'backgroundColor': '#fff3e0', 'borderRadius': '8px'})
                ])
            ], style={'padding': '20px', 'backgroundColor': 'white', 'borderRadius': '10px',
                     'boxShadow': '0 2px 4px rgba(0,0,0,0.1)', 'marginBottom': '20px'}),

            # Min/Max Section
            html.Div([
                html.H3("Maximum & Minimum Values (for comparison)",
                       style={'textAlign': 'center', 'marginBottom': 15, 'color': '#2c3e50', 'fontSize': '18px'}),
                html.P("These show the actual highest and lowest temperatures recorded, not statistical measures.",
                      style={'textAlign': 'center', 'color': '#7f8c8d', 'fontSize': '13px', 'marginBottom': 15, 'fontStyle': 'italic'}),
                html.Div([
                    html.Div([
                        html.H4(f"{high_max:.0f}°F", style={'color': '#c0392b', 'margin': '0 0 5px 0', 'fontSize': '24px'}),
                        html.P("Hottest Day", style={'color': '#7f8c8d', 'margin': '0 0 5px 0', 'fontSize': '12px'}),
                        html.P(f"(High Temp)", style={'color': '#95a5a6', 'margin': 0, 'fontSize': '11px'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '12px', 'backgroundColor': '#fadbd8', 'borderRadius': '8px', 'marginRight': '2%',
                             'border': '2px solid #e74c3c'}),

                    html.Div([
                        html.H4(f"{high_min:.0f}°F", style={'color': '#16a085', 'margin': '0 0 5px 0', 'fontSize': '24px'}),
                        html.P("Coolest Day", style={'color': '#7f8c8d', 'margin': '0 0 5px 0', 'fontSize': '12px'}),
                        html.P(f"(High Temp)", style={'color': '#95a5a6', 'margin': 0, 'fontSize': '11px'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '12px', 'backgroundColor': '#d1f2eb', 'borderRadius': '8px', 'marginRight': '2%',
                             'border': '2px solid #1abc9c'}),

                    html.Div([
                        html.H4(f"{low_max:.0f}°F", style={'color': '#d68910', 'margin': '0 0 5px 0', 'fontSize': '24px'}),
                        html.P("Warmest Night", style={'color': '#7f8c8d', 'margin': '0 0 5px 0', 'fontSize': '12px'}),
                        html.P(f"(Low Temp)", style={'color': '#95a5a6', 'margin': 0, 'fontSize': '11px'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '12px', 'backgroundColor': '#fcf3cf', 'borderRadius': '8px', 'marginRight': '2%',
                             'border': '2px solid #f39c12'}),

                    html.Div([
                        html.H4(f"{low_min:.0f}°F", style={'color': '#2874a6', 'margin': '0 0 5px 0', 'fontSize': '24px'}),
                        html.P("Coldest Night", style={'color': '#7f8c8d', 'margin': '0 0 5px 0', 'fontSize': '12px'}),
                        html.P(f"(Low Temp)", style={'color': '#95a5a6', 'margin': 0, 'fontSize': '11px'})
                    ], style={'width': '23%', 'display': 'inline-block', 'textAlign': 'center',
                             'padding': '12px', 'backgroundColor': '#d6eaf8', 'borderRadius': '8px',
                             'border': '2px solid #3498db'})
                ])
            ], style={'padding': '15px', 'backgroundColor': '#f8f9fa', 'borderRadius': '10px',
                     'boxShadow': '0 2px 4px rgba(0,0,0,0.1)', 'border': '2px dashed #95a5a6'})
        ])

    # Figure 1: Temperature Distribution Histogram
    fig_dist = go.Figure()

    if selected_season == 'All':
        for season in ['Winter', 'Spring', 'Summer', 'Fall']:
            season_data = df[df['season'] == season]
            all_temps = pd.concat([season_data['high_temp_f'], season_data['low_temp_f']])
            fig_dist.add_trace(go.Histogram(
                x=all_temps,
                name=season,
                marker_color=season_colors[season],
                opacity=0.6,
                nbinsx=20
            ))
    else:
        fig_dist.add_trace(go.Histogram(
            x=filtered_df['high_temp_f'],
            name='High Temperature',
            marker_color='#e74c3c',
            opacity=0.7,
            nbinsx=15
        ))
        fig_dist.add_trace(go.Histogram(
            x=filtered_df['low_temp_f'],
            name='Low Temperature',
            marker_color='#3498db',
            opacity=0.7,
            nbinsx=15
        ))

    fig_dist.update_layout(
        title=f'Temperature Distribution - {selected_season}',
        xaxis_title='Temperature (°F)',
        yaxis_title='Frequency',
        barmode='overlay',
        template='plotly_white',
        height=400
    )

    # Figure 2: Temperature Timeline
    fig_timeline = go.Figure()

    if selected_season == 'All':
        colors_list = [season_colors[season] for season in df['season']]
        fig_timeline.add_trace(go.Scatter(
            x=filtered_df['date'],
            y=filtered_df['high_temp_f'],
            mode='lines',
            name='High',
            line=dict(color='#e74c3c', width=2),
            fill=None
        ))
        fig_timeline.add_trace(go.Scatter(
            x=filtered_df['date'],
            y=filtered_df['low_temp_f'],
            mode='lines',
            name='Low',
            line=dict(color='#3498db', width=2),
            fill='tonexty',
            fillcolor='rgba(52, 152, 219, 0.2)'
        ))
    else:
        fig_timeline.add_trace(go.Scatter(
            x=filtered_df['date'],
            y=filtered_df['high_temp_f'],
            mode='lines+markers',
            name='High',
            line=dict(color='#e74c3c', width=2),
            marker=dict(size=4)
        ))
        fig_timeline.add_trace(go.Scatter(
            x=filtered_df['date'],
            y=filtered_df['low_temp_f'],
            mode='lines+markers',
            name='Low',
            line=dict(color='#3498db', width=2),
            marker=dict(size=4),
            fill='tonexty',
            fillcolor='rgba(52, 152, 219, 0.2)'
        ))

    fig_timeline.update_layout(
        title=f'Temperature Timeline - {selected_season}',
        xaxis_title='Date',
        yaxis_title='Temperature (°F)',
        template='plotly_white',
        height=400
    )

    # Figure 3: Box Plot
    fig_box = go.Figure()

    if selected_season == 'All':
        for season in ['Winter', 'Spring', 'Summer', 'Fall']:
            season_data = df[df['season'] == season]
            fig_box.add_trace(go.Box(
                y=season_data['high_temp_f'],
                name=f'{season} High',
                marker_color=season_colors[season],
                boxmean='sd'
            ))
    else:
        fig_box.add_trace(go.Box(
            y=filtered_df['high_temp_f'],
            name='High Temperature',
            marker_color='#e74c3c',
            boxmean='sd'
        ))
        fig_box.add_trace(go.Box(
            y=filtered_df['low_temp_f'],
            name='Low Temperature',
            marker_color='#3498db',
            boxmean='sd'
        ))
        fig_box.add_trace(go.Box(
            y=filtered_df['avg_temp_f'],
            name='Average Temperature',
            marker_color='#27ae60',
            boxmean='sd'
        ))

    fig_box.update_layout(
        title=f'Temperature Distribution Box Plot - {selected_season}',
        yaxis_title='Temperature (°F)',
        template='plotly_white',
        height=400
    )

    # Figure 4: Seasonal Comparison Bar Chart
    seasonal_stats = []
    for season in ['Winter', 'Spring', 'Summer', 'Fall']:
        season_data = df[df['season'] == season]
        stat_dict = {
            'Season': season,
            'High': calculate_stat(season_data['high_temp_f'], selected_stat),
            'Low': calculate_stat(season_data['low_temp_f'], selected_stat),
            'Average': calculate_stat(season_data['avg_temp_f'], selected_stat)
        }
        seasonal_stats.append(stat_dict)

    seasonal_df = pd.DataFrame(seasonal_stats)

    fig_comparison = go.Figure()

    # Determine opacity for each season based on selection
    if selected_season == 'All':
        low_opacity = [0.7] * len(seasonal_df)
        range_opacity = [0.8] * len(seasonal_df)
    else:
        # Highlight only the selected season
        low_opacity = [0.7 if s == selected_season else 0.2 for s in seasonal_df['Season']]
        range_opacity = [0.8 if s == selected_season else 0.2 for s in seasonal_df['Season']]

    # Create separate bar for each season to control individual opacity
    for idx, (season, row) in enumerate(seasonal_df.iterrows()):
        season_name = row['Season']

        # Add low temperature bar
        fig_comparison.add_trace(go.Bar(
            x=[season_name],
            y=[row['Low']],
            name='Low' if idx == 0 else '',
            marker_color='#3498db',
            opacity=low_opacity[idx],
            text=f"{row['Low']:.2f}",
            textposition='inside',
            textfont=dict(color='white', size=12),
            showlegend=(idx == 0),
            legendgroup='low'
        ))

        # Add temperature range bar
        fig_comparison.add_trace(go.Bar(
            x=[season_name],
            y=[row['High'] - row['Low']],
            name='Range' if idx == 0 else '',
            marker_color=season_colors[season_name],
            opacity=range_opacity[idx],
            text=f"{(row['High'] - row['Low']):.2f}",
            textposition='inside',
            textfont=dict(color='white', size=12),
            base=row['Low'],
            showlegend=(idx == 0),
            legendgroup='range'
        ))

    fig_comparison.update_layout(
        title=f'Seasonal {stat_name} Comparison',
        xaxis_title='Season',
        yaxis_title=f'{stat_name} Temperature (°F)',
        barmode='stack',
        template='plotly_white',
        height=500
    )

    return stats_cards, fig_dist, fig_timeline, fig_box, fig_comparison

# Run the app
if __name__ == '__main__':
    print("="*70)
    print("Starting Cambridge Weather Analysis Dashboard")
    print("="*70)
    print("\nDashboard Features:")
    print("  - Select individual seasons or view all seasons")
    print("  - Calculate Average, Median, Variance, or Standard Deviation")
    print("  - Interactive visualizations with temperature distributions")
    print("  - Timeline view showing temperature changes over time")
    print("  - Box plots for statistical analysis")
    print("  - Seasonal comparison charts")
    print("\nAccess the dashboard at: http://127.0.0.1:8050/")
    print("="*70)
    app.run(debug=True, port=8050)
