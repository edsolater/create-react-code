// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const contentRule = require('./setContent')
const appStructure = require('./appStructure')
const { outputFolderName, prettierOptions } = require('./envSetting')

const collection = {
  selectorName: [],
  actionCreatorName: [],
  componentName: []
}
const exist = {
  folder: {
    output() {
      return fs.existsSync(`./${outputFolderName}`)
    },
    classes() {
      return fs.existsSync(`./${outputFolderName}/functions/classes`)
    }
  }
}
const create = {
  folder: {
    output() {
      fs.mkdirSync(`./${outputFolderName}`)
    },
    reactComponents() {
      fs.mkdirSync(`./${outputFolderName}/components`)
    },
    functions() {
      fs.mkdirSync(`./${outputFolderName}/functions`)
    },
    classes() {
      fs.mkdirSync(`./${outputFolderName}/functions/classes`)
    },
    reducers() {
      fs.mkdirSync(`./${outputFolderName}/functions/reducers`)
    }
  },
  files: {
    componentFile(partOfTree, currentPath = `./${outputFolderName}/components`) {
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
          prettierOptions
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
      const file = `./${outputFolderName}/components/index.js`
      const formattedContent = prettier.format(
        contentRule.componentIndex(collection.componentName),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    outputIndex() {
      const file = `./${outputFolderName}/index.js`
      const formattedContent = prettier.format(
        contentRule.outputIndex(),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    initialize_browser_css() {
      const file = `./${outputFolderName}/initialize_browser_css.css`
      const formattedContent = prettier.format(contentRule.initialize_browser_css(), {
        ...prettierOptions,
        parser: 'css'
      })
      fs.writeFileSync(file, formattedContent)
    },
    initialize_material_ui() {
      const file = `./${outputFolderName}/initialize_material_ui.js`
      const formattedContent = prettier.format(
        contentRule.initialize_material_ui(),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    reducers() {
      for (const reducerName of appStructure.functions.reducers) {
        const file = `./${outputFolderName}/functions/reducers/${reducerName}.js`
        const formattedContent = prettier.format(
          contentRule.reducerFile(reducerName),
          prettierOptions
        )
        fs.writeFileSync(file, formattedContent)
      }
    },
    reducerIndex() {
      const file = `./${outputFolderName}/functions/reducers/index.js`
      const formattedContent = prettier.format(
        contentRule.reducerIndex(appStructure.functions.reducers),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    selector() {
      const file = `./${outputFolderName}/functions/selectors.js`
      const formattedContent = prettier.format(
        contentRule.selectors(collection.selectorName),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    actionCreator() {
      const file = `./${outputFolderName}/functions/actionCreators.js`
      const formattedContent = prettier.format(
        contentRule.actionCreators(collection.actionCreatorName),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    classes() {
      for (customedClassName of appStructure.functions.classes) {
        const file = `./${outputFolderName}/functions/classes/${customedClassName}.js`
        const formattedContent = prettier.format(
          contentRule.classes(customedClassName),
          prettierOptions
        )
        fs.writeFileSync(file, formattedContent)
      }
    },
    store() {
      const file = `./${outputFolderName}/functions/store.js`
      const formattedContent = prettier.format(
        contentRule.store(),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    }
  }
}

// create system floder
if (!exist.folder.output()) {
  create.folder.output()
  create.folder.reactComponents()
  create.folder.functions()
  if (appStructure.functions.reducers) create.folder.reducers()
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
if (appStructure.functions.classes && !exist.folder.classes()) {
  create.folder.classes()
  create.files.classes()
}
create.files.store()
