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
        style: {
          width: 100,
          height: 200,
          'backgroung-color': 'dodgerBlue'
        },
        mapState: {
          user: 'getUser',
          haha: 'getHaha'
        },
        mapDispatch: ['getAction']
      },
      ShelfBoard__C: true
    }
  },
  data: {
    //TODO
    class: ['Board', 'Item'], //TODO
    reducers: ['items', 'shelfBoard', 'userBoard'] //TODO
    // auto generate actionCreators.js
    // auto generate selectors.js
    // auto generate store.js //TODO
  }
}
