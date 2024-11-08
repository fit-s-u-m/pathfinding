import p5 from "p5";
import { Grid } from "./util/grid";
import { Ui } from "./handleUi";
import { ALGORITHMS, State } from "./type";
import { Algorithms, PathFindingAlgorithm } from "./util/pathFindingAlgorithms";
import { History } from "./util/history";
import { Country } from "./visualization/map";

import Alpine from 'alpinejs'
import { Graph } from "./dataStructures/Graph";
window.Alpine = Alpine
Alpine.start()


const app = document.getElementById("app");
const history = new History();

if (!app) throw new Error("App not found");

const drawing = (p: p5) => {
  let graph: Graph;
  let ui: Ui;
  let algorithm: PathFindingAlgorithm;
  let speed: number = 10
  let iterator: Iterator<State>
  let geoJson: any
  p.preload = () => {
    geoJson = p.loadJSON("../public/map.geojson")
  }
  p.setup = () => {
    p.createCanvas(app.clientWidth, app.clientHeight);
    // grid = new Grid(app.clientWidth, app.clientHeight, 20, 50);
    graph = new Country(geoJson, app.clientWidth, app.clientHeight)
    ui = new Ui(p);
    ui.updateSpeed(updateSpeed);
    ui.updateFlag()  // label the selected flag
    ui.updatePlayButton(updatePlay) // contol the play button
    ui.clearBoardButton(clearBoard)
    ui.updateAlgorithm(updateAlgorithm)

    algorithm = Algorithms.algorithms(ui.selectedAlgorithm);
    p.frameRate(speed)
  };
  p.draw = () => {
    p.clear()
    graph.show(p);
    if (p.mouseIsPressed) {
      plantFlag()
    }
    if (iterator) {
      if (graph.start && graph.end) {
        let next = iterator.next();

        if (!next.done) {
          history.saveState(next.value); // Save the state
          next = iterator.next();
        }
      }
    }
  };
  p.windowResized = () => {
    p.resizeCanvas(app.clientWidth, app.clientHeight);
    graph.resize(app.clientWidth, app.clientHeight);
  };
  p.mouseDragged = () => {
    const selected = ui.selectedFlag;
    if (selected === "obstacle") {
      graph.addObstacle(p.mouseX, p.mouseY);
    }
  };
  const plantFlag = () => {
    const selected = ui.selectedFlag;
    if (selected === "obstacle") {
      graph.addObstacle(p.mouseX, p.mouseY);
    } else if (selected === "start") {
      graph.setStart(p.mouseX, p.mouseY);
    } else if (selected === "end") {
      graph.setEnd(p.mouseX, p.mouseY);
    }
  };
  function updateSpeed(value: number) {
    speed = value
    p.frameRate(value)
  }
  function updatePlay() {
    if (graph.start && graph.end) {
      iterator = algorithm.findPath(graph, graph.start, graph.end);
      // grid.clearHighlights() // clear the board first
    }
  }

  function updateAlgorithm(selectedAlgorithm: ALGORITHMS) {
    console.log(selectedAlgorithm)
    algorithm = Algorithms.algorithms(selectedAlgorithm);
  }
  const clearBoard = () => {
    // grid.clearBoard()
  }

}

new p5(drawing, app);
