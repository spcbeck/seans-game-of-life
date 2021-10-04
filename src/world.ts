import Cell from './cell';

export interface WorldOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    tileSize: number;
    tilesX: number;
    tilesY: number;
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
}

export type Board = Cell[][]; 

// type PatternType = 'still-life' | 'oscillator' | 'spaceship';

// type PatternName = string;

interface Pattern {
    [key: string]: [number, number][]
}

// enum PatternTypes {
//     'still-life',
//     'oscillator',
//     'spaceship',
// }

const PATTERNS: Pattern = {
    'block': [[0,0],[0,1],[1,1],[1,0]],
    'beehive': [[1,0],[2,0],[0,1],[3,1],[1,2],[2,2]],
    'loaf': [],
    'boat': [],
    'tub': [],
    'blinker': [[0,0], [1,0], [2,0]],
    'toad': [[1,0], [2,0], [3,0], [0,1], [1,1], [2,1]],
    'beacon': [[0,0],[0,1],[1,1],[1,0], [2,2], [3,2], [3,3], [2,3]],
    'pulsar': [],
    'penta-decathlon': [],
    'glider': [[1,0], [2,1], [0,2], [1,2], [2,2]],
    'lwss': [],
    'mwss': [],
    'hwss': [],
};

export default class World {
    board: Board = [];
    tilesX: number = 800;
    tilesY: number = 800;
    width: number = 800;
    height: number = 800;
    ctx: CanvasRenderingContext2D | null = null;
    tileSize: number = 10;
    isGrowing: boolean = true;

    constructor(worldOptions: WorldOptions) {
        console.log(worldOptions);
        this.tilesX = worldOptions.tilesX;
        this.tilesY = worldOptions.tilesY;
        this.ctx = worldOptions.context;
        this.tileSize = worldOptions.tileSize;
        this.width = worldOptions.width;
        this.height = worldOptions.height;

        this.ctx.fillStyle = worldOptions.fillStyle;
        this.ctx.strokeStyle = worldOptions.strokeStyle;
        this.ctx.lineWidth = worldOptions.lineWidth;
    }

    clearBoard = () => {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBoard = () => {
        if(!this.ctx) return;

        for(let i = 0; i < this.tilesX; i++) {
            for(let j = 0; j < this.tilesY; j++) {
                if (this.hasLiveCell(i, j, this.board)) {
                    this.ctx.fillRect(i * this.tileSize, j * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }

    drawBorders = () => {
        if(!this.ctx) return;
        
        for(let i = 0; i < this.tilesX; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize - 0.5, 0);
            this.ctx.lineTo(i * this.tileSize - 0.5, this.height);
            this.ctx.stroke();
        }
    
        for(let j = 0; j < this.tilesY; j++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, j * this.tileSize - 0.5);
            this.ctx.lineTo(this.width, j * this.tileSize - 0.5);
            this.ctx.stroke();
        }
    }

    stepForward = () => {
        let changed = 0;

        for(let i = 0; i < this.tilesX; i++) {
            for(let j = 0; j < this.tilesY; j++) {
                const liveNeighbors = this.liveNeighbors(i, j, this.board);
                this.board[i][j].neighborsCount = liveNeighbors;
            }
        }

        for(let i = 0; i < this.tilesX; i++) {
            for(let j = 0; j < this.tilesY; j++) {
                const cell = this.board[i][j];

                if(!cell.alive && cell.neighborsCount === 3) {
                    cell.alive = true;
                    changed++;
                } else if (cell.neighborsCount < 2 || cell.neighborsCount > 3) {
                    cell.alive = false;
                    changed++
                }
            }
        }

        if(changed === 0) {
            this.isGrowing = false;
        }
    }

    generateRandom = () => {
        for(let i = 0; i < this.tilesX; i++) {
            for(let j = 0; j < this.tilesY; j++) {
                if (Math.random() < .1) this.board[i][j].alive = true;
            }
        }
    }

    placeCellPattern(x: number, y: number, name: string, board: Board): Board {
        const pattern = PATTERNS[name];

        for (const pos of pattern) {
            const xPos = x + pos[0];
            const yPos = y + pos[1];

            board[xPos][yPos].alive = true;
        }

        return board;
    }

    private hasLiveCell = (x: number, y: number, board: Board): boolean => {
        if (x < 0 || x >= this.tilesX || y < 0 || y >= this.tilesY ||  board.length <= 0) {
            return false;
        }

        return board[x][y]?.alive || false;
    }

    private liveNeighbors = (x: number, y: number, board: Board): number => {
        let count = 0;

        for(let i of [-1, 0, 1]) {
            for(let j of [-1, 0, 1]) {
                if (!(i === 0 && j === 0) && this.hasLiveCell(x + i, y + j, board)) {
                    count++;
                }
            }
        }

        return count;
    }

    prepareBoard = (): Board => {        
        for(let i = 0; i < this.tilesX; i++) {
            const row = [];
            for(let j = 0; j < this.tilesY; j++) {
                row.push(new Cell({ alive: false }));
            }
            this.board.push(row);
        }

        return this.board;
    }
}