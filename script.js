const fs = require('fs')
const data = require('./template')
console.log('data: ', data)
const setting = {
  space: 2
}

const createFolder = (name, currentPath) => {
  fs.mkdirSync(`${currentPath}/${name}`)
}
const createFile = (name, value, currentPath) => {
  fs.writeFileSync(`${currentPath}/${name}.js`, 'hello')
}

const createObjectTreeMap = (source = [''], level = 0) => {
  return {
    miniShop: {
      UserBoards: {
        isFile: true
      },
      ShelfBoard: {
        isFile: true
      }
    }
  }
}
const createTree = (partOfTree, currentPath = '.') => {
  for ([name, value] of Object.entries(partOfTree)) {
    if (value.isFile) {
      createFile(name, value, currentPath)
    } else {
      createFolder(name, currentPath)
      createTree(value, currentPath)
    }
  }
}

async function main() {
  const fileTree = createObjectTreeMap()
  createTree(fileTree)
}
main()
