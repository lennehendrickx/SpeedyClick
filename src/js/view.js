class GameView {
  constructor(game) {
    this.game = game;
  }

  render() {
    if (!this.gameView) {
      const gameView = DomUtil.createDiv('game');

      const pointsView = new PointsView(this.game.points);
      const dashboardView = new DashboardView();
      dashboardView.add(pointsView.render());
      gameView.appendChild(dashboardView.render());

      this.gameView = gameView;
    }

    return this.gameView;
  }

  start() {
    this.gameView = this.render();
    this.gameViewGrid = ResizingGridFactory.createGrid(this.gameView);

    this.gameView.addEventListener('click', ({clientX, clientY }) => {
      const position = new Position(clientX, clientY);
      const modelShootPosition = this.gameViewGrid.project(position, this.game.grid);
      this.game.shoot(modelShootPosition);
    });

    this.game.onTargetAdded(target => {
      this.addToCanvas(new TargetView(target, this.game.grid, this.gameViewGrid));
    });

    this.game.onTargetsHit((targets, points) => {
      if (targets.length === 0) {
        return;
      }

      const names = targets.map(target => target.name).join(", ");
      alert(`Jeeej, je hebt ${names} geraakt voor ${points} punten.`)
    });

    document.body.appendChild(this.gameView);
  }

  addToCanvas(view) {
    this.gameView.appendChild(view.render());
  }

}

class TargetView extends EventDispatcher {

  constructor(target, gameGrid, gameViewGrid) {
    super();
    this.target = target;
    this.gameGrid = gameGrid;
    this.gameViewGrid = gameViewGrid;
    this.gameViewGrid.onUpdated(() => this.render());
    this.target.onUpdated(() => this.render());
  }

  render() {
    if (!this.targetView) {
      this.targetView = DomUtil.createDiv('target');
    }

    this.targetView.innerText = this.target.name;
    this.targetView.style.backgroundColor = this.target.color;

    const targetSize = new Position(this.target.width, this.target.height);
    const projectedTargetSize = this.gameGrid.project(targetSize, this.gameViewGrid);
    this.targetView.style.width = projectedTargetSize.x + 'px';
    this.targetView.style.height = projectedTargetSize.y + 'px';

    const projectedTargetPosition = this.gameGrid.project(this.target.position, this.gameViewGrid);
    this.targetView.style.left = projectedTargetPosition.x + 'px';
    this.targetView.style.top = projectedTargetPosition.y + 'px';
    return this.targetView;
  }

}

class DashboardView {

  constructor() {
    this.dashboardView = this.render();
  }

  add(element) {
    this.dashboardView.appendChild(element);
  }

  render() {
    if (!this.dashboardView) {
      this.dashboardView = DomUtil.createDiv('dashboard');
    }

    return this.dashboardView;
  }

}

class PointsView {

  constructor(points) {
    this.points = points;
    points.onUpdated(() => this.render());
    this.render();
  }

  render() {
    if (!this.pointsView) {
      this.pointsView = DomUtil.createDiv('total');
    }

    this.pointsView.innerText = this.points.total;
    return this.pointsView;
  }

}

class ResizingGridFactory {
  static createGrid(element) {
    const grid = new Grid(element.clientWidth, element.clientHeight);
    new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      grid.update(width, height);
    }).observe(element);
    return grid;
  }
}
