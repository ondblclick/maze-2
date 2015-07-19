export class Step  {
  constructor(start, end, totalSteps, parentStep) {
    this.x = start.x;
    this.y = start.y;
    this.totalSteps = totalSteps;
    this.heuristic = this._distance(start, end);
    this.f = totalSteps + this.heuristic;
    this.parent = parentStep;
  }

  _distance(start, end) {
    var dx = Math.abs(end.x - start.x);
    var dy = Math.abs(end.y - start.y);
    return dx + dy;
  }
}
