define(function (require) {
    var game = require('modules').get('GameApp');

    game.factory('gmBlock', function () {
        var Block = function (color, coordinates) {
            var self = this;

            this.color = color;
            this.coordinates = coordinates;

            this.rotateRight = function () {
                self.coordinates.forEach(function (c) {
                    var tmp = c[0];
                    c[0] = c[1];
                    c[1] = -tmp;
                });
                self._normalizeCoordinates();
                return self;
            };

            this.rotateLeft = function () {
                self.coordinates.forEach(function (c) {
                    var tmp = c[0];
                    c[0] = -c[1];
                    c[1] = tmp;
                });
                self._normalizeCoordinates();
                return self;
            };

            this._normalizeCoordinates = function () {
                var topLeft = [0, 0];
                self.coordinates.forEach(function (c) {
                    topLeft[0] = Math.min(topLeft[0], c[0]);
                    topLeft[1] = Math.min(topLeft[1], c[1]);
                });
                self.coordinates.forEach(function (c) {
                    c[0] -= topLeft[0];
                    c[1] -= topLeft[1];
                });
            };

            this.offsetCoordinates = function (x, y) {
                return self.coordinates.map(function (c) {
                    return [c[0] + x, c[1] + y];
                });
            };

            this.size = function () {
                var max = [0, 0];
                self.coordinates.forEach(function (c) {
                    max[0] = Math.max(max[0], c[0]);
                    max[1] = Math.max(max[1], c[1]);
                });
                max[0]++;
                max[1]++;
                return max;
            };

            this.clone = function () {
                return new Block(color, coordinates.map(function (c) {
                    return [c[0], c[1]];
                }));
            };
        };

        return Block;
    });
});