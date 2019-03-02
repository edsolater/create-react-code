const fs = require('fs')
const template = fs.readFileSync('./template.js')
const config = require('./configs')
const mindMap = require('./mindMap')

const createNewData = (name, { childComponentNames = [], mapState = {} }) => {
  // init newData
  let newData = `${template}`

  // replace $TM_FILENAME_BASE with current fileName
  newData = newData.replace(/\$TM_FILENAME_BASE/gi, `${name}`)

  // import related components
  newData = newData.replace(
    config.placeholder['import related components'],
    config.codeBlockSyntax['import related components'](childComponentNames)
  )

  // use related components
  newData = newData.replace(
    config.placeholder['use related component'],
    config.codeBlockSyntax['use related component'](childComponentNames)
  )

  // set mapState with selector
  // const createMapState = (content) => `<${childName} />\n`
  // const
  // newData = newData.replace(
  //   config.placeholder['set mapState'],
  //   nodeBlock
  // )
  return newData
}

const createFileTree = (partOfTree, currentPath = '.') => {
  for ([name, value] of Object.entries(partOfTree)) {
    if (value.isFile) {
      fs.writeFileSync(`${currentPath}/${name}.js`, createNewData(name, value))
    } else {
      fs.mkdirSync(`${currentPath}/${name}`)
      createFileTree(value, `${currentPath}/${name}`)
    }
  }
}

createFileTree(mindMap)
