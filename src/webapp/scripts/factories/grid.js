define(function (require) {
    var game = require('modules').get('GameApp');

    game.factory('gmGrid', function () {
        return function (rows, columns) {
            var self = this;

            this.cells = [];
            this.lastRemovedBlock = null;

            var i, j;
            for (i = 0; i < rows; ++i) {
                var row = [];
                for (j = 0; j < columns; ++j) {
                    row.push({
                        x: i,
                        y: j,
                        extraClasses: [],
                        block: null,
                        grid: self
                    });
                }
                self.cells.push(row);
            }

            this.rows = function () {
                return self.cells.length;
            };

            this.columns = function () {
                return self.cells[0].length;
            };

            this.setBlockAt = function (block, x, y) {
                block.coordinates.forEach(function (offsets) {
                    self.cells[x + offsets[0]][y + offsets[1]].block = block;
                });
                block.x = x;
                block.y = y;
                block.grid = self;
            };

            this.removeBlock = function (block) {
                block.coordinates.forEach(function (offsets) {
                    self.cells[block.x + offsets[0]][block.y + offsets[1]].block = null;
                });
                block.grid = null;
                self.lastRemovedBlock = block;
            };

            this.removeClass = function (clazz) {
                self.cells.forEach(function (row) {
                    row.forEach(function (cell) {
                        var idx = cell.extraClasses.indexOf(clazz);
                        if (idx >= 0)
                            cell.extraClasses.splice(idx, 1);
                    });
                });
            };

            this.getBlockCells = function (block, x, y) {
                if (typeof x === 'undefined') {
                    x = block.x;
                    y = block.y;
                }
                return block.coordinates.map(function (coordinates) {
                    var _x = coordinates[0] + x;
                    var _y = coordinates[1] + y;
                    return self._withinBounds(_x, _y) ? self.cells[_x][_y] : null;
                }).filter(function (cell) {
                    return typeof cell === 'object' && cell !== null;
                });
            };

            this.fullCells = function () {
                var count = 0;
                self.cells.forEach(function (row) {
                    row.forEach(function (cell) {
                        if (cell.block)
                            count++;
                    });
                });
                return count;
            };

            this._withinBounds = function (x, y) {
                return x >= 0 && x < self.rows() && y >= 0 && y < self.columns();
            };
        };
    });
});