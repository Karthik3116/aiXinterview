import requests
import json
import matplotlib.pyplot as plt

def get_leetcode_contest_history(username):
    """
    Fetches the contest history for a given LeetCode username.

    Args:
        username (str): The LeetCode username.

    Returns:
        dict or None: A dictionary containing the contest history data if successful,
                      otherwise None.
    """
    base_url = "https://leetcode-api-pied.vercel.app"
    endpoint = f"/user/{username}/contests"
    url = f"{base_url}{endpoint}"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {username}: {e}")
        return None

def plot_rating_graph(contest_data, username):
    """
    Plots the LeetCode contest rating graph from the fetched contest data.

    Args:
        contest_data (dict): The contest history data obtained from the API.
        username (str): The LeetCode username for the graph title.
    """
    # Check if the main data key 'userContestRankingHistory' exists
    if not contest_data or 'userContestRankingHistory' not in contest_data:
        print("No 'userContestRankingHistory' found in the fetched data. Cannot plot.")
        return

    # Get the list of contest history entries
    contest_history_list = contest_data['userContestRankingHistory']

    # Filter for only attended contests and extract ratings
    # The API response seems to provide 'rating' directly in each history entry.
    # We'll also use the index of the attended contests for the x-axis for simplicity,
    # as specific contest names or timestamps aren't clearly available in the snippet
    # for each history entry.
    
    attended_ratings = []
    contest_labels = [] # To store labels for the x-axis

    # Iterate through the history and collect data for attended contests
    for i, entry in enumerate(contest_history_list):
        # Only consider entries where 'attended' is true
        if entry.get('attended', False): # Use .get() with a default to prevent KeyError
            rating = entry.get('rating')
            if rating is not None:
                attended_ratings.append(rating)
                # You might want a more descriptive label if available in the API response,
                # e.g., entry.get('contestName', f"Contest {i+1}")
                contest_labels.append(f"Contest {len(attended_ratings)}") # Label based on attended count

    if not attended_ratings:
        print(f"No attended contest rating data found for {username} to plot.")
        return

    # Create the plot
    plt.figure(figsize=(14, 7)) # Adjust figure size for better readability
    plt.plot(contest_labels, attended_ratings, marker='o', linestyle='-', color='#4CAF50', linewidth=2) # Green color
    
    # Add title and labels
    plt.title(f"LeetCode Contest Rating History for {username}", fontsize=16, fontweight='bold')
    plt.xlabel("Contest Number (Attended)", fontsize=12)
    plt.ylabel("Rating", fontsize=12)
    
    # Add grid for better readability
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Rotate x-axis labels if there are many contests to prevent overlap
    if len(contest_labels) > 10:
        plt.xticks(rotation=45, ha='right', fontsize=10)
    else:
        plt.xticks(fontsize=10)
    
    plt.yticks(fontsize=10)
    
    # Add data points as text on the graph for clarity
    for i, txt in enumerate(attended_ratings):
        plt.annotate(f"{txt:.0f}", (contest_labels[i], attended_ratings[i]), textcoords="offset points", xytext=(0,5), ha='center', fontsize=9, color='darkblue')

    plt.tight_layout() # Adjust layout to prevent labels from overlapping
    plt.show()

if __name__ == "__main__":
    leetcode_username = "tanguturi_rajesh"  # Replace with a valid LeetCode username

    print(f"Fetching contest history for {leetcode_username}...")
    contest_history = get_leetcode_contest_history(leetcode_username)

    if contest_history:
        print(f"\nSuccessfully fetched data for {leetcode_username}.")
        # Print the full structure for verification (useful for debugging)
        # print(json.dumps(contest_history, indent=2)) 

        # Now, attempt to plot the graph
        plot_rating_graph(contest_history, leetcode_username)
    else:
        print(f"Could not retrieve contest history for {leetcode_username}.")
        print("Please ensure the username is correct and the API is accessible.")
        print("Also, check the console for any error messages during the fetch.")

