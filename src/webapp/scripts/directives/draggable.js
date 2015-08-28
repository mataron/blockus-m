define(function (require) {
    var game = require('modules').get('GameApp');
    require('scripts/services/dragmng');
    require('scripts/services/game');

    game.directive('gmDraggable', function (gmDragManager, gmGameState) {
        return {
            restrict: 'A',
            scope: {
                gmCell: '='
            },
            link: function ($scope, $element) {
                $element.bind('mousedown', function (event) {
                    if ($scope.gmCell.block === null || !gmDragManager.isDragInitEvent(event)) {
                        gmDragManager.cancelDrag();
                        return;
                    }
                    if (gmGameState.activePlayerColor() !== $scope.gmCell.block.color) {
                        gmDragManager.cancelDrag();
                        return;
                    }
                    if (gmDragManager.hasActiveDrag()) {
                        gmDragManager.cancelDrag();
                        return;
                    }
                    gmDragManager.enableDragging($scope.gmCell.block, event.clientX, event.clientY);
                });
            }
        };
    });
});