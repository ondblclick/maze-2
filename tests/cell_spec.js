import { Cell } from '../src/js/cell';

describe('Cell class', () => {
  afterEach(() => {
    Cell.all = [];
  });

  it('instantiates properly', () => {
    var cell = new Cell(1, 1);
    expect(cell.x).toEqual(1);
    expect(cell.y).toEqual(1);
    expect(cell.isVisited).toEqual(false);
    expect(Cell.all).toEqual([cell]);
  });

  describe('instance method', () => {
    it('#neighbors works properly', () => {
      var cell = new Cell(1, 1);
      var cell2 = new Cell(1, 2);
      var cell3 = new Cell(2, 1);
      var cell4 = new Cell(2, 2);
      cell3.isVisited = true;
      expect(cell.neighbors().length).toEqual(1);
      expect(cell.neighbors()).toEqual([cell2]);
    });

    it('#nonBlockedNeighbors works properly', () => {
      var cell = new Cell(10, 10);
      spyOn(cell, 'pathIsClearTo').and.callThrough();
      cell.walls = [0, 0, 0, 0];
      var cell2 = new Cell(10, 11);
      cell2.walls = [0, 0, 0, 0];
      var cell3 = new Cell(11, 10);
      expect(cell.nonBlockedNeighbors()).toEqual([cell2]);
      expect(cell.pathIsClearTo).toHaveBeenCalled();
    });

    it('#pickRandomNeighbor works properly', () => {
      var cell = new Cell(1, 1);
      spyOn(cell, 'neighbors').and.callThrough();
      var cell2 = new Cell(1, 2);
      var cell3 = new Cell(2, 1);
      expect(cell.pickRandomNeighbor()).toBeDefined();
      expect(cell.neighbors).toHaveBeenCalled();
    });

    it('#pathIsClearTo works properly', () => {
      var cell = new Cell(1, 1);
      cell.walls = [1, 0, 0, 1];
      var cell2 = new Cell(1, 2);
      cell2.walls = [1, 1, 1, 0];
      var cell3 = new Cell(2, 1);
      cell3.walls = [1, 0, 0, 0];
      expect(cell.pathIsClearTo(cell2)).toEqual(true);
      expect(cell.pathIsClearTo(cell3)).toEqual(false);
    });
  });

  describe('static method', () => {
    it('#addToCollection is called while instantiating', () => {
      spyOn(Cell, 'addToCollection');
      new Cell(1, 2);
      expect(Cell.addToCollection).toHaveBeenCalled();
    });

    it('#findBy is called when instance method neighbors is called', () => {
      spyOn(Cell, 'findBy');
      new Cell(1, 2).neighbors();
      expect(Cell.findBy).toHaveBeenCalled();
      expect(Cell.findBy.calls.count()).toEqual(4);
    });

    it('#visited works properly', () => {
      var cell1 = new Cell(1, 1);
      var cell2 = new Cell(1, 2);
      cell1.isVisited = true;
      expect(Cell.visited()).toEqual([cell1]);
    });

    it('#findBy works properly', () => {
      var cell1 = new Cell(1, 1);
      expect(Cell.findBy(1, 1)).toEqual(cell1);
    });

    it('#makeAllUnvisited works properly', () => {
      var cell1 = new Cell(1, 1);
      var cell2 = new Cell(1, 2);
      cell1.isVisited = true;
      cell2.isVisited = true;
      Cell.makeAllUnvisited();
      expect(Cell.visited()).toEqual([]);
    });

    it('#removeWallsBetween works properly', () => {
      var cell1 = new Cell(1, 1);
      var cell2 = new Cell(1, 2);
      Cell.removeWallsBetween(cell1, cell2);
      expect(cell1.walls).toEqual([1, 0, 1, 1]);
      expect(cell2.walls).toEqual([1, 1, 1, 0]);
    });
  });
});
