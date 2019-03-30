// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const contentRule = require('./contentRule')
const appStructure = require('./appStructure')
const { setting_outputFolderName, setting_prettierConfig } = require('./envSetting')

const collection = {
  selectorName: [],
  actionCreatorName: []
}

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
    reactComponent(partOfTree, currentPath = `./${setting_outputFolderName}/components`) {
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
          contentRule.reactComponent(componentName, componentProperties, collection),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)

        // 递归地创造子组件
        if (childComponents.length) {
          childComponents.forEach(([componentName, componentProperties]) =>
            create.files.reactComponent({ [componentName]: componentProperties })
          )
        }
      }
    },

    selector() {
      const file = `./${setting_outputFolderName}/data/selectors.js`
      const formattedContent = prettier.format(
        contentRule.selectors(collection.selectorName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    actionCreator() {
      const file = `./${setting_outputFolderName}/data/actionCreators.js`
      const formattedContent = prettier.format(
        contentRule.actionCreators(collection.actionCreatorName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },

    classes() {
      for (customedClassName of appStructure.data.class) {
        const file = `./${setting_outputFolderName}/data/class/${customedClassName}.js`
        const formattedContent = prettier.format(
          contentRule.classes(customedClassName),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)
      }
    },

    store() {
      const file = `./${setting_outputFolderName}/data/store.js`
      const formattedContent = prettier.format(contentRule.store(), setting_prettierConfig)
      fs.writeFileSync(file, formattedContent)
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
create.files.reactComponent(appStructure.components)
create.files.selector()
create.files.actionCreator()
if (appStructure.data.class && !fs.existsSync(`./${setting_outputFolderName}/data/class`)) {
  fs.mkdirSync(`./${setting_outputFolderName}/data/class`)
  create.files.classes()
}
create.files.store()
