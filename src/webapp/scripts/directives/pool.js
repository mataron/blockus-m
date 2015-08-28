define(function (require) {
    var game = require('modules').get('GameApp');
    require('scripts/factories/block');
    require('scripts/factories/grid');
    require('scripts/directives/draggable');
    require('scripts/services/game');

    game.directive('gmPool', function (gmGrid, gmBlock, gmGameState) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/pool.html',
            scope: {
                color: '@'
            },
            controller: function ($scope) {
                $scope.state = gmGameState;
                $scope.grid = new gmGrid(12, 23);
                $scope.clazz = 'gm-pool';
                $scope.draggable = true;
                $scope.activePlayerPool = gmGameState.activePlayerColor() === $scope.color;

                gmGameState.turnChangedListener.push(function () {
                    $scope.activePlayerPool = gmGameState.activePlayerColor() === $scope.color;
                });

                $scope.score = function () {
                    var cells = $scope.grid.fullCells();
                    var bonus = 0;
                    if (cells === 0 && $scope.grid.lastRemovedBlock) {
                        if ($scope.grid.lastRemovedBlock.coordinates.length === 1)
                            bonus = 20;
                        else
                            bonus = 15;
                    }
                    return bonus - cells;
                };

                /* row 1 */
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0]]), 0, 3);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [0, 1]]), 0, 7);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [0, 1], [1, 1]]), 0, 11);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [0, 1], [0, 2]]), 0, 15);
                /* row 2 */
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [0, 1], [1, 1], [1, 0]]), 2, 0);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [1, 0], [1, 1], [1, 2]]), 2, 4);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [0, 1], [0, 2], [0, 3]]), 3, 9);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 2], [1, 0], [1, 1], [1, 2]]), 2, 15);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [0, 2], [1, 0], [1, 1]]), 2, 20);
                /* row 3 */
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3]]), 6, 0);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2]]), 5, 5);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]]), 5, 9);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [0, 2], [0, 3], [1, 0], [1, 1]]), 6, 13);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0]]), 5, 18);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]), 5, 22);
                /* row 4 */
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [1, 0], [1, 1], [2, 0], [2, 1]]), 9, 0);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [0, 2], [1, 0], [1, 1], [2, 0]]), 9, 3);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 0], [0, 1], [1, 0], [2, 0], [2, 1]]), 9, 7);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]]), 9, 11);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]), 9, 15);
                $scope.grid.setBlockAt(new gmBlock($scope.color, [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3]]), 10, 19);
            }
        };
    });
});