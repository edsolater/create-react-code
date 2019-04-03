// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const contentRule = require('./setContent')
const appStructure = require('./appStructure')
const { setting_outputFolderName, setting_prettierConfig } = require('./envSetting')

const collection = {
  selectorName: [],
  actionCreatorName: [],
  componentName: []
}
const exist = {
  folder: {
    output() {
      return fs.existsSync(`./${setting_outputFolderName}`)
    },
    classes() {
      return fs.existsSync(`./${setting_outputFolderName}/data/classes`)
    }
  }
}
const create = {
  folder: {
    output() {
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
    },
    reducers() {
      fs.mkdirSync(`./${setting_outputFolderName}/data/reducers`)
    }
  },
  files: {
    componentFile(partOfTree, currentPath = `./${setting_outputFolderName}/components`) {
      for (let [componentName, componentProperties] of Object.entries(partOfTree)) {
        // 预处理：删去组件的标识性前缀 & 智能提取子组件的名字
        componentName = componentName.replace('__C', '')
        const childComponents = Object.entries(componentProperties).filter(
          ([key, value]) => key.endsWith('__C')
        )
        componentProperties.childComponentNames = childComponents.map(
          ([componentName, componentProperties]) => componentName.replace('__C', '')
        )
        // 收集 componentName
        collection.componentName.push(componentName)
        // 写入文件
        const file = `${currentPath}/${componentName}.js`
        const formattedContent = prettier.format(
          contentRule.componentFile(componentName, componentProperties, collection),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)

        // 追加处理：递归地创造子组件
        if (childComponents.length) {
          childComponents.forEach(([componentName, componentProperties]) =>
            create.files.componentFile({ [componentName]: componentProperties })
          )
        }
      }
    },
    componentIndex() {
      const file = `./${setting_outputFolderName}/components/index.js`
      const formattedContent = prettier.format(
        contentRule.componentIndex(collection.componentName),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },
    outputIndex() {
      const file = `./${setting_outputFolderName}/index.js`
      const formattedContent = prettier.format(
        contentRule.outputIndex(),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },
    initialize_browser_css() {
      const file = `./${setting_outputFolderName}/initialize_browser_css.css`
      const formattedContent = prettier.format(contentRule.initialize_browser_css(), {
        ...setting_prettierConfig,
        parser: 'css'
      })
      fs.writeFileSync(file, formattedContent)
    },
    initialize_material_ui() {
      const file = `./${setting_outputFolderName}/initialize_material_ui.js`
      const formattedContent = prettier.format(
        contentRule.initialize_material_ui(),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    },
    reducers() {
      for (const reducerName of appStructure.data.reducers) {
        const file = `./${setting_outputFolderName}/data/reducers/${reducerName}.js`
        const formattedContent = prettier.format(
          contentRule.reducerFile(reducerName),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)
      }
    },
    reducerIndex() {
      const file = `./${setting_outputFolderName}/data/reducers/index.js`
      const formattedContent = prettier.format(
        contentRule.reducerIndex(appStructure.data.reducers),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
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
      for (customedClassName of appStructure.data.classes) {
        const file = `./${setting_outputFolderName}/data/classes/${customedClassName}.js`
        const formattedContent = prettier.format(
          contentRule.classes(customedClassName),
          setting_prettierConfig
        )
        fs.writeFileSync(file, formattedContent)
      }
    },
    store() {
      const file = `./${setting_outputFolderName}/data/store.js`
      const formattedContent = prettier.format(
        contentRule.store(),
        setting_prettierConfig
      )
      fs.writeFileSync(file, formattedContent)
    }
  }
}

// create system floder
if (!exist.folder.output()) {
  create.folder.output()
  create.folder.reactComponents()
  create.folder.data()
  if (appStructure.data.reducers) create.folder.reducers()
}

// create|cover file
create.files.componentFile(appStructure.components)
create.files.componentIndex()
create.files.outputIndex()
create.files.initialize_browser_css()
create.files.initialize_material_ui()
create.files.reducers()
create.files.reducerIndex()
create.files.selector()
create.files.actionCreator()
if (appStructure.data.classes && !exist.folder.classes()) {
  create.folder.classes()
  create.files.classes()
}
create.files.store()
