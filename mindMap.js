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
  miniShop: {
    UserBoards: {
      isFile: true,
      childComponentNames: ['User','TTT'],
      mapState:{
        user:'getUser'
      }
    },
    ShelfBoard: {
      isFile: true
    }
  }
}
