define(function (require) {
    var game = require('modules').get('GameApp');

    var AllPlayerColors = ['red', 'green', 'blue', 'yellow'];


    var GameState = function (playerCount) {
        var self = this;

        this.gameEnded = false;
        this.playerColors = AllPlayerColors.slice(0, playerCount);
        this.activePlayerIndex = 0;

        this.turnChangedListener = [];

        this.activePlayerColor = function () {
            return self.playerColors[self.activePlayerIndex];
        };

        this.advanceTurn = function (gameEnded) {
            self.gameEnded = gameEnded;
            self.activePlayerIndex++;
            self.activePlayerIndex %= playerCount;

            self.turnChangedListener.forEach(function (turnListener) {
                turnListener();
            });
        };
    };

    var TheGameState = null;

    game.service('gmGameState', function () {
        if (!TheGameState)
            TheGameState = new GameState(2);

        return TheGameState;
    });
});
