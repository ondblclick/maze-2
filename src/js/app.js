import { Maze } from './maze';
import { Solver } from './solver';
import { Cell } from './cell';
import $ from 'jquery';

var maze;
var width;
var height;
var checkPoint = 'start';

$(document).on('click', '#maze td', (e) => {
  checkPoint = checkPoint === 'start' ? 'end' : 'start';
  $('#maze td').removeClass(checkPoint);
  $(e.currentTarget).addClass(checkPoint);

  if ($('#maze td.start').length && $('#maze td.end').length) {
    solveMaze();
  }
});

var solveMaze = () => {
  var startCell = Cell.findBy(...$('.start').attr('id').split('-'));
  var endCell = Cell.findBy(...$('.end').attr('id').split('-'));
  var solver = new Solver();
  var path = solver.findPath(startCell, endCell);
  solver.render(path);
};

window.generateAndDrawMaze = () => {
  width = $('#width').val();
  height = $('#height').val();
  maze = new Maze(width, height);
  maze.generateMaze();
  maze.render();
};

generateAndDrawMaze();
