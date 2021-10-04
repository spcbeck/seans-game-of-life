interface CellOptions {
    type?: string;
    alive?: boolean;
}

export default class Cell {
    type: string;
    alive: boolean;
    neighborsCount: number = 0;

    constructor(options?: CellOptions) {
        this.type = options?.type || 'Normal';
        this.alive = options?.alive || false;
    }
}