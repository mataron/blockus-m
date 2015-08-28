define(function (require) {
    var angular = require('angular');
    var modules = require('modules');

    var game = modules.get('GameApp', []);

    game.init = function () {
        angular.bootstrap(document, ['GameApp']);
    };

    require('scripts/directives/board');
    require('scripts/directives/pool');
    require('scripts/directives/draghelper');
    require('scripts/services/dragmng');
    require('scripts/services/game');

    game.controller('gmGameInit', function ($scope, $document, gmDragManager, gmGameState) {
        $document.bind('contextmenu', function (event) {
            //TODO: event.preventDefault();
        });

        $document.bind('keydown', function (event) {
            if (!gmDragManager.hasActiveDrag())
                return;
            if (event.keyCode === 37)
                gmDragManager.rotateLeft();
            if (event.keyCode === 39)
                gmDragManager.rotateRight();
        });

        gmDragManager.setupDragging();

        $scope.playerColors = gmGameState.playerColors;

        $scope.forfeit = function () {
            gmGameState.gameEnded = true;
        };
    });
    return game;
});
