/**
 * @description 这个文件用于自定义文档结构
 */
// example:
// module.exports = {
//   miniShop: {
//     UserBoards: {
//       isFile: true,
//       childComponentNames: ['User','TTT']
//     },
//     ShelfBoard: {
//       isFile: true
//     }
//   }
// }
module.exports = {
  components: {
    Parent__C: {
      UserBoards__C: {
        style() {
          return `
              width: 100;
              height: 200;
              background-color: dodgerBlue;
            `
        },
        materialUI: {
          coreMain: 'paper_white', //需要把但个字符串包裹数组以方便解析
          coreMainStyle: `{
              width: 10 * theme.spacing.unit,
              height: 10 * theme.spacing.unit
            }`,
          coreOthers: 'button',
          icons: 'add'
        },
        mapState: {
          user: 'getUser',
          haha: 'getHaha'
        },
        mapDispatch: ['getAction'] //也可以是纯字符串
      },
      ShelfBoard__C: {
        mapState: {
          user: 'getUser',
          haha: 'getHaha'
        }
      },
      Another__C: true
    }
  },
  classes: {
    Board: true,
    Item: true
  },
  redux: {
    reducers: {
      items: true,
      shelfBoard: true,
      userBoard: true
    },
    // auto generate actionCreators.js
    // auto generate selectors.js
    // auto generate store.js
    store: {
      middleware: [{ packageName: 'redux-multi', variableName: 'multi' }],
      initialState: `
        shelfBoards: {
          all: {
            0: new Board({
              type: 'shelfBoard',
              id: '0',
              name: 'S',
              items: []
            }),
            1: new Board({ type: 'shelfBoard', id: '1', name: 'I' }),
            2: new Board({ type: 'shelfBoard', id: '2', name: 'M' }),
            3: new Board({ type: 'shelfBoard', id: '3', name: 'P' }),
            4: new Board({ type: 'shelfBoard', id: '4', name: 'L' }),
            5: new Board({ type: 'shelfBoard', id: '5', name: 'E' }),
            length: 6
          },
          active: {
            type: 'shelfBoard',
            id: '0',
            name: 'S',
            items: []
          }
        },
        userBoards: {
          all: { 0: new Board({ name: 'default userBoard' }), length: 1 },
          active: {}
        },
        menuBoards: {
          all: {
            0: new Board({ type: 'menuBoard', id: 'menu-0000', name: 'shelf-menu' }),
            length: 1
          }
        },
        items: {
          all: {
            0: new Item({
              id: '0',
              title: 'NO.1 Item',
              subtitle: 'first one'
            }),
            length: 1
          }
        }
      `
    }
  },
  asset: {
    // TODO
    media: {}, // TODO
    text: {}, // TODO
    index: {} // TODO
  },
  theme: {
    // TODO
    material_ui: {} // TODO
  }
}
