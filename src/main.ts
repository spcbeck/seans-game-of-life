import './style.css'

import World, { Board, WorldOptions } from './world';


let isGamePaused = false;
let gameSpeed = 100;

const canvas = document.querySelector("#game") as HTMLCanvasElement;

const createBoard = (world: World): Board => {
  let board = world.prepareBoard();

  world.generateRandom();
  
  world.placeCellPattern(10,10,'glider', board);
  world.placeCellPattern(20,10,'beehive', board);

  return board;
}

const getWorldOptions = (): WorldOptions => {
  const width = parseInt((document.getElementById('canvasWidth') as HTMLInputElement).value);
  const height = parseInt((document.getElementById('canvasHeight') as HTMLInputElement).value);
  const tileSize = parseInt((document.getElementById('cellSize') as HTMLInputElement).value);
  const cellColor = (document.getElementById('cellColor') as HTMLInputElement).value;

  return {
    canvas: canvas,
    width: width,
    height: height,
    context: canvas?.getContext("2d") as CanvasRenderingContext2D,
    tileSize: tileSize,
    tilesX: width / tileSize,
    tilesY: height / tileSize,
    fillStyle: cellColor,
    strokeStyle: "rgb(90, 90, 90)",
    lineWidth: .5
  }
}

let worldOptions = getWorldOptions();
let world = new World(worldOptions);
createBoard(world);

const drawAll = () => {
  world.clearBoard();
  world.drawBoard();
  world.drawBorders();
}
const nextStep = () => {
  if (isGamePaused) {
    return;
  }
  drawAll();
  world.stepForward();
}

nextStep();

const theLoop = setInterval(() => {
  nextStep();
  if(!world.isGrowing) {
    clearInterval(theLoop);
  }
}, gameSpeed);

const reset = () => {
  worldOptions = getWorldOptions();
  canvas.height = worldOptions.height;
  canvas.width = worldOptions.width;
  world = new World(worldOptions);
  createBoard(world);
}

(document.getElementById('reset') as HTMLElement).addEventListener('click', () => {
  reset();
})

document.addEventListener("keydown", e => {
  if (e.key === 'p') {
      isGamePaused = !isGamePaused;
  } else if (e.key === "+") {
      gameSpeed = Math.max(50, gameSpeed - 50);
  } else if (e.key === '-') {
      gameSpeed = Math.min(2000, gameSpeed + 50);
  } else if (e.key === 'r') {
      world.board = world.prepareBoard();
      drawAll();
  }
});
