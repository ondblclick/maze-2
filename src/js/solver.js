import _ from 'underscore';
import $ from 'jquery';
import { Cell } from './cell';
import { Step } from './step';

export class Solver {
  constructor() {
    this.closed = [];
    this.open = [];
    this.step = 0;
    this.maxSearhDistance = 10;
  }

  _addOpen(step) {
    this.open.push(step);
  }

  _removeOpen(step) {
    for (var i = 0; i < this.open.length; i++) {
      if (this.open[i] === step) {
        this.open.splice(i, 1);
      }
    }
  }

  _isOpen(step) {
    for (var i = 0; i < this.open.length; i++) {
      if (this.open[i].x === step.x && this.open[i].y === step.y) {
        return this.open[i];
      }
    }
    return false;
  }

  _getBestOpen() {
    var bestIndex = 0;
    for (var i = 0; i < this.open.length; i++) {
      if (this.open[i].f < this.open[bestIndex].f) bestIndex = i;
    }
    return this.open[bestIndex];
  }

  _addClosed(step) {
    this.closed.push(step);
  }

  _isClosed(cell) {
    for (var i = 0; i < this.closed.length; i++) {
      if (this.closed[i].x === cell.x && this.closed[i].y === cell.y) {
        return this.closed[i];
      }
    }
    return false;
  }

  _buildPath(step, array) {
    array.push(step);
    if (step.parent) {
      return this._buildPath(step.parent, array);
    } else {
      return array;
    }
  }

  findPath(start, end, maxSteps) {
    var current;
    var neighbors;
    var neighborRecord;
    var stepCost;

    // You must add the starting step
    // this.reset()
    this._addOpen(new Step(start, end, this.step, false));

    while (this.open.length !== 0) {
      current = this._getBestOpen();

      // Check if goal has been discovered to build a path
      if (current.x === end.x && current.y === end.y) {
        return this._buildPath(current, []);
      }

      // Move current into closed set
      this._removeOpen(current);
      this._addClosed(current);

      // Get neighbors from the map and check them
      neighbors = Cell.findBy(current.x, current.y).nonBlockedNeighbors();

      for (var i = 0; i < neighbors.length; i++) {
        stepCost = current.totalSteps + 1;

        // Check for the neighbor in the closed set
        // then see if its cost is >= the stepCost, if so skip current neighbor

        neighborRecord = this._isClosed(neighbors[i]);
        if (neighborRecord && stepCost >= neighborRecord.totalSteps) continue;

        // Verify neighbor doesn't exist or new score for it is better
        neighborRecord = this._isOpen(neighbors[i]);
        if (!neighborRecord || stepCost < neighborRecord.totalSteps) {
          if (!neighborRecord) {
            this._addOpen(new Step(neighbors[i], end, stepCost, current));
          } else {
            neighborRecord.parent = current;
            neighborRecord.totalSteps = stepCost;
            neighborRecord.f = stepCost + neighborRecord.heuristic;
          }
        }
      }
    }
  }

  render(cells) {
    $('#maze tbody td.path').removeClass('path');
    _.each(cells, (cell) => {
      $("#maze tbody td#" + cell.x + "-" + cell.y + "").addClass('path')
    });
  }
}
