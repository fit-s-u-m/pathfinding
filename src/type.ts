import { Cell } from "./util/cell";

export type CellType = "start" | "end" | "obstacle" | "normal" | "path" | "highlight";
export type SELECT = "start" | "end" | "obstacle";
export type ALGORITHMS =
  | "A* algorithms"
  | "Dijkstra’s algorithm"
  | "Maximum Flow algorithm"
  | "Minimum Spanning Tree"
  | "Breadth-First Search"
  | "Depth-First Search"
  | "Greedy Best-First Search"
  | "Bellman-Ford Algorithm"
  | "Floyd-Warshall Algorithm";
export type COLOR = [number, number, number, number];
export type HIGHLIGHT = { text: string; color: COLOR };
export type State = {
  start: Cell;
  end: Cell;
  obstacles: Cell[],
  highlightCell: Cell[],
  algorithsmPathCells: Cell[],
}
export type SUBJSON = {
  "type": string,
  "property": { "name": string },
  "geometry": {
    "coordinates": [number, number]
    "type": string
  }
}
export type GEOJSON = {
  "type": string
  "features": SUBJSON[]

}

export type CityData = {
  name: string,
  location: [number, number]
}
export type ArrowType = "disabled" | "highlight" | "normal" | "path"
