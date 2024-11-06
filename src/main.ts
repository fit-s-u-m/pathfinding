import p5 from "p5";
import { Grid } from "./util/grid";
import { Ui } from "./handleUi";
import { ALGORITHMS, SELECT } from "./type";
import { Algorithms, PathFindingAlgorithm } from "./util/pathFindingAlgorithms";
import { History } from "./util/history";

const app = document.getElementById("app");
const history = new History();

if (!app) throw new Error("App not found");

const drawing = (p: p5) => {
  let grid: Grid;
  let ui: Ui;
  let algorithm: PathFindingAlgorithm;
  let speed: number = 500
  p.setup = () => {
    p.createCanvas(app.clientWidth, app.clientHeight);
    grid = new Grid(app.clientWidth, app.clientHeight, 100);
    ui = new Ui(p);
    ui.updateSpeed((value: number) => { speed = value });
    ui.updateFlag()  // label the selected flag
    ui.updatePlayButton(runAlgorithm) // contol the play button
    ui.clearBoardButton(clearBoard)
    ui.updateAlgorithm(updateAlgorithm)

    algorithm = Algorithms.algorithms(ui.selectedAlgorithm);
  };
  p.draw = () => {
    p.background(255);
    grid.showGrid(p);
    if (p.mouseIsPressed) {
      plantFlag()
    }
  };
  p.windowResized = () => {
    p.resizeCanvas(app.clientWidth, app.clientHeight);
    grid.resize(app.clientWidth, app.clientHeight);
  };
  p.mouseDragged = () => {
    const selected = ui.selectedFlag;
    if (selected === "obstacle") {
      grid.addObstacle(p.mouseX, p.mouseY);
    }
  };
  const plantFlag = () => {
    const selected = ui.selectedFlag;
    if (selected === "obstacle") {
      grid.addObstacle(p.mouseX, p.mouseY);
    } else if (selected === "start") {
      grid.setStart(p.mouseX, p.mouseY);
    } else if (selected === "end") {
      grid.setEnd(p.mouseX, p.mouseY);
    }
  };
  const updateAlgorithm = (selectedAlgorithm: ALGORITHMS) => {
    algorithm = Algorithms.algorithms(selectedAlgorithm);
    if (grid.start && grid.end) {
      const path = algorithm.findPath(grid, grid.start, grid.end);
      console.log(path);
    }
  }
  const clearBoard = () => {
    grid.clearBoard()
  }

}

new p5(drawing, app);
