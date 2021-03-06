const fs = require('fs')
const preprocessing = {
  stringToArray(param = []) {
    return Array.isArray(param) ? param : [param]
  },
  toPascalCase(string = '') {
    return string.replace(/(?:_|^)(\w)/g, (all, letter) => letter.toUpperCase())
  },
  suffixIconName(string) {
    return `${preprocessing.toPascalCase(string)}Icon`
  }
}
// 对生成组件使用的规则
const componentFileReplacingRules = [
  // 与依赖无关
  [
    // componentName
    {
      pattern: /\$TM_FILENAME_BASE/g,
      replaceFunction: componentName => componentName,
      parameters: ['componentName']
    },
    // componentType
    {
      pattern: 'componentType',
      replaceFunction: (componentType = 'object') => componentType,
      parameters: ['componentType']
    }
  ],
  // 与 material_ui 相关的替换规则
  [
    // core
    [
      /* import material-ui core */
      {
        pattern: '/* import material-ui core */\n',
        replaceFunction: ({ coreMain, coreOthers } = {}) => {
          let cores = []
          if (coreMain) cores.push(coreMain)
          if (coreOthers) cores.push(...preprocessing.stringToArray(coreOthers))
          if (cores.length) {
            return `import {${cores.map(
              preprocessing.toPascalCase
            )}} from '@material-ui/core'\n`
          } else {
            return ''
          }
        },
        parameters: ['materialUI']
      },
      /* use material-ui coreMain::startTag */
      {
        pattern: '{/* use material-ui coreMain::startTag */}',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain
            ? `<${preprocessing.toPascalCase(
                coreMain
              )} className={classes.root}>`
            : '',
        parameters: ['materialUI']
      },
      /* use material-ui coreMain::endTag */
      {
        pattern: '{/* use material-ui coreMain::endTag */}',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain ? `</${preprocessing.toPascalCase(coreMain)}>` : '',
        parameters: ['materialUI']
      }
    ],
    // icons
    [
      {
        pattern: '/* import material-ui icons */\n',
        replaceFunction: ({ icons } = {}) => {
          icons = preprocessing.stringToArray(icons)
          if (icons.length) {
            return `import {${icons.map(
              preprocessing.suffixIconName
            )}} from '@material-ui/icons'\n`
          } else {
            return ''
          }
        },
        parameters: ['materialUI']
      }
    ],
    // styles
    [
      /* import material-ui styles */
      {
        pattern: '/* import material-ui styles */\n',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain ? `import { makeStyles } from '@material-ui/styles'\n` : '',
        parameters: ['materialUI']
      },
      /* set material-ui style */
      {
        pattern: '/* set material-ui style */',
        replaceFunction: ({ coreMain, coreMainStyle } = {}) =>
          coreMain
            ? `const useStyles = makeStyles(theme => ({
                root: ${coreMainStyle || '{}'}
              }))`
            : '',
        parameters: ['materialUI']
      },
      /* use material-ui style */
      {
        pattern: '/* use material-ui style */',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain ? `const classes = useStyles()` : '',
        parameters: ['materialUI']
      }
    ]
  ],
  // 与 childComponent 相关的替换规则
  [
    // import
    {
      pattern: '/* import child components */\n',
      replaceFunction: (childComponentNames = []) =>
        childComponentNames.length
          ? `import {${childComponentNames.join(',')}} from '../components'\n`
          : '',
      parameters: ['childComponentNames']
    },
    // use
    {
      pattern: '{/* use child components */}',
      replaceFunction: (childComponentNames = []) =>
        childComponentNames.map(childName => `<${childName} />\n`).join(''),
      parameters: ['childComponentNames']
    }
  ],
  // redux 相关
  [
    // import connect from 'react-redux
    {
      pattern: "import { connect } from 'react-redux'\n",
      replaceFunction: (mapState, mapDispatch) => {
        if (!mapState && !mapDispatch) {
          return ''
        } else {
          return "import { connect } from 'react-redux'\n"
        }
      },
      parameters: ['mapState', 'mapDispatch']
    },
    // import selectors
    {
      pattern: '/* import selectors */\n',
      replaceFunction: (mapState = {}, collection_selectorName = []) => {
        collection_selectorName.push(...Object.values(mapState))
        if (Object.entries(mapState).length) {
          return `import {${Object.values(
            mapState
          )}} from '../redux/selectors'\n`
        } else {
          return ''
        }
      },
      parameters: ['mapState', 'collection.selectorName']
    },
    // set mapState with selectors
    {
      pattern: '/* set mapState with selectors */\n',
      replaceFunction: mapState => {
        if (mapState) {
          return `const mapState = (state) => ({
            ${Object.entries(mapState).map(
              ([prop, selector]) => `${prop}: ${selector}(state)`
            )}
          })\n`
        } else {
          return ''
        }
      },
      parameters: ['mapState']
    },
    // get mapState Props
    {
      pattern: '/* get mapState Props */',
      replaceFunction: (mapState = {}) => {
        if (Object.entries(mapState).length) {
          return `${Object.keys(mapState)},`
        } else {
          return ''
        }
      },
      parameters: ['mapState']
    },
    // import actionCreators
    {
      pattern: '/* import actionCreators */\n',
      replaceFunction: (mapDispatch = [], actionCreatorCollection = []) => {
        mapDispatch = preprocessing.stringToArray(mapDispatch)
        actionCreatorCollection.push(...mapDispatch)
        if (mapDispatch.length) {
          return `import {${mapDispatch}} from '../redux/actionCreators'\n`
        } else {
          return ''
        }
      },
      parameters: ['mapDispatch', 'collection.actionCreatorName']
    },
    // set mapDispatch with actionCreators
    {
      pattern: '/* set mapDispatch with actionCreators */\n',
      replaceFunction: mapDispatch => {
        if (mapDispatch) {
          return `const mapDispatch = {${mapDispatch}}\n`
        } else {
          return ''
        }
      },
      parameters: ['mapDispatch']
    },
    // get mapDispatch Props
    {
      pattern: '/* get mapDispatch Props */',
      replaceFunction: (mapDispatch = []) => {
        if (mapDispatch.length) {
          return `${mapDispatch}`
        } else {
          return ''
        }
      },
      parameters: ['mapDispatch']
    },
    // 最终 export
    {
      pattern: '/* export component */',
      replaceFunction(mapState, mapDispatch) {
        if (!mapState && !mapDispatch) {
          return `export default FileComponent`
        } else {
          return `export default connect(${mapState &&
            'mapState'}, ${mapDispatch && 'mapDispatch'})(FileComponent)`
        }
      },
      parameters: ['mapState', 'mapDispatch']
    }
  ],
  // styled_components
  [
    // import styled-components
    {
      pattern: "import styled from 'styled-components'\n",
      replaceFunction: (style, wrapperType) => {
        if (!style && !wrapperType) return ''
        else return "import styled from 'styled-components'\n"
      },
      parameters: ['style', 'wrapperType']
    },
    // 设定了style
    {
      pattern: '/* config FileStyle */',
      replaceFunction: (wrapperType, style) =>
        style
          ? `const FileStyle = styled.${wrapperType || 'div'}\`${style || ''}\``
          : '',
      parameters: ['wrapperType', 'style']
    },
    // 没有设定 style
    {
      pattern: /FileStyle/g,
      replaceFunction: (wrapperType = 'div', style) =>
        style ? 'FileStyle' : wrapperType,
      parameters: ['wrapperType', 'style']
    }
  ]
]

