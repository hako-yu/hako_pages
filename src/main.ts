type T_item = {
  v: number,
  dom: HTMLDivElement,
};

type T_mapValue = number[][];

type T_state = {
  mapState: T_item[][],
  activeItemXY: {x: number, y: number} | null,

  history: Array<T_mapValue>,
};

const originalMap = [
  [-1,-1, 1, 1, 1,-1,-1],
  [-1,-1, 1, 1, 1,-1,-1],
  [ 1, 1, 1, 1, 1, 1, 1],
  [ 1, 1, 1, 0, 1, 1, 1],
  [ 1, 1, 1, 1, 1, 1, 1],
  [-1,-1, 1, 1, 1,-1,-1],
  [-1,-1, 1, 1, 1,-1,-1],
];

const state: T_state = {
  mapState: originalMap.map(line => line.map(v => {
    const dom = document.createElement('div');
    dom.classList.add('item');
    if (v === 1) {
      dom.appendChild(newPiece());
    }
    if (v === -1) {
      dom.classList.add('invalid-item');
    }
    return { v, dom };
  })),

  activeItemXY: null,

  history: [originalMap],
}

function newPiece() {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  return piece;
}

function render(nextMapValue: T_mapValue): boolean {
  let isDifferent = false;
  nextMapValue.forEach((line, x) => {
    line.forEach((v, y) => {
      if (v !== state.mapState[x][y].v) {
        isDifferent = true;
        const itemDom = state.mapState[x][y].dom;
        if (v === 0) {
          if (itemDom.firstChild) itemDom.removeChild(itemDom.firstChild);
        }
        if (v === 1) {
          itemDom.appendChild(newPiece());
        }
        state.mapState[x][y].v = v;
      }
    })
  })

  return isDifferent;
}

function clearActiveItem() {
  if (state.activeItemXY) {
    const dom = state.mapState[state.activeItemXY.x][state.activeItemXY.y].dom;
    dom.classList.remove('active-item');
    state.activeItemXY = null;
  }
}

function onClickItem(x: number, y: number) {
  return () => {
    const item = state.mapState[x][y];
    const itemDom = item.dom;

    if (item.v === 1) {
      if (state.activeItemXY && state.activeItemXY.x === x && state.activeItemXY.y === y) {
        clearActiveItem();
      } else {
        clearActiveItem();
        itemDom.classList.add('active-item');
        state.activeItemXY = {x, y};
      }
    } else if (item.v === 0) {

      if (state.activeItemXY) {
        if (
          (state.activeItemXY.x === x && (state.activeItemXY.y === y-2 || state.activeItemXY.y === y+2)) ||
          (state.activeItemXY.y === y && (state.activeItemXY.x === x-2 || state.activeItemXY.x === x+2))
        ) {
          if (state.mapState[(x + state.activeItemXY.x) / 2][(y + state.activeItemXY.y) / 2].v === 1) {
            const nextMapValue = state.mapState.map(line => line.map(item => item.v));
            nextMapValue[x][y] = 1;
            nextMapValue[(x + state.activeItemXY.x) / 2][(y + state.activeItemXY.y) / 2] = 0;
            nextMapValue[state.activeItemXY.x][state.activeItemXY.y] = 0;

            clearActiveItem();
            if (render(nextMapValue)) {
              state.history.push(nextMapValue);
            };
          }
        }

      }

    }
  };
}

function initMap() {
  const map = document.createElement('div');
  map.classList.add('map');
  
  state.mapState.forEach((line, x) => {
    const lineDom = document.createElement('div');
    lineDom.classList.add('line');

    line.forEach((item, y) => {
      item.dom.addEventListener('click', onClickItem(x, y));
      lineDom.appendChild(item.dom);
    });

    map.appendChild(lineDom);
  });


  return map;
}

function onRollBack(n: number) {
  let end = state.history.length - n;
  end = end < 1 ? 1 : end;
  state.history = state.history.slice(0, end);

  clearActiveItem();
  render(state.history[state.history.length - 1]);
}

function init() {
  const body = document.getElementsByTagName('body').item(0);
  if (!body) {
    return;
  }

  body.appendChild(initMap());

  const backButton = document.createElement('button');
  backButton.innerText = 'Back';
  backButton.addEventListener('click', () => onRollBack(1));
  body.appendChild(backButton);

  const resetButton = document.createElement('button');
  resetButton.innerText = 'Reset';
  resetButton.addEventListener('click', () => onRollBack(state.history.length - 1));
  body.appendChild(resetButton);
}

// Start up
init();