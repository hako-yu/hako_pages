"use strict";
var originalMap = [
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
];
var state = {
    mapState: originalMap.map(function (line) { return line.map(function (v) {
        var dom = document.createElement('div');
        dom.classList.add('item');
        if (v === 1) {
            dom.appendChild(newPiece());
        }
        if (v === -1) {
            dom.classList.add('invalid-item');
        }
        return { v: v, dom: dom };
    }); }),
    activeItemXY: null,
    history: [originalMap],
};
function newPiece() {
    var piece = document.createElement('div');
    piece.classList.add('piece');
    return piece;
}
function render(nextMapValue) {
    var isDifferent = false;
    nextMapValue.forEach(function (line, x) {
        line.forEach(function (v, y) {
            if (v !== state.mapState[x][y].v) {
                isDifferent = true;
                var itemDom = state.mapState[x][y].dom;
                if (v === 0) {
                    if (itemDom.firstChild)
                        itemDom.removeChild(itemDom.firstChild);
                }
                if (v === 1) {
                    itemDom.appendChild(newPiece());
                }
                state.mapState[x][y].v = v;
            }
        });
    });
    return isDifferent;
}
function clearActiveItem() {
    if (state.activeItemXY) {
        var dom = state.mapState[state.activeItemXY.x][state.activeItemXY.y].dom;
        dom.classList.remove('active-item');
        state.activeItemXY = null;
    }
}
function onClickItem(x, y) {
    return function () {
        var item = state.mapState[x][y];
        var itemDom = item.dom;
        if (item.v === 1) {
            if (state.activeItemXY && state.activeItemXY.x === x && state.activeItemXY.y === y) {
                clearActiveItem();
            }
            else {
                clearActiveItem();
                itemDom.classList.add('active-item');
                state.activeItemXY = { x: x, y: y };
            }
        }
        else if (item.v === 0) {
            if (state.activeItemXY) {
                if ((state.activeItemXY.x === x && (state.activeItemXY.y === y - 2 || state.activeItemXY.y === y + 2)) ||
                    (state.activeItemXY.y === y && (state.activeItemXY.x === x - 2 || state.activeItemXY.x === x + 2))) {
                    if (state.mapState[(x + state.activeItemXY.x) / 2][(y + state.activeItemXY.y) / 2].v === 1) {
                        var nextMapValue = state.mapState.map(function (line) { return line.map(function (item) { return item.v; }); });
                        nextMapValue[x][y] = 1;
                        nextMapValue[(x + state.activeItemXY.x) / 2][(y + state.activeItemXY.y) / 2] = 0;
                        nextMapValue[state.activeItemXY.x][state.activeItemXY.y] = 0;
                        clearActiveItem();
                        if (render(nextMapValue)) {
                            state.history.push(nextMapValue);
                        }
                        ;
                    }
                }
            }
        }
    };
}
function initMap() {
    var map = document.createElement('div');
    map.classList.add('map');
    state.mapState.forEach(function (line, x) {
        var lineDom = document.createElement('div');
        lineDom.classList.add('line');
        line.forEach(function (item, y) {
            item.dom.addEventListener('click', onClickItem(x, y));
            lineDom.appendChild(item.dom);
        });
        map.appendChild(lineDom);
    });
    return map;
}
function onRollBack(n) {
    var end = state.history.length - n;
    end = end < 1 ? 1 : end;
    state.history = state.history.slice(0, end);
    clearActiveItem();
    render(state.history[state.history.length - 1]);
}
function init() {
    var body = document.getElementsByTagName('body').item(0);
    if (!body) {
        return;
    }
    body.appendChild(initMap());
    var backButton = document.createElement('button');
    backButton.innerText = 'Back';
    backButton.addEventListener('click', function () { return onRollBack(1); });
    body.appendChild(backButton);
    var resetButton = document.createElement('button');
    resetButton.innerText = 'Reset';
    resetButton.addEventListener('click', function () { return onRollBack(state.history.length - 1); });
    body.appendChild(resetButton);
}
// Start up
init();
