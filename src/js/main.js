const game = new Game();
new GameView(game).start();
game.addTarget(new Target('Ell', 300,'green', 60, 138));
game.addTarget(new Target('Bas', 400,'blue', 50, 120));
game.addTarget(new Target('Suz', 500,'yellow', 30, 80));
game.addTarget(new Target('Mam', 200,'pink', 78, 170));
game.addTarget(new Target('Pap', 100,'black', 90, 187));

