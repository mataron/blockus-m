define(function (require) {
    var game = require('modules').get('GameApp');
    require('scripts/factories/block');
    require('scripts/factories/grid');
    require('scripts/services/dragmng');
    require('scripts/services/game');

    var BoardRows = 20;
    var BoardColumns = 20;

    var Board = function (gmGrid) {
        var self = new gmGrid(BoardRows, BoardColumns);

        self.isValidPosition = function (block, x, y) {
            var valid = true;
            var offsetCoordinates = block.offsetCoordinates(x, y);
            offsetCoordinates.forEach(function (offsets) {
                valid = valid && self._withinBounds(offsets[0], offsets[1]);
                if (valid) valid = valid && self.cells[offsets[0]][offsets[1]].block === null;
            });
            if (!valid)
                return false;
            if (!self._hasColorAtCorner(block.color)) {
                valid = self._containsCornerPosition(offsetCoordinates);
            } else {
                valid = !self._edgeTouchColor(block.color, offsetCoordinates) && self._cornerTouchColor(block.color, offsetCoordinates);
            }
            return valid;
        };

        self._hasColorAtCorner = function (color) {
            return self._hasColorAt(color, 0, 0) ||
                self._hasColorAt(color, 0, BoardColumns - 1) ||
                self._hasColorAt(color, BoardRows - 1, 0) ||
                self._hasColorAt(color, BoardRows - 1, BoardColumns - 1);
        };

        self._edgeTouchColor = function (color, coordinates) {
            for (var i = 0; i < coordinates.length; ++i) {
                var x = coordinates[i][0];
                var y = coordinates[i][1];
                if (self._hasColorAt(color, x + 1, y) ||
                    self._hasColorAt(color, x - 1, y) ||
                    self._hasColorAt(color, x, y + 1) ||
                    self._hasColorAt(color, x, y - 1))
                    return true;
            }
            return false;
        };

        self._cornerTouchColor = function (color, coordinates) {
            for (var i = 0; i < coordinates.length; ++i) {
                var x = coordinates[i][0];
                var y = coordinates[i][1];
                if (self._hasColorAt(color, x + 1, y + 1) ||
                    self._hasColorAt(color, x - 1, y + 1) ||
                    self._hasColorAt(color, x + 1, y - 1) ||
                    self._hasColorAt(color, x - 1, y - 1))
                    return true;
            }
            return false;
        };

        self._containsCornerPosition = function (coordinates) {
            for (var i = 0; i < coordinates.length; ++i) {
                if ((coordinates[i][0] === 0 || coordinates[i][0] === BoardRows - 1) &&
                    (coordinates[i][1] === 0 || coordinates[i][1] === BoardColumns - 1))
                    return true;
            }
            return false;
        };

        self._hasColorAt = function (color, x, y) {
            return self._withinBounds(x, y) && self.cells[x][y].block && self.cells[x][y].block.color === color;
        };

        self.place = function (block, x, y) {
            if (!self.isValidPosition(block, x, y))
                return false;

            self.setBlockAt(block, x, y);
            return true;
        };

        return self;
    };

    game.directive('gmBoard', function (gmBlock, gmGrid, gmDragManager, gmGameState) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/grid.html',
            scope: {},
            controller: function ($scope) {
                $scope.grid = new Board(gmGrid);
                $scope.clazz = 'gm-board';

                function removeHighlightClasses() {
                    $scope.grid.removeClass('gm-highlight-error');
                    $scope.grid.removeClass('gm-cell-red-highlight-ok');
                    $scope.grid.removeClass('gm-cell-green-highlight-ok');
                    $scope.grid.removeClass('gm-cell-blue-highlight-ok');
                    $scope.grid.removeClass('gm-cell-yellow-highlight-ok');
                }

                function refreshCellHighlighting(cell) {
                    removeHighlightClasses();

                    var block = gmDragManager.activelyDragged.helperBlock;
                    var validPosition = $scope.grid.isValidPosition(block, cell.x, cell.y);

                    var className = 'gm-cell-' + block.color + '-highlight-ok';
                    if (!validPosition)
                        className = 'gm-highlight-error';
                    $scope.grid.getBlockCells(block, cell.x, cell.y).forEach(function (cell) {
                        cell.extraClasses.push(className);
                    });
                }

                var lastActiveCell = null;

                gmDragManager.dragStateChangedListeners.push(function () {
                    if (gmDragManager.hasActiveDrag()) {
                        if (lastActiveCell) {
                            refreshCellHighlighting(lastActiveCell);
                        }
                        return;
                    }
                    removeHighlightClasses();
                });

                $scope.onMouseOver = function (cell) {
                    if (!gmDragManager.hasActiveDrag()) {
                        return;
                    }
                    refreshCellHighlighting(cell);
                    lastActiveCell = cell;
                };

                $scope.onMouseUp = function (cell) {
                    lastActiveCell = null;
                    if (!gmDragManager.hasActiveDrag()) {
                        return;
                    }

                    var helperBlock = gmDragManager.activelyDragged.helperBlock;
                    if ($scope.grid.place(helperBlock.clone(), cell.x, cell.y)) {
                        var sourceBlock = gmDragManager.activelyDragged.sourceBlock;
                        var pool = sourceBlock.grid;
                        pool.removeBlock(sourceBlock);

                        gmGameState.advanceTurn(pool.fullCells()===0);
                    }
                };
            }
        };
    });
});
