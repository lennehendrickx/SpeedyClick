class Game extends EventDispatcher {
  constructor() {
    super();
    this.targets = [];
    this.points = new Points();
    this.grid = new Grid(1000, 1000);
  }

  shoot(position) {
    const targetsHit = this.targets
      .filter(target => target.isHit(position));
    const pointsHit = targetsHit
      .reduce((points, target) => {
        return points += target.points;
      }, 0);
    this.dispatch('targetsHit', targetsHit, pointsHit);
    this.points.add(pointsHit);
  }

  onTargetsHit(listener) {
    this.addListener('targetsHit', listener);
  }

  addTarget(target) {
    this.targets.push(target);
    this.dispatch('targetAdded', target);
    this.moveRandomly(target);
  }

  onTargetAdded(listener) {
    this.addListener('targetAdded', listener);
  }

  moveRandomly(target) {
    const moveTargetToRandomPosition = () => {
      this.moveToRandomPosition(target);
      requestAnimationFrame(moveTargetToRandomPosition);
    };
    requestAnimationFrame(moveTargetToRandomPosition);
  }

  moveToRandomPosition(target) {
    const x = Math.random() * (this.grid.width - target.width);
    const y = Math.random() * (this.grid.height - target.height);
    target.move(new Position(x, y));
  }
}

class Points extends EventDispatcher {

  constructor() {
    super();
    this.total = 0;
  }

  add(points) {
    this.total += points;
    this.dispatch('updated', points);
  }

  onUpdated(listener) {
    this.addListener('updated', listener);
  }

}

class Target extends EventDispatcher {
  constructor(name, points, color, width, height) {
    super();
    this.name = name;
    this.points = points;
    this.color = color;
    this.width = width;
    this.height = height;
    this.position = new Position(0, 0);
  }

  isHit(position) {
    return position.x >= this.position.x
      && position.x <= this.position.x + this.width
      && position.y >= this.position.y
      && position.y <= this.position.y + this.height;
  }

  move(position) {
    this.position = position;
    this.dispatch('updated', this);
  }

  onUpdated(listener) {
    this.addListener('updated', listener);
  }

}

class Grid extends EventDispatcher {

  constructor(width, height) {
    super();
    this.update(width, height);
  }

  project(position, grid) {
    return new Position(
      position.x / this.width * grid.width,
      position.y / this.height * grid.height
    );
  }

  update(width, height) {
    this.width = width;
    this.height = height;
    this.dispatch('updated', width, height);
  }

  onUpdated(listener) {
    this.addListener('updated', listener);
  }

}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
