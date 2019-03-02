const fs = require('fs')
const template = fs.readFileSync('./template.js')
const rule = require('./rules')
const mindMap = require('./mindMap')

const createContent = (
  name,
  { childComponentNames = [], mapState = {}, mapDispatch = {} }
) => {
  return `${template}`
    .replace(/\$TM_FILENAME_BASE/gi, `${name}`) // replace $TM_FILENAME_BASE with current fileName
    .replace(
      // import related components
      rule.placeholder['import related components'],
      rule.codeBlockSyntax['import related components'](childComponentNames)
    )
    .replace(
      // use related components
      rule.placeholder['use related component'],
      rule.codeBlockSyntax['use related component'](childComponentNames)
    )
    .replace(
      // set mapState with selectors
      rule.placeholder['set mapState with selectors'],
      rule.codeBlockSyntax['set mapState with selectors'](mapState)
    )
    .replace(
      // get mapState Props
      rule.placeholder['get mapState Props'],
      rule.codeBlockSyntax['get mapState Props'](mapState)
    )
    // .replace(
    //   // export component
    //   rule.placeholder['export component'],
    //   rule.codeBlockSyntax['export component'](name, mapState, mapDispatch)
    // )
}

const createFiles = (partOfTree, currentPath = '.') => {
  for ([name, value] of Object.entries(partOfTree)) {
    if (value.isFile) {
      fs.writeFileSync(`${currentPath}/${name}.js`, createContent(name, value))
    } else {
      fs.mkdirSync(`${currentPath}/${name}`)
      createFiles(value, `${currentPath}/${name}`)
    }
  }
}

createFiles(mindMap)
