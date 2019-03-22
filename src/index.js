// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const fileSettings = require('./settings/replacingRules')
const fileMap = require('./fileMap')
const { resultFolder, prettierConfig } = require('./settings/env')

const selectorCollection = []
const actionCreatorCollection = []

function createFileComponents(partOfTree, currentPath = `./${resultFolder}/components`) {
  const componentTemplate = fs.readFileSync('./template/reactComponent.js')
  /**
   *
   * @param {string} name component's name
   * @param {[]} childComponentNames collect childComponents' names
   * @param {{}} mapState  collect props get by redux-selectors
   * @param {} mapDispatch  collect  redux-actionCreator
   */
  function createContent(
    name,
    // will be used by eval()
    { childComponentNames = [], mapState = {}, mapDispatch = [] }
  ) {
    let unformattedContent = `${componentTemplate}`.replace(
      /\$TM_FILENAME_BASE/gi,
      `${name}`
    )
    // 对内容应用设定的替换规则
    for ({ placeholder, replaceFunction, replaceFunctionParams } of fileSettings.component
      .rules) {
      unformattedContent = unformattedContent.replace(
        // use replace(string, string)
        placeholder,
        replaceFunction(eval(replaceFunctionParams))
      )
    }
    return unformattedContent
  }

  for ([name, value] of Object.entries(partOfTree)) {
    const path = `${currentPath}/${name}`
    if (value.isFile) {
      const file = `${path}.js`
      const formattedContent = prettier.format(createContent(name, value), prettierConfig)
      fs.writeFileSync(file, formattedContent)
    } else {
      fs.mkdirSync(path)
      createFileComponents(value, path)
    }
  }
}

function createFileSelectors() {
  const file = `./${resultFolder}/data/selectors.js`
  const formattedContent = prettier.format(
    fileSettings.selector.generateContentBy(selectorCollection),
    prettierConfig
  )
  fs.writeFileSync(file, formattedContent)
}

function createFileActionCreators() {
  const file = `./${resultFolder}/data/actionCreators.js`
  const formattedContent = prettier.format(
    fileSettings.actionCreator.generateContentBy(actionCreatorCollection),
    prettierConfig
  )
  fs.writeFileSync(file, formattedContent)
}

fs.mkdirSync(`./${resultFolder}`)
fs.mkdirSync(`./${resultFolder}/components`)
fs.mkdirSync(`./${resultFolder}/data`)
createFileComponents(fileMap.components)
createFileSelectors()
createFileActionCreators()
