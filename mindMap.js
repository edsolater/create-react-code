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
      type: 'tab',//TODO: tab friendly template
      isFile: true,
      childComponentNames: ['User', 'TTT'],
      mapState: {
        user: 'getUser',
        haha: 'getHaha'
      },
      mapDispatch: ['getAction']
    },
    ShelfBoard: {
      isFile: true
    }
  },
  data: {
    //TODO
    class: {
      //TODO
      Board: { isFile: true }, //TODO
      Item: { isFile: true } //TODO
    }, //TODO
    reducers: {
      //TODO
      items: { isFile: true }, //TODO
      shelfBoards: { isFile: true }, //TODO
      userBoards: { isFile: true } //TODO
    }, //TODO
    // auto generate actionCreators
    // auto generate selectors
    store: { isFile: true } //TODO
  }
}
