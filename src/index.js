// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const fileSettings = require('./settings/replacingRules')
const fileMap = require('./fileMap')
const { resultFolder, prettierConfig } = require('./settings/env')

const selectorCollection = []
const actionCreatorCollection = []

const create = {
  folder: {
    root() {
      fs.mkdirSync(`./${resultFolder}`)
    },
    reactComponents() {
      fs.mkdirSync(`./${resultFolder}/components`)
    },
    data() {
      fs.mkdirSync(`./${resultFolder}/data`)
    },
    classes() {
      fs.mkdirSync(`./${resultFolder}/data/classes`)
    }
  },
  files: {
    /**
     * @description create file selectors
     */
    reactComponents(partOfTree, currentPath = `./${resultFolder}/components`) {
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
        componentInfo
      ) {
        const componentTemplate = fs.readFileSync(
          './template/reactComponent.js'
        )
        // 利用 ruduce()，应用所有的替换规则
        return fileSettings.component.rules.reduce(
          (resultString, { pattern, replaceFunction, replaceFunctionParams }) =>
            resultString.replace(
              // string.prototype.replace(string, string)
              pattern,
              replaceFunction(
                eval(
                  replaceFunctionParams
                    .map(param =>
                      param === 'componentName'
                        ? 'componentName' // 如果需要传参 componentName ,则不附上前缀
                        : `componentInfo.${param}`
                    )
                    .join(',')
                )
              )
            ),
          `${componentTemplate}`
        )
      }

      for ([componentName, componentInfo] of Object.entries(partOfTree)) {
        const path = `${currentPath}/${componentName}`
        if (componentInfo.isFile) {
          const file = `${path}.js`
          const formattedContent = prettier.format(
            createContent(componentName, componentInfo),
            prettierConfig
          )
          fs.writeFileSync(file, formattedContent)
        } else {
          fs.mkdirSync(path)
          createFileComponents(componentInfo, path)
        }
      }
    },

    /**
     * @description create file selectors
     */
    selector() {
      const file = `./${resultFolder}/data/selectors.js`
      const formattedContent = prettier.format(
        fileSettings.selector.generateContentBy(selectorCollection),
        prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    /**
     * @description create file actionCreators
     */
    actionCreator() {
      const file = `./${resultFolder}/data/actionCreators.js`
      const formattedContent = prettier.format(
        fileSettings.actionCreator.generateContentBy(actionCreatorCollection),
        prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    /**
     * @description create file actionCreators
     */
    classes() {
      // TODO: 逻辑仿照 createFileComponents 的
      function createContent(customedClassName) {
        const customedClassTemplate = fs.readFileSync(
          './template/customedClasses.js'
        )
        // 利用 ruduce()，应用所有的替换规则
        return `${customedClassTemplate}`.replace(
          /\$TM_FILENAME_BASE/gi,
          `${customedClassName}`
        )
      }
      for (customedClassName of fileMap.data.class) {
        const file = `./${resultFolder}/data/class/${customedClassName}`
        const formattedContent = prettier.format(
          createContent(customedClassName),
          prettierConfig
        )
        fs.writeFileSync(file, formattedContent)
      }
    }
  }
}

// create system floder
if (!fs.existsSync(`./${resultFolder}`)) {
  create.folder.root()
  create.folder.reactComponents()
  create.folder.data()
}
// create|cover file
create.files.reactComponents(fileMap.components)
create.files.selector()
create.files.actionCreator()

// // create customedClasses
// if (fileMap.data.class && !fs.existsSync(`./${resultFolder}/data/class`)) {
//   fs.mkdirSync(`./${resultFolder}/data/class`)
//   createFileClass()
// }