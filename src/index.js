// this is entrance / main file
const fs = require('fs')
const prettier = require('prettier')

const contentRule = require('./templateRules')
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
      return fs.existsSync(`./${outputFolderName}/classes`)
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
    classes() {
      fs.mkdirSync(`./${outputFolderName}/classes`)
    },
    redux() {
      fs.mkdirSync(`./${outputFolderName}/redux`)
    },
    reducers() {
      fs.mkdirSync(`./${outputFolderName}/redux/reducers`)
    },
    theme() {
      fs.mkdirSync(`./${outputFolderName}/theme`)
    }
  },
  files: {
    componentFile(
      partOfTree,
      currentPath = `./${outputFolderName}/components`
    ) {
      for (let [componentName, componentProperties] of Object.entries(
        partOfTree
      )) {
        // 预处理：删去组件的标识性前缀 & 智能提取子组件的名字
        componentName = componentName.replace('__C', '')
        const childComponents = Object.entries(componentProperties).filter(
          ([key, value]) => key.endsWith('__C')
        )
        componentProperties.childComponentNames = childComponents.map(
          ([componentName, componentProperties]) =>
            componentName.replace('__C', '')
        )
        // 收集 componentName
        collection.componentName.push(componentName)
        // 写入文件
        const file = `${currentPath}/${componentName}.js`
        const formattedContent = prettier.format(
          contentRule.componentFile(
            componentName,
            componentProperties,
            collection
          ),
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
      const formattedContent = prettier.format(
        contentRule.initialize_browser_css(),
        {
          ...prettierOptions,
          parser: 'css'
        }
      )
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
      for (const reducerName of Object.keys(appStructure.redux.reducers)) {
        const file = `./${outputFolderName}/redux/reducers/${reducerName}.js`
        const formattedContent = prettier.format(
          contentRule.reducerFile(reducerName),
          prettierOptions
        )
        fs.writeFileSync(file, formattedContent)
      }
    },
    reducerIndex() {
      const file = `./${outputFolderName}/redux/reducers/index.js`
      const formattedContent = prettier.format(
        contentRule.reducerIndex(Object.keys(appStructure.redux.reducers)),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    selector() {
      const file = `./${outputFolderName}/redux/selectors.js`
      const formattedContent = prettier.format(
        contentRule.selectors(collection.selectorName),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    actionCreator() {
      const file = `./${outputFolderName}/redux/actionCreators.js`
      const formattedContent = prettier.format(
        contentRule.actionCreators(collection.actionCreatorName),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    classes() {
      for (customedClassName of Object.keys(appStructure.classes)) {
        const file = `./${outputFolderName}/classes/${customedClassName}.js`
        const formattedContent = prettier.format(
          contentRule.classes(customedClassName),
          prettierOptions
        )
        fs.writeFileSync(file, formattedContent)
      }
    },
    classesIndex() {
      const file = `./${outputFolderName}/classes/index.js`
      const formattedContent = prettier.format(
        contentRule.classesIndex(Object.keys(appStructure.classes)),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    store: () => {
      const file = `./${outputFolderName}/redux/store.js`
      const formattedContent = prettier.format(
        contentRule.store({
          classesNames: Object.keys(appStructure.classes),
          initialState: appStructure.redux.store.initialState,
          middleware: appStructure.redux.store.middleware
        }),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
    material_ui: () => {
      const file = `./${outputFolderName}/theme/material_ui.js`
      const formattedContent = prettier.format(
        contentRule.material_ui(),
        prettierOptions
      )
      fs.writeFileSync(file, formattedContent)
    },
  }
}

// create system floder
if (!exist.folder.output()) {
  create.folder.output()
  create.folder.reactComponents()
  create.folder.redux()
  create.folder.theme()
  if (appStructure.redux.reducers) create.folder.reducers()
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
create.files.material_ui()
if (appStructure.classes && !exist.folder.classes()) {
  create.folder.classes()
  create.files.classes()
  create.files.classesIndex()
}
create.files.store()
