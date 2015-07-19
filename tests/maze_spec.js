import { Maze } from '../src/js/maze';
import { Cell } from '../src/js/cell';

describe('Maze class', () => {
  afterEach(() => {
    Cell.all = [];
  });

  it('instantiates properly', () => {
    var maze = new Maze(3, 3);
    expect(maze.width).toEqual(3);
    expect(maze.height).toEqual(3);
  });

  it('calls the _makeEmptyMaze method when instantiated', () => {
    spyOn(Maze.prototype, '_makeEmptyMaze');
    new Maze(3, 3);
    expect(Maze.prototype._makeEmptyMaze).toHaveBeenCalled();
  });

  it('#generateMaze method removes walls', () => {
    var maze = new Maze(2, 2);
    spyOn(Cell, 'removeWallsBetween');
    spyOn(Cell, 'makeAllUnvisited');
    maze.generateMaze();
    expect(Cell.removeWallsBetween).toHaveBeenCalled();
    expect(Cell.makeAllUnvisited).toHaveBeenCalled();
  });

  it('#generateMaze doesn\'t create closed cells', () => {
    var maze = new Maze(2, 2);
    maze.generateMaze();
    var closedCells = Cell.all.filter((cell) => { return cell.walls === [1, 1, 1, 1] });
    expect(closedCells.length).toEqual(0);
  });
});
