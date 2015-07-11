import _ from 'underscore';

export class Cell {
  constructor(y, x) {
    this.x = x;
    this.y = y;
    this.isVisited = false;
    this.walls = [1, 1, 1, 1];
    Cell.addToCollection(this);
  }

  neighbors() {
    var neighbors = [];
    neighbors.push(Cell.findBy(this.x + 1, this.y))
    neighbors.push(Cell.findBy(this.x - 1, this.y))
    neighbors.push(Cell.findBy(this.x, this.y + 1))
    neighbors.push(Cell.findBy(this.x, this.y - 1))
    return _.filter(_.compact(neighbors), (cell) => {
      return !cell.isVisited;
    });
  }

  nonBlockedNeighbors() {
    var neighbors = [];
    _.map(this.neighbors(), (cell) => {
      if (this.pathIsClearTo(cell)) {
        neighbors.push(cell);
      }
    });
    return _.compact(neighbors);
  }

  pathIsClearTo(cell) {
    var firstCell = cell;
    var lastCell = this;
    if (firstCell.x < lastCell.x || firstCell.y < lastCell.y) {
      [lastCell, firstCell] = [firstCell, lastCell];
    }
    if (firstCell.x > lastCell.x) {
      if (firstCell.walls[3] === 0 && lastCell.walls[1] === 0) return true;
    }
    if (firstCell.y > lastCell.y) {
      if (firstCell.walls[0] === 0 && lastCell.walls[2] === 0) return true;
    }
    return false;
  }

  pickRandomNeighbor() {
    return this.neighbors()[Math.floor(Math.random() * this.neighbors().length)]
  }

  static makeAllUnvisited() {
    _.each(this.all, (cell) => {
      cell.isVisited = false;
    });
  }

  static visited() {
    return _.filter(this.all, (cell) => {
      return cell.isVisited;
    });
  }

  static findBy(x, y) {
    return _.find(this.all, (cell) => {
      return cell.x === parseInt(x, 10) && cell.y === parseInt(y, 10);
    });
  }

  static addToCollection(cell) {
    if (this.all === undefined) {
      this.all = [cell];
    } else {
      this.all.push(cell);
    }
  }

  static removeWallsBetween(firstCell, lastCell) {
    if (firstCell.x > lastCell.x || firstCell.y > lastCell.y) {
      [lastCell, firstCell] = [firstCell, lastCell];
    }
    if (firstCell.x < lastCell.x) {
      firstCell.walls[1] = 0;
      lastCell.walls[3] = 0;
    }
    if (firstCell.y < lastCell.y) {
      firstCell.walls[2] = 0;
      lastCell.walls[0] = 0;
    }
  }
}
