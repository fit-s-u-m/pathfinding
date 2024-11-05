import p5 from "p5";
import { Grid } from "./util/grid";
import { Ui } from "./handleUi";
import { SELECT } from "./type";
import { Algorithms, PathFindingAlgorithm } from "./util/pathFindingAlgorithms";

const app = document.getElementById("app");
if (!app) throw new Error("App not found");

const drawing = (p: p5) => {
  let grid: Grid;
  let ui: Ui;
  let algorithm: PathFindingAlgorithm;
  p.setup = () => {
    p.createCanvas(app.clientWidth, app.clientHeight);
    grid = new Grid(app.clientWidth, app.clientHeight, 100);
    ui = new Ui(p);
    ui.updateCellSize((size: string) => grid.setCellSize(parseInt(size)));
    algorithm = Algorithms.algorithms(ui.select?.selected());
  };
  p.draw = () => {
    p.background(255);
    grid.showGrid(p);
    ui.algorithm?.changed(() => {
      console.log("selected");
      algorithm = Algorithms.algorithms(ui.algorithm.selected());
      if (grid.start && grid.end) {
        console.log("trying to find path");
        const path = algorithm.findPath(grid, grid.start, grid.end);
        console.log(path);
      }
    });
  };
  p.windowResized = () => {
    p.resizeCanvas(app.clientWidth, app.clientHeight);
    grid.resize(app.clientWidth, app.clientHeight);
  };
  p.mouseDragged = () => {
    const selected = ui.select?.selected() as SELECT;
    if (selected === "Obstacle") {
      grid.addObstacle(p.mouseX, p.mouseY);
    }
  };
  p.mousePressed = () => {
    const selected = ui.select?.selected() as SELECT;
    if (selected === "Obstacle") {
      grid.addObstacle(p.mouseX, p.mouseY);
    } else if (selected === "Start") {
      grid.setStart(p.mouseX, p.mouseY);
    } else {
      grid.setEnd(p.mouseX, p.mouseY);
    }
  };
};

new p5(drawing, app);
