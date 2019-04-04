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
      mapState: {
        hello: 'selector1',
        hei: 'selector2'
      },
      UserBoards__C: {
        type: 'tab', //TODO: tab friendly template
        wrapperType: 'section',
        materialUI: {
          coreMain: 'paper_white', //需要把但个字符串包裹数组以方便解析
          coreMainStyle: `
            width: 10 * theme.spacing.unit,
            height: 10 * theme.spacing.unit
          `,
          coreOthers: 'button',
          icons: 'add'
        },
        style: {
          width: 100,
          height: 200,
          'background-color': 'dodgerBlue'
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
      Another__C: true,
    }
  },
  functions: {
    classes: ['Board', 'Item'],
    reducers: ['items', 'shelfBoard', 'userBoard'], //TODO: 先做了 redux-reducers 才能做 redux-store
    // auto generate actionCreators.js
    // auto generate selectors.js
    middleware:[{packageName:'redux-multi', variableName:'multi'}],
    // auto generate store.js 
    store:`
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
      }`
  }
}
