// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const fileSettings = require('./settings/replacingRules')
const fileMap = require('./fileMap')
const { resultFolder, prettierConfig } = require('./settings/env')

const selectorCollection = []
const actionCreatorCollection = []

/**
 * @description create file selectors
 */
function createFileComponents(
  partOfTree,
  currentPath = `./${resultFolder}/components`
) {
  const componentTemplate = fs.readFileSync('./template/reactComponent.js')
  /**
   *
   * @param {string} componentName component's name
   * @param {[]} childComponentNames collect childComponents' names
   * @param {{}} mapState  collect props get by redux-selectors
   * @param {} mapDispatch  collect  redux-actionCreator
   */
  function createContent(
    // will be used by eval()
    componentName,
    { childComponentNames = [], mapState = {}, mapDispatch = [] }
  ) {
    // 利用 ruduce()，应用所有的替换规则
    return fileSettings.component.rules.reduce(
      (resultString, { placeholder, replaceFunction, replaceFunctionParams }) =>
        resultString.replace(
          // use replace(string, string)
          placeholder,
          replaceFunction(eval(replaceFunctionParams))
        ),
      `${componentTemplate}`
    )
  }

  for ([key, value] of Object.entries(partOfTree)) {
    const path = `${currentPath}/${key}`
    if (value.isFile) {
      const file = `${path}.js`
      const formattedContent = prettier.format(
        createContent(key, value),
        prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    } else {
      fs.mkdirSync(path)
      createFileComponents(value, path)
    }
  }
}

/**
 * @description create file selectors
 */
function createFileSelectors() {
  const file = `./${resultFolder}/data/selectors.js`
  const formattedContent = prettier.format(
    fileSettings.selector.generateContentBy(selectorCollection),
    prettierConfig
  )
  fs.writeFileSync(file, formattedContent)
}

/**
 * @description create file actionCreators
 */
function createFileActionCreators() {
  const file = `./${resultFolder}/data/actionCreators.js`
  const formattedContent = prettier.format(
    fileSettings.actionCreator.generateContentBy(actionCreatorCollection),
    prettierConfig
  )
  fs.writeFileSync(file, formattedContent)
}

/**
 * @description create file actionCreators
 */
function createFileClass() {
  // TODO: 逻辑仿照 createFileComponents 的
  for (customedClasses of fileMap.data.class) {
    const file = `./${resultFolder}/data/class${customedClasses}`
    const formattedContent = prettier.format(
      fileSettings.actionCreator.generateContentBy(actionCreatorCollection),
      prettierConfig
    )
    fs.writeFileSync(file, formattedContent)
  }
}

// create system floder
if (!fs.existsSync(`./${resultFolder}`)) {
  fs.mkdirSync(`./${resultFolder}`)
  fs.mkdirSync(`./${resultFolder}/components`)
  fs.mkdirSync(`./${resultFolder}/data`)
}
// create system file
createFileComponents(fileMap.components)
createFileSelectors()
createFileActionCreators()

if (fileMap.data.class && !fs.existsSync(`./${resultFolder}/data/class`)) {
  fs.mkdirSync(`./${resultFolder}/data/class`)
  // createFileClass()
}

// create system file
createFileComponents(fileMap.components)
createFileSelectors()
createFileActionCreators()
