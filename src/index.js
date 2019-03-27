// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const replacingRules = require('./settings/replacingRules')
const appStructure = require('./appStructure')
const {
  setting_outputFolderName,
  setting_prettierConfig
} = require('./settings/envSetting')

const collaction_selectorName = []
const collection_actionCreatorName = []

const create = {
  folder: {
    root() {
      fs.mkdirSync(`./${setting_outputFolderName}`)
    },
    reactComponents() {
      fs.mkdirSync(`./${setting_outputFolderName}/components`)
    },
    data() {
      fs.mkdirSync(`./${setting_outputFolderName}/data`)
    },
    classes() {
      fs.mkdirSync(`./${setting_outputFolderName}/data/classes`)
    }
  },
  files: {
    /**
     * @description create file selectors
     */
    reactComponents(
      partOfTree,
      currentPath = `./${setting_outputFolderName}/components`
    ) {
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
        componentValue
      ) {
        const componentTemplate = fs.readFileSync('./template/reactComponent.js')
        return replacingRules.component.rules.reduce(
          (contentString, { pattern, replaceFunction, replaceFunctionParams }) => {
            // const collection_paramString = replaceFunctionParams.map(param =>
            //   param === 'componentName'
            //     ? 'componentName' // 如果需要传参 componentName ,则不附上前缀
            //     : `componentValue.${param}`
            // )
            // try {
            //   return contentString.replace(
            //     pattern,
            //     replaceFunction(eval(collection_paramString.join(',')))
            //   )
            // } catch (e) {
            //   console.error("the param isn't exist")
            // }
            return contentString.replace(
              // string.prototype.replace(string, string)
              pattern,
              replaceFunction(
                eval(
                  replaceFunctionParams
                    .map(param =>
                      param === 'componentName'
                        ? 'componentName' // 如果需要传参 componentName ,则不附上前缀
                        : `componentValue.${param}`
                    )
                    .join(',')
                )
              )
            )
          },
          `${componentTemplate}`
        )
      }

      for (let [componentName, componentValue] of Object.entries(partOfTree)) {
        // 预处理：删去组件的标识性前缀 & 智能提取子组件的名字
        componentName = componentName.replace('__C', '')
        const childComponents = Object.entries(componentValue).filter(([key, value]) =>
          key.endsWith('__C')
        )
        componentValue.childComponentNames = childComponents.map(
          ([componentName, componentValue]) => componentName.replace('__C', '')
        )

        // 写入文件
        const file = `${currentPath}/${componentName}.js`
        const formattedContent = prettier.format(
          createContent(componentName, componentValue),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)

        // 递归地创造子组件
        if (childComponents.length) {
          childComponents.forEach(([componentName, componentValue]) =>
            create.files.reactComponents({ [componentName]: componentValue })
          )
        }
      }
    },

    /**
     * @description create file selectors
     */
    selector() {
      const file = `./${setting_outputFolderName}/data/selectors.js`
      const formattedContent = prettier.format(
        replacingRules.selector.generateContentBy(collaction_selectorName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    /**
     * @description create file actionCreators
     */
    actionCreator() {
      const file = `./${setting_outputFolderName}/data/actionCreators.js`
      const formattedContent = prettier.format(
        replacingRules.actionCreator.generateContentBy(collection_actionCreatorName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    /**
     * @description create file actionCreators
     */
    classes() {
      // TODO: 逻辑仿照 createFileComponents 的
      function createContent(customedClassName) {
        const customedClassTemplate = fs.readFileSync('./template/customedClasses.js')
        // 利用 ruduce()，应用所有的替换规则
        return `${customedClassTemplate}`.replace(
          /\$TM_FILENAME_BASE/gi,
          `${customedClassName}`
        )
      }
      for (customedClassName of appStructure.data.class) {
        const file = `./${setting_outputFolderName}/data/class/${customedClassName}`
        const formattedContent = prettier.format(
          createContent(customedClassName),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)
      }
    }
  }
}

// create system floder
if (!fs.existsSync(`./${setting_outputFolderName}`)) {
  create.folder.root()
  create.folder.reactComponents()
  create.folder.data()
}
// create|cover file
create.files.reactComponents(appStructure.components)
create.files.selector()
create.files.actionCreator()

// // create customedClasses
// if (appStructure.data.class && !fs.existsSync(`./${resultFolder}/data/class`)) {
//   fs.mkdirSync(`./${resultFolder}/data/class`)
//   createFileClass()
// }
