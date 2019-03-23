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
    UserBoards: {
      type: 'tab', //TODO: tab friendly template
      isFile: true, //TODO: 这是冗余的信息，最终得去掉
      childComponentNames: ['User', 'TTT'],
      mapState: {
        user: 'getUser',
        haha: 'getHaha'
      },
      mapDispatch: ['getAction'],
      wrapper: 'section', //TODO
      style: {
        //TODO
        width: 100,
        height: 200
      }
    },
    ShelfBoard: {
      isFile: true
    }
  },
  data: {
    //TODO
    class: ['Board', 'Item'], //TODO
    reducers: ['items', 'shelfBoard', 'userBoard'], //TODO
    // auto generate actionCreators.js
    // auto generate selectors.js
    // auto generate store.js //TODO
  }
}
