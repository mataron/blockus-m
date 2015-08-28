define(function (require) {
    var game = require('modules').get('GameApp');
    require('scripts/factories/grid');

    var DragManager = function ($document, gmGrid) {
        var self = this;

        this.activelyDragged = {
            sourceBlock: null,
            helperGrid: null,
            helperBlock: null,
            mouseX: 0,
            mouseY: 0
        };
        this.pendingDrag = {
            sourceBlock: null,
            mouseX: 0,
            mouseY: 0
        };

        this.dragStateChangedListeners = [];

        this.setupDragging = function () {
            $document.bind('mouseup', function () {
                self.cancelDrag();
            });
            $document.bind('mousemove', function (event) {
                var hasBlock = self.activelyDragged.sourceBlock !== null || self.pendingDrag.sourceBlock !== null;
                if (!hasBlock || !self.isDragMoveEvent(event)) {
                    return;
                }
                var theBlock = self.activelyDragged.sourceBlock;
                if (!theBlock)
                    theBlock = self.pendingDrag.sourceBlock;
                self.setDragState(theBlock, event.clientX, event.clientY);
            });
        };

        this.hasActiveDrag = function () {
            return self.activelyDragged.sourceBlock !== null;
        };

        this.rotateLeft = function () {
            var block = self.activelyDragged.helperBlock.clone().rotateLeft();
            var size = block.size();
            self.activelyDragged.helperGrid = new gmGrid(size[0], size[1]);
            self.activelyDragged.helperBlock = block.clone();
            self.activelyDragged.helperGrid.setBlockAt(self.activelyDragged.helperBlock, 0, 0);

            self.dragStateChangedListeners.forEach(function (stateChangeListener) {
                stateChangeListener();
            });
        };

        this.rotateRight = function () {
            var block = self.activelyDragged.helperBlock.clone().rotateRight();
            var size = block.size();
            self.activelyDragged.helperGrid = new gmGrid(size[0], size[1]);
            self.activelyDragged.helperBlock = block.clone();
            self.activelyDragged.helperGrid.setBlockAt(self.activelyDragged.helperBlock, 0, 0);

            self.dragStateChangedListeners.forEach(function (stateChangeListener) {
                stateChangeListener();
            });
        };

        this.enableDragging = function (block, mouseX, mouseY) {
            if (self.hasActiveDrag()) {
                self.cancelDrag();
                return;
            }
            self.pendingDrag.sourceBlock = block;
            self.pendingDrag.mouseX = mouseX;
            self.pendingDrag.mouseY = mouseY;
        };

        this.setDragState = function (block, mouseX, mouseY) {
            if (self.activelyDragged.sourceBlock !== block && self.pendingDrag.sourceBlock !== block) {
                self.cancelDrag();
                return;
            }
            self.activelyDragged.sourceBlock = block;
            self.activelyDragged.mouseX = mouseX;
            self.activelyDragged.mouseY = mouseY;

            if (self.activelyDragged.helperGrid === null) {
                var size = block.size();
                self.activelyDragged.helperGrid = new gmGrid(size[0], size[1]);
                self.activelyDragged.helperBlock = block.clone();
                self.activelyDragged.helperGrid.setBlockAt(self.activelyDragged.helperBlock, 0, 0);

                block.grid.getBlockCells(block).forEach(function (cell) {
                    cell.extraClasses.push('gm-dragged');
                });
            }

            self.dragStateChangedListeners.forEach(function (stateChangeListener) {
                stateChangeListener();
            });
        };

        this.cancelDrag = function () {
            if (self.activelyDragged.sourceBlock && self.activelyDragged.sourceBlock.grid) {
                self.activelyDragged.sourceBlock.grid.removeClass('gm-dragged');
            }
            if (self.pendingDrag.sourceBlock && self.pendingDrag.sourceBlock.grid) {
                self.pendingDrag.sourceBlock.grid.removeClass('gm-dragged');
            }

            self.activelyDragged.sourceBlock = null;
            self.activelyDragged.helperGrid = null;
            self.activelyDragged.helperBlock = null;
            self.activelyDragged.mouseX = 0;
            self.activelyDragged.mouseY = 0;
            self.pendingDrag.sourceBlock = null;
            self.pendingDrag.mouseX = 0;
            self.pendingDrag.mouseY = 0;

            self.dragStateChangedListeners.forEach(function (stateChangeListener) {
                stateChangeListener();
            });
        };

        this.isDragInitEvent = function (event) {
            return event.buttons === 1 && event.button === 0;
        };
        this.isDragMoveEvent = function (event) {
            return event.buttons === 1 && event.button === 0;
        };
    };

    var TheDragManager = null;

    game.service('gmDragManager', function ($document, gmGrid) {
        if (!TheDragManager)
            TheDragManager = new DragManager($document, gmGrid);

        return TheDragManager;
    });
});
