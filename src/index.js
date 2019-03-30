// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const contentRule = require('./contentRule')
const appStructure = require('./appStructure')
const { setting_outputFolderName, setting_prettierConfig } = require('./envSetting')

const collection_selectorName = ['hello']
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
    reactComponents(partOfTree, currentPath = `./${setting_outputFolderName}/components`) {
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
        componentProperties
      ) {
        const componentTemplate = fs.readFileSync('./template/reactComponent.js')
        return contentRule.reactComponent.reduce(
          (contentString, { pattern, replaceFunction, parameters }) =>
            contentString.replace(
              // string.prototype.replace(string, string)
              pattern,
              replaceFunction(...parameters.map(param => eval(param)))
            ),
          `${componentTemplate}`
        )
      }

      for (let [componentName, componentProperties] of Object.entries(partOfTree)) {
        // 预处理：删去组件的标识性前缀 & 智能提取子组件的名字
        componentName = componentName.replace('__C', '')
        const childComponents = Object.entries(componentProperties).filter(([key, value]) =>
          key.endsWith('__C')
        )
        componentProperties.childComponentNames = childComponents.map(
          ([componentName, componentProperties]) => componentName.replace('__C', '')
        )

        // 写入文件
        const file = `${currentPath}/${componentName}.js`
        const formattedContent = prettier.format(
          createContent(componentName, componentProperties),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)

        // 递归地创造子组件
        if (childComponents.length) {
          childComponents.forEach(([componentName, componentProperties]) =>
            create.files.reactComponents({ [componentName]: componentProperties })
          )
        }
      }
    },

    selector() {
      const file = `./${setting_outputFolderName}/data/selectors.js`
      const formattedContent = prettier.format(
        contentRule.selectors(collection_selectorName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    actionCreator() {
      const file = `./${setting_outputFolderName}/data/actionCreators.js`
      const formattedContent = prettier.format(
        contentRule.actionCreators(collection_actionCreatorName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    classes() {
      // TODO: 逻辑仿照 createFileComponents 的
      function createContent(customedClassName) {
        const customedClassTemplate = fs.readFileSync('./template/customedClasses.js')
        // 利用 ruduce()，应用所有的替换规则
        return `${customedClassTemplate}`.replace(/\$TM_FILENAME_BASE/gi, `${customedClassName}`)
      }
      for (customedClassName of appStructure.data.class) {
        const file = `./${setting_outputFolderName}/data/class/${customedClassName}`
        const formattedContent = prettier.format(
          createContent(customedClassName),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)
      }
    },

    store() {
      // TODO
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
