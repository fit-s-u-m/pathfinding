import p5 from "p5";
import { Grid } from "../src/visualization/grid";
import { Ui } from "./handleUi";
import { ALGORITHMS } from "./type";
import { Algorithms, PathFindingAlgorithm } from "./util/pathFindingAlgorithms";
import { History } from "./util/history";
import { Country } from "./visualization/map";
import { Graph } from "./dataStructures/Graph";

import { ComposedAction } from "./util/action";

import Alpine from 'alpinejs'
window.Alpine = Alpine
Alpine.start()


const app = document.getElementById("app");
const history = History.getInstance()
let composedAction: ComposedAction | null = null;

if (!app) throw new Error("App not found");

const drawing = (p: p5) => {
  let graph: Graph;
  let ui: Ui;
  let algorithm: PathFindingAlgorithm;
  let iterator: Iterator<void>
  let geoJsonCities: any
  let getJsoncountry: any
  let paused = false
  p.preload = () => {
    geoJsonCities = p.loadJSON("/pathfinding/map.geojson")
    getJsoncountry = p.loadJSON("/pathfinding/mapOutline.geojson")
  }
  p.setup = () => {
    p.createCanvas(app.clientWidth, app.clientHeight);
    ui = new Ui(p);
    ui.updateFlag()  // label the selected flag
    ui.updateRun(updatePlay) // contol the play button
    ui.clearBoardButton(clearBoard)
    ui.updateAlgorithm(updateAlgorithm)
    ui.handleHistory(handleHistory)
    ui.updateVisual(updateVisual)
    ui.handleDropDown()
    console.log(ui.selectedVisual)

    if (ui.selectedVisual === "Grid")
      graph = new Grid(app.clientWidth, app.clientHeight);
    else
      graph = new Country(geoJsonCities, getJsoncountry, app.clientWidth, app.clientHeight)

    graph.createNeighbors()
    algorithm = Algorithms.algorithms(ui.selectedAlgorithm);

  };
  p.draw = () => {
    p.clear()
    p.cursor(p.ARROW);
    graph.show(p);
    if (iterator && !paused) {
      if (graph.start && graph.end) {
        let next = iterator.next();

        if (!next.done) {
          next = iterator.next();
        }
      }
    }
    graph.onMouseHover(p.mouseX, p.mouseY, p)
  };
  p.windowResized = () => {
    p.resizeCanvas(app.clientWidth, app.clientHeight);
    graph.resize(app.clientWidth, app.clientHeight);
  };

  // for pc users
  p.mouseDragged = () => {
    const selected = ui.selectedFlag;
    if (ui.dropDownOpen) return
    if (selected == "obstacle" && composedAction) {
      const action = graph.addObstacle(p.mouseX, p.mouseY);
      if (action)
        composedAction.addAction(action)
    }
  };
  p.mouseReleased = () => {
    if (!composedAction) return
    if (!composedAction.isEmpty())
      History.getInstance().saveState(composedAction)
    composedAction = null // reset
  }
  p.mousePressed = () => {
    if (ui.dropDownOpen) return
    plantFlag()
  }

  // for mobile
  p.touchMoved = () => {
    const selected = ui.selectedFlag;
    if (ui.dropDownOpen) return
    if (selected == "obstacle" && composedAction) {
      const action = graph.addObstacle(p.mouseX, p.mouseY);
      if (action)
        composedAction.addAction(action)
    }
  }
  p.touchEnded = () => {
    if (!composedAction) return
    if (!composedAction.isEmpty())
      History.getInstance().saveState(composedAction)
    composedAction = null // reset
  }
  p.touchStarted = () => {
    if (ui.dropDownOpen) return
    plantFlag()
  }

  function handleHistory(action: "prev" | "next") {
    if (action === "prev") {
      if (!paused)
        paused = true
      history.prev()
    }
    else {
      if (history.hasNext())
        history.next()
      else {
        paused = false
      }
    }
  }
  const plantFlag = () => {
    const selected = ui.selectedFlag;
    if (selected === "obstacle") {
      const action = graph.addObstacle(p.mouseX, p.mouseY);
      composedAction = new ComposedAction()
      if (action)
        composedAction.addAction(action)
    } else if (selected === "start") {
      graph.setStart(p.mouseX, p.mouseY);
    } else if (selected === "end") {
      graph.setEnd(p.mouseX, p.mouseY);
    }
  };
  function updatePlay() {
    if (graph.start && graph.end) {
      graph.clearHighlight() // clear the board first
      history.goToPresent()
      if (paused) paused = false
      iterator = algorithm.findPath(graph, graph.start, graph.end);
    }
  }
  function updateVisual(selectedVisual: "Grid" | "Map") {
    if (!app || !geoJsonCities) return
    if (selectedVisual === "Grid") {
      graph = new Grid(app.clientWidth, app.clientHeight);
    }
    else {
      graph = new Country(geoJsonCities, getJsoncountry, app.clientWidth, app.clientHeight)
    }
    graph.createNeighbors()
    localStorage.setItem("selectedVisual", selectedVisual)
  }

  function updateAlgorithm(selectedAlgorithm: ALGORITHMS) {
    console.log(selectedAlgorithm)
    algorithm = Algorithms.algorithms(selectedAlgorithm);
  }
  const clearBoard = () => {
    graph.clearGraph()
  }

}

new p5(drawing, app);
