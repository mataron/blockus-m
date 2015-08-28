define(function (require) {
    var game = require('modules').get('GameApp');
    require('scripts/services/dragmng');

    game.directive('gmDragHelper', function (gmDragManager) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/grid.html',
            scope: {},
            controller: function ($scope) {
                $scope.clazz = 'gm-drag-help-off';

                $scope.onMouseOver = function () {
                };
            },
            link: function ($scope, $element) {
                gmDragManager.dragStateChangedListeners.push(function () {
                    $scope.$apply(function () {
                        if (gmDragManager.activelyDragged.sourceBlock === null) {
                            $scope.clazz = 'gm-drag-help-off';
                            return;
                        }
                        $scope.grid = gmDragManager.activelyDragged.helperGrid;
                        $scope.clazz = 'gm-drag-help-on';
                        $element[0].style.left = (gmDragManager.activelyDragged.mouseX + 2) + 'px';
                        $element[0].style.top = (gmDragManager.activelyDragged.mouseY + 2) + 'px';
                        $element[0].style.width = ($scope.grid.columns() * 25) + 'px';
                        $element[0].style.height = ($scope.grid.rows() * 25) + 'px';
                    });
                });
            }
        };
    });
});