"use strict";
var state = {
    mapState: [
        [-1, -1, 1, 1, 1, -1, -1],
        [-1, -1, 1, 1, 1, -1, -1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [-1, -1, 1, 1, 1, -1, -1],
        [-1, -1, 1, 1, 1, -1, -1],
    ],
    domMap: [],
    activeItemXY: null,
};
function init() {
    var body = document.getElementsByTagName('body').item(0);
    if (!body) {
        return;
    }
    body.appendChild(initMap());
}
function initMap() {
    var map = document.createElement('div');
    map.classList.add('map');
    state.mapState.forEach(function (line, x) {
        state.domMap.push([]);
        var lineDom = document.createElement('div');
        lineDom.classList.add('line');
        line.forEach(function (v, y) {
            var itemDom = document.createElement('div');
            itemDom.classList.add('item');
            if (v === -1) {
                itemDom.classList.add('invalid-item');
            }
            else {
                itemDom.addEventListener('click', function (e) {
                    console.log(state);
                    console.log("click: [" + x + ", " + y + "]");
                    if (state.mapState[x][y] === 1) {
                        if (state.activeItemXY && state.activeItemXY.x === x && state.activeItemXY.y === y) {
                            itemDom.classList.remove('active-item');
                            state.activeItemXY = null;
                        }
                        else {
                            itemDom.classList.add('active-item');
                            state.activeItemXY = { x: x, y: y };
                        }
                    }
                    else {
                        if (state.activeItemXY) {
                            if (state.activeItemXY.x === x) {
                                if (state.activeItemXY.y === y - 2 && state.mapState[x][y - 1] === 1) {
                                    state.mapState[x][y] = 1;
                                    state.mapState[x][y - 1] = 0;
                                    state.mapState[x][y - 2] = 0;
                                    state.domMap[x][y].appendChild(newPiece());
                                    removeChild(x, y - 1);
                                    removeChild(x, y - 2);
                                    clearActiveItem();
                                    return;
                                }
                                else if (state.activeItemXY.y === y + 2 && state.mapState[x][y + 1] === 1) {
                                    state.mapState[x][y] = 1;
                                    state.mapState[x][y + 1] = 0;
                                    state.mapState[x][y + 2] = 0;
                                    state.domMap[x][y].appendChild(newPiece());
                                    removeChild(x, y + 1);
                                    removeChild(x, y + 2);
                                    clearActiveItem();
                                    return;
                                }
                            }
                            if (state.activeItemXY.y === y) {
                                if (state.activeItemXY.x === x - 2 && state.mapState[x - 1][y] === 1) {
                                    state.mapState[x][y] = 1;
                                    state.mapState[x - 1][y] = 0;
                                    state.mapState[x - 2][y] = 0;
                                    state.domMap[x][y].appendChild(newPiece());
                                    removeChild(x - 1, y);
                                    removeChild(x - 2, y);
                                    clearActiveItem();
                                    return;
                                }
                                else if (state.activeItemXY.x === x + 2 && state.mapState[x + 1][y] === 1) {
                                    state.mapState[x][y] = 1;
                                    state.mapState[x + 1][y] = 0;
                                    state.mapState[x + 2][y] = 0;
                                    state.domMap[x][y].appendChild(newPiece());
                                    removeChild(x + 1, y);
                                    removeChild(x + 2, y);
                                    clearActiveItem();
                                    return;
                                }
                            }
                        }
                    }
                });
            }
            if (v === 1) {
                itemDom.appendChild(newPiece());
            }
            state.domMap[x].push(itemDom);
            lineDom.appendChild(itemDom);
        });
        map.appendChild(lineDom);
    });
    return map;
}
function newPiece() {
    var piece = document.createElement('div');
    piece.classList.add('piece');
    return piece;
}
function removeChild(x, y) {
    var dom = state.domMap[x][y];
    if (dom.firstChild) {
        dom.removeChild(dom.firstChild);
    }
}
function clearActiveItem() {
    if (state.activeItemXY) {
        var dom = state.domMap[state.activeItemXY.x][state.activeItemXY.y];
        dom.classList.remove('active-item');
        state.activeItemXY = null;
    }
}
// Start up
init();
