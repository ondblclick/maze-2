import { Step } from '../src/js/step';

describe('Step class', () => {
  var parentStep = {};
  var step = {};

  beforeEach(() => {
    parentStep = new Step({ x: 1, y: 1 }, { x: 1, y: 2 }, 0);
    step = new Step({ x: 1, y: 2 }, { x: 1, y: 3 }, 1, parentStep);
  });

  it('created properly', () => {
    expect(step.x).toEqual(1);
    expect(step.y).toEqual(2);
    expect(step.totalSteps).toEqual(1);
    expect(step.heuristic).toEqual(1);
    expect(step.f).toEqual(2);
    expect(step.parent).toEqual(parentStep);
  });

  it('calls the _distance method when instantiated', () => {
    spyOn(Step.prototype, '_distance');
    new Step({ x: 1, y: 1 }, { x: 1, y: 2 }, 0);
    expect(Step.prototype._distance).toHaveBeenCalled();
  });
});
