const fs = require('fs')
const data = fs.readFileSync('./template.js')

const createFolder = (name, currentPath) => {
  fs.mkdirSync(`${currentPath}/${name}`)
}
const createFile = (name, value, currentPath) => {
  const newData = `${data}`.replace(/FileName/gi, `${name}`)
  fs.writeFileSync(`${currentPath}/${name}.js`, newData)
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
      createTree(value, `${currentPath}/${name}`)
    }
  }
}

async function main() {
  const fileTree = createObjectTreeMap()
  createTree(fileTree)
}
main()
