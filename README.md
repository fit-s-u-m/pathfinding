# Pathfinding Project

This project implements various pathfinding algorithms to find the shortest
path between two points on a grid.
It includes algorithms such as
**A (A-star)**, **Dijkstra**, **Breadth-First Search (BFS)**
and **Greedy Best-First Search**,
providing an interactive visualization for understanding how these algorithms work.

I always try to understand concept by making visualization one of them is this project.

![swappy-20241216-011152](https://github.com/user-attachments/assets/220a62b0-113d-490f-8f17-3d1f19f05a9a)

![swappy-20241216-011353](https://github.com/user-attachments/assets/2881e1a7-27ae-4542-a8b7-5ba13787312f)

https://github.com/user-attachments/assets/28c7c983-44df-4992-b84a-69c8b800f7c5

https://github.com/user-attachments/assets/508f0ca8-a90b-462d-9819-003752c1d904

https://github.com/user-attachments/assets/b12a7721-1dde-4252-87c0-eeba13894d27

Features

- **Multiple Algorithms**: Supports different pathfinding algorithms
like A*, Dijkstra, and BFS.  
- **Grid-based Layout**: The grid is customizable in size, allowing you
to test algorithms on different grid dimensions.  
- **Interactive Visualization**: Users can click on grid cells to set start
and end points, as well as walls.  
- **Step-by-Step Execution**: Watch the algorithm find the path step by step with
visual cues to understand the process.  
- **Responsive UI**: Works well across different screen sizes, making it accessible
for desktop and mobile users.
- **Map View Toggle**: Toggle between a world map of Ethiopia with randomly connected
cities and a grid layout view for pathfinding visualization.
  
## Note

- The neighboring city of a city is determined randomly, meaning the road connections
are arbitrary and not geographically accurate.
- The arrows represent one-way connections. For example, if there is an arrow from
`A -> B`, it does not imply you can travel from `B -> A`.
- The distance between cities is calculated
only if there is a road directly connecting them.
Distances are measured as the great-circle distance,
assuming the cities are points on a sphere.

## Installation

To get started, clone the repository and install the necessary dependencies:

### Clone the Repository

```bash
git clone https://github.com/fit-s-u-m/pathfinding.git
cd pathfinding
```

Copy code

```bash
bun install
```

```bash
#Copy code
bun run dev
```

## How to interact

- Click to set the **start** and **end** points.
- Click and drag to place walls or **obstacles** on both the map and grid view.
- Choose the algorithm (A*, Dijkstra, BFS) and click "Start" to begin the pathfinding
visualization.
- Click to set the start and end points.
- Click and drag to place walls or obstacles.
- Select the **algorithm** you want to use (A*, Dijkstra, BFS) from the UI.
- Click **Run** to begin the pathfinding visualization.

## Algorithms

- **A (A-star)**: A heuristic-based algorithm that finds the shortest path
using a cost function.
- **Dijkstra**: A graph traversal algorithm that finds the shortest path by exploring
the closest nodes first.
- **Breadth-First Search (BFS)**: Explores all nodes level by level to find the
shortest path.
- **Greedy Best-First Search**: A search algorithm that uses a heuristic to estimate
the distance from the current node to the goal, prioritizing nodes that are closer
to the goal.

### Algorithms Explained

A*(A-star)
A* is an informed search algorithm that combines the best features
of Dijkstra’s algorithm and Greedy Best-First Search. It uses a heuristic
to estimate the cost from the current node to the goal, allowing it to efficiently
find the shortest path.

Dijkstra's Algorithm
Dijkstra’s algorithm finds the shortest path in a graph with non-negative weights
by systematically exploring the closest nodes first, guaranteeing the shortest path
to the destination.

Breadth-First Search (BFS)
BFS is a simple algorithm that explores nodes in all directions, level by level.
It’s guaranteed to find the shortest path in an unweighted graph by exploring
all nodes at the current distance before moving to the next level.

## Project Structure

```bash
Copy code
/pathfinding-project
|-- /src          # Source code for the app
|   |-- /Algorithms   # Pathfinding algorithm implementations (A*, Dijkstra, BFS)
|   |-- /dataStructures   # Datastructures used (Queue, stack(for undo and redo))
|   |-- /visualization   # UI components (grid, map,description box,arrows, etc.)
|   |-- /utils        # Utility functions
|   |-- main.js        # Entry point
|   |-- handleUi.js      # handling buttons, selectors
|-- /public        # Images, icons, and other media
|-- package.json    # Project metadata and dependencies
|-- index.html    # Project metadata and dependencies
|-- style.css    # Project metadata and dependencies
```

This version uses **Alpine.js**, **p5.js**, **HTML**, **CSS**, and **TypeScript**.
Let me know if you'd like any further changes!

## Contributing

Feel free to fork the repository and submit pull requests for bug fixes,
new features, or improvements!

1. Fork the repository
2. Create a new branch (git checkout -b feature-branch)
3. Make your changes and commit (git commit -am 'Add new feature')
4. Push to your branch (git push origin feature-branch)
5. Create a new pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The A*, Dijkstra, and BFS algorithms were implemented based on common pathfinding
tutorials.
  - [nice video i saw](https://www.youtube.com/watch?v=-L-WgKMFuhE)
- Thanks you to all my freinds for your support and help.
