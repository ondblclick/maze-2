import _ from 'underscore';
import $ from 'jquery';
import { Cell } from './cell';

export class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._makeEmptyMaze();
  }

  _makeEmptyMaze() {
    Cell.all = undefined;
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        new Cell(row, col);
      }
    }
  }

  generateMaze() {
    var currentCell = this._findStartPosition();
    currentCell.isVisited = true;
    var path = [currentCell];
    var nextCell;

    while(Cell.visited().length < Cell.all.length) {
      if(currentCell.neighbors().length) {
        nextCell = currentCell.pickRandomNeighbor();
        Cell.removeWallsBetween(currentCell, nextCell);
        currentCell = nextCell;
        currentCell.isVisited = true;
        path.push(currentCell);
      } else {
        currentCell = path.pop();
      }
    }

    // to be able to use same cells in solver
    Cell.makeAllUnvisited();
  }

  _findStartPosition() {
    return Cell.findBy(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height))
  }

  render() {
    $('#maze tbody').empty()
    for (var i = 0; i < this.height; i++) {
      $('#maze > tbody').append("<tr>");
      for (var j = 0; j < this.width; j++) {
        var tableCell = $(`<td id='${j + "-" + i}'>`)
        $('#maze > tbody').append(tableCell);
        if (Cell.findBy(j, i).walls[0] == 1) { tableCell.css('border-top-color', 'black'); }
        if (Cell.findBy(j, i).walls[1] == 1) { tableCell.css('border-right-color', 'black'); }
        if (Cell.findBy(j, i).walls[2] == 1) { tableCell.css('border-bottom-color', 'black'); }
        if (Cell.findBy(j, i).walls[3] == 1) { tableCell.css('border-left-color', 'black'); }
      }
      $('#maze > tbody').append("</tr>");
    }
  }
}
