const fs = require('fs')
const componentTemplate = fs.readFileSync('./template-component.js')
const rule = require('./pattern&replacement')
const mindMap = require('./mindMap')
const src = 'src' // result folder

const selectorCollection = []
const actionCreatorCollection = []

function createComponentContent(
  name,
  { childComponentNames = [], mapState = {}, mapDispatch = [] }
) {
  return `${componentTemplate}`
    .replace(/\$TM_FILENAME_BASE/gi, `${name}`) // replace $TM_FILENAME_BASE with current fileName
    .replace(
      // import related components
      rule.placeholder['import related components'],
      rule.placement['import related components'](childComponentNames)
    )
    .replace(
      // use related components
      rule.placeholder['use related components'],
      rule.placement['use related components'](childComponentNames)
    )
    .replace(
      // import selectors
      rule.placeholder['import selectors'],
      rule.placement['import selectors'](mapState, selectorCollection)
    )
    .replace(
      // set mapState with selectors
      rule.placeholder['set mapState with selectors'],
      rule.placement['set mapState with selectors'](mapState)
    )
    .replace(
      // get mapState Props
      rule.placeholder['get mapState Props'],
      rule.placement['get mapState Props'](mapState)
    )
    .replace(
      // import actionCreators
      rule.placeholder['import actionCreators'],
      rule.placement['import actionCreators'](
        mapDispatch,
        actionCreatorCollection
      )
    )
    .replace(
      // set mapDispatch with actionCreators
      rule.placeholder['set mapDispatch with actionCreators'],
      rule.placement['set mapDispatch with actionCreators'](mapDispatch)
    )
    .replace(
      // get mapDispatch Props
      rule.placeholder['get mapDispatch Props'],
      rule.placement['get mapDispatch Props'](mapDispatch)
    )
}

function createSelectorContent() {
  return rule.selectorFile(selectorCollection)
}

function createActionCreatorContent() {
  return rule.actionCreatorFile(actionCreatorCollection)
}

function createComponents(partOfTree, currentPath = `./${src}/components`) {
  for ([name, value] of Object.entries(partOfTree)) {
    const path = `${currentPath}/${name}`
    if (value.isFile) {
      const file = `${path}.js`
      const content = createComponentContent(name, value)
      fs.writeFileSync(file, content)
    } else {
      fs.mkdirSync(path)
      createComponents(value, path)
    }
  }
}

function createSelectors() {
  const file = `./${src}/data/selectors.js`
  const content = createSelectorContent()
  fs.writeFileSync(file, content)
}

function createActionCreators() {
  const file = `./${src}/data/actionCreators.js`
  const content = createActionCreatorContent()
  fs.writeFileSync(file, content)
}

fs.mkdirSync(`./${src}`)
fs.mkdirSync(`./${src}/components`)
createComponents(mindMap.components)
fs.mkdirSync(`./${src}/data`)
createSelectors()
createActionCreators()