const templateRules = {
  componentFile: (
    // will be used by eval()
    componentName,
    componentProperties,
    collection = {}
  ) => {
    const componentTemplate = fs.readFileSync('./main/fileTemplate_component.js')
    return Object.values(componentFileReplacingRules)
      .flat(2)
      .reduce(
        (contentString, { pattern, replaceFunction, parameters }) =>
          contentString.replace(
            // string.prototype.replace(string, string)
            pattern,
            replaceFunction(
              ...parameters.map(param => {
                // 如果函数的传参 eval() 会报错，视为 componentProperties 的属性名
                let evalResult
                try {
                  evalResult = eval(param)
                } catch (e) {
                  evalResult = eval(`componentProperties.${param}`)
                }
                return evalResult
              })
            )
          ),
        `${componentTemplate}`
      )
  },
  componentIndex: componentsNames => {
    const rootComponent = componentsNames[0]
    return `
      import React from 'react'
      import { Provider } from 'react-redux'
      import store from '../redux/store'
      import MaterialTheme from '../theme/material_ui'
      
      ${componentsNames
        .map(name => `import ${name} from './${name}'`)
        .join('\n')}
      
      export {${componentsNames.join(',')}}
      export default () => (
        <Provider store={store}>
          <MaterialTheme>
            <${rootComponent} />
          </MaterialTheme>
        </Provider>
      )
    `
  },
  outputIndex: () => {
    return `
      import React from 'react'
      import ReactDOM from 'react-dom'
      import './initialize_browser_css.css'
      import './initialize_material_ui.js'
      import App from './components'
      
      ReactDOM.render(<App />, document.getElementById('root'))
  `
  },
  initialize_browser_css: () => {
    return `
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }  
  `
  },
  initialize_material_ui: () => {
    return `
      import { install } from '@material-ui/styles'
      install() // switches the styling engine the core components use.
  `
  },
  reducerFile: reducerName => {
    return `
      export default (state = {}, action = {}) => {
        switch (action.type) {
          case '${reducerName}_main'.toUpperCase(): {
          }
          default:
            return state
        }
      }
    `
  },
  reducerIndex: reducerNames => {
    return `
      import { combineReducers } from 'redux'
      ${reducerNames
        .map(reducerName => `import ${reducerName} from './${reducerName}'`)
        .join('\n')}
      export default combineReducers({${reducerNames.join(',')}})
    `
  },
  selectors: selectorCollection => {
    if (!selectorCollection || !selectorCollection.length) {
      return '// no selector in this app'
    } else {
      return [...new Set(selectorCollection)]
        .map(
          selector =>
            `export const ${selector} = (state) => {
            // haven't defined yet
          }`
        )
        .join('\n\n')
    }
  },
  actionCreators: actionCreatorCollection => {
    if (!actionCreatorCollection.length) {
      return '// no actionCreator in this app'
    } else {
      return actionCreatorCollection
        .map(
          actionCreator =>
            `export const ${actionCreator} = (state) => ({type: 'unknown'})`
        )
        .join('\n\n')
    }
  },
  classes: customedClassesNames => {
    return `
      export default class ${customedClassesNames} {
        constructor() {}
      }
      window.${customedClassesNames} = ${customedClassesNames}
    `
  },
  classesIndex: customedClassesNames => {
    return `
      ${customedClassesNames
        .map(
          customedClassName =>
            `import ${customedClassName} from './${customedClassName}'`
        )
        .join('\n')}
      
      export { ${customedClassesNames} }
    `
  },
  store: ({ classesNames, initialState, middleware }) => {
    // TODO: 这只是占位代码
    return `
      import { createStore, ${
        middleware ? 'applyMiddleware' : ''
      } } from 'redux'
      import rootReducer from './reducers'
      ${
        middleware
          ? middleware
              .map(
                middlewareName =>
                  `import ${middlewareName.variableName} from '${
                    middlewareName.packageName
                  }'` || ''
              )
              .join('\n')
          : ''
      }
      ${classesNames ? `import { ${classesNames} } from '../classes'` : ''}
      const initialState = {
        ${initialState || '/* initialState */'}
      }
      export default createStore(rootReducer, initialState, ${
        middleware
          ? `applyMiddleware([${middleware.map(
              ({ variableName }) => variableName
            )}])`
          : ''
      })
    `
  },
  material_ui: () => {
    return `
      import React from 'react'
      import { ThemeProvider } from '@material-ui/styles'
      import { createMuiTheme } from '@material-ui/core/styles'
      import { grey, amber } from '@material-ui/core/colors'
      
      const defaultSpacing = 8
      
      const theme = createMuiTheme({
        palette: {
          type: 'dark',
          background: {
            // default: '#222',
            paper: '#353535'
          },
          primary: {
            main: grey[900]
          },
          secondary: {
            main: amber['A400']
          },
          text: {
            primary: '#eee'
          }
        },
        spacing: {
          unit: defaultSpacing,
          gutter: defaultSpacing * 3
        },
        typography: { useNextVariants: true },
        overrides: {
          MuiPaper: {
            root: {
              background: '#353535',
              padding: defaultSpacing,
              marginBottom: defaultSpacing * 3
            }
          },
          MuiCard: {
            root: {
              background: 'rgba(255, 255, 255, 0.1)',
              marginRight: defaultSpacing,
              marginBottom: defaultSpacing
            }
          }
        }
        // overrides: {
        //   // Name of the component ⚛️ / style sheet
        //   MuiButton: {
        //     // Name of the rule
        //     text: {
        //       // Some CSS
        //       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        //       borderRadius: 3,
        //       border: 0,
        //       color: 'white',
        //       height: 48,
        //       padding: '0 30px',
        //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        //     },
        //   },
        // },
        // props: {
        //   // Name of the component ⚛️
        //   MuiButtonBase: {
        //     // The properties to apply
        //   },
        // },
      })
      
      function ThemeNesting({ children }) {
        return <ThemeProvider theme={theme}>{children} </ThemeProvider>
      }
      
      export default ThemeNesting
    `
  }
}

module.exports = templateRules
