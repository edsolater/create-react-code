const fs = require('fs')
const prettier = require('prettier')
const rule = require('./configs/replacingRule')
const fileMap = require('./custom/fileMap')

const src = 'src' // result folder
const prettierConfig = {
  parser: 'babel', // empty warnings
  arrowParens: 'always',
  semi: false,
  singleQuote: true
}

const selectorCollection = []
const actionCreatorCollection = []

function createComponents(partOfTree, currentPath = `./${src}/components`) {
  const componentTemplate = fs.readFileSync('./template/component.js')
  function createContent(
    name,
    { childComponentNames = [], mapState = {}, mapDispatch = [] }
  ) {
    return prettier.format(
      `${componentTemplate}`
        .replace(/\$TM_FILENAME_BASE/gi, `${name}`) // replace $TM_FILENAME_BASE with current fileName
        .replace(
          // import related components
          rule.component.placeholder['import related components'],
          rule.component.placement['import related components'](childComponentNames)
        )
        .replace(
          // use related components
          rule.component.placeholder['use related components'],
          rule.component.placement['use related components'](childComponentNames)
        )
        .replace(
          // import selectors
          rule.component.placeholder['import selectors'],
          rule.component.placement['import selectors'](mapState, selectorCollection)
        )
        .replace(
          // set mapState with selectors
          rule.component.placeholder['set mapState with selectors'],
          rule.component.placement['set mapState with selectors'](mapState)
        )
        .replace(
          // get mapState Props
          rule.component.placeholder['get mapState Props'],
          rule.component.placement['get mapState Props'](mapState)
        )
        .replace(
          // import actionCreators
          rule.component.placeholder['import actionCreators'],
          rule.component.placement['import actionCreators'](
            mapDispatch,
            actionCreatorCollection
          )
        )
        .replace(
          // set mapDispatch with actionCreators
          rule.component.placeholder['set mapDispatch with actionCreators'],
          rule.component.placement['set mapDispatch with actionCreators'](mapDispatch)
        )
        .replace(
          // get mapDispatch Props
          rule.component.placeholder['get mapDispatch Props'],
          rule.component.placement['get mapDispatch Props'](mapDispatch)
        ),
      prettierConfig
    )
  }
  for ([name, value] of Object.entries(partOfTree)) {
    const path = `${currentPath}/${name}`
    if (value.isFile) {
      const file = `${path}.js`
      const content = createContent(name, value)
      fs.writeFileSync(file, content)
    } else {
      fs.mkdirSync(path)
      createComponents(value, path)
    }
  }
}

function createSelectors() {
  function createContent() {
    return prettier.format(
      rule.selector.generateContentBy(selectorCollection),
      prettierConfig
    )
  }
  const file = `./${src}/data/selectors.js`
  const content = createContent()
  fs.writeFileSync(file, content)
}

function createActionCreators() {
  function createContent() {
    return prettier.format(
      rule.actionCreator.generateContentBy(actionCreatorCollection),
      prettierConfig
    )
  }
  const file = `./${src}/data/actionCreators.js`
  const content = createContent()
  fs.writeFileSync(file, content)
}

fs.mkdirSync(`./${src}`)
fs.mkdirSync(`./${src}/components`)
fs.mkdirSync(`./${src}/data`)
createComponents(fileMap.components)
createSelectors()
createActionCreators()
