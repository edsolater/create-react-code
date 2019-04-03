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
  // 与 component name 相关的替换规则
  [
    {
      pattern: /\$TM_FILENAME_BASE/g,
      replaceFunction: componentName => componentName,
      parameters: ['componentName']
    }
  ],
  // 与 material_ui 相关的替换规则
  [
    // core
    [
      /* import material-ui core */
      {
        pattern: '/* import material-ui core */',
        replaceFunction: ({ coreMain, coreOthers } = {}) => {
          let cores = []
          if (coreMain) cores.push(coreMain)
          if (coreOthers) cores.push(...preprocessing.stringToArray(coreOthers))
          if (cores.length) {
            return `import {${cores.map(
              preprocessing.toPascalCase
            )}} from '@material-ui/core'`
          } else {
            return ''
          }
        },
        parameters: ['componentProperties.materialUI']
      },
      /* use material-ui coreMain::startTag */
      {
        pattern: '{/* use material-ui coreMain::startTag */}',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain
            ? `<${preprocessing.toPascalCase(coreMain)} className={classes.root}>`
            : '',
        parameters: ['componentProperties.materialUI']
      },
      /* use material-ui coreMain::endTag */
      {
        pattern: '{/* use material-ui coreMain::endTag */}',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain ? `</${preprocessing.toPascalCase(coreMain)}>` : '',
        parameters: ['componentProperties.materialUI']
      }
    ],
    // icons
    [
      {
        pattern: '/* import material-ui icons */',
        replaceFunction: ({ icons } = {}) => {
          icons = preprocessing.stringToArray(icons)
          if (icons.length) {
            return `import {${icons.map(
              preprocessing.suffixIconName
            )}} from '@material-ui/icons'`
          } else {
            return ''
          }
        },
        parameters: ['componentProperties.materialUI']
      }
    ],
    // styles
    [
      /* import material-ui styles */
      {
        pattern: '/* import material-ui styles */',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain ? `import { makeStyles } from '@material-ui/styles'` : '',
        parameters: ['componentProperties.materialUI']
      },
      /* set material-ui style */
      {
        pattern: '/* set material-ui style */',
        replaceFunction: ({ coreMain, coreMainStyle } = {}) =>
          coreMain
            ? `const useStyles = makeStyles(theme => ({
                root: {
                  ${coreMainStyle || ''}
                }
              }))`
            : '',
        parameters: ['componentProperties.materialUI']
      },
      /* use material-ui style */
      {
        pattern: '/* use material-ui style */',
        replaceFunction: ({ coreMain } = {}) =>
          coreMain ? `const classes = useStyles()` : '',
        parameters: ['componentProperties.materialUI']
      }
    ]
  ],
  // 与 childComponent 相关的替换规则
  [
    // import
    {
      pattern: '/* import child components */',
      replaceFunction: (childComponentNames = []) =>
        childComponentNames.length
          ? `import {${childComponentNames.join(',')}} from '../components'`
          : '',
      parameters: ['componentProperties.childComponentNames']
    },
    // use
    {
      pattern: '{/* use child components */}',
      replaceFunction: (childComponentNames = []) =>
        childComponentNames.map(childName => `<${childName} />\n`).join(''),
      parameters: ['componentProperties.childComponentNames']
    }
  ],
  // 与 selectors 相关的替换规则
  [
    // import selectors
    {
      pattern: '/* import selectors */',
      replaceFunction: (mapState = {}, collection_selectorName = []) => {
        collection_selectorName.push(...Object.values(mapState))
        if (Object.entries(mapState).length) {
          return `import {${Object.values(mapState)}} from '../data/selectors'`
        } else {
          return ''
        }
      },
      parameters: ['componentProperties.mapState', 'collection.selectorName']
    },
    // set mapState with selectors
    {
      pattern: '/* set mapState with selectors */',
      replaceFunction: (mapState = {}) => `const mapState = (state) => ({
        ${Object.entries(mapState).map(
          ([prop, selector]) => `${prop}: ${selector}(state)`
        )}
      })`,
      parameters: ['componentProperties.mapState']
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
      parameters: ['componentProperties.mapState']
    }
  ],
  // 与 actionCreators 相关的替换规则
  [
    // import actionCreators
    {
      pattern: '\n/* import actionCreators */',
      replaceFunction: (mapDispatch = [], actionCreatorCollection = []) => {
        mapDispatch = preprocessing.stringToArray(mapDispatch)
        actionCreatorCollection.push(...mapDispatch)
        if (mapDispatch.length) {
          return `import {${mapDispatch}} from '../data/actionCreators'`
        } else {
          return ''
        }
      },
      parameters: ['componentProperties.mapDispatch', 'collection.actionCreatorName']
    },
    // set mapDispatch with actionCreators
    {
      pattern: '/* set mapDispatch with actionCreators */',
      replaceFunction: (mapDispatch = []) => `const mapDispatch = {${mapDispatch}}`,
      parameters: ['componentProperties.mapDispatch']
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
      parameters: ['componentProperties.mapDispatch']
    }
  ],
  // styled_components
  [
    // wrapperType
    {
      pattern: '/* wrapperType */ div',
      replaceFunction: (wrapperType = 'div') => wrapperType,
      parameters: ['componentProperties.wrapperType']
    },
    // style
    {
      pattern: '/* style */',
      replaceFunction: (style = {}) =>
        Object.entries(style)
          .map(([CSSName, CSSValue]) => `${CSSName}: ${CSSValue};`)
          .join('\n'),
      parameters: ['componentProperties.style']
    }
  ]
]

const contentRules = {
  componentFile: (
    // will be used by eval()
    componentName,
    componentProperties,
    collection = {}
  ) => {
    const componentTemplate = fs.readFileSync('./template/componentFile.js')
    return Object.values(componentFileReplacingRules)
      .flat(2)
      .reduce(
        (contentString, { pattern, replaceFunction, parameters }) =>
          contentString.replace(
            // string.prototype.replace(string, string)
            pattern,
            replaceFunction(...parameters.map(param => eval(param)))
          ),
        `${componentTemplate}`
      )
  },
  componentIndex: componentsNames => {
    return `${fs.readFileSync('./template/componentIndex.js')}`
      .replace(
        '/* import */',
        componentsNames.map(name => `import ${name} from './${name}'`).join('\n')
      )
      .replace('/* named export */', `export {${componentsNames.join(',')}}`)
      .replace('/* default export */', `export default ${componentsNames[0]}`)
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
  classes: customedClassName =>
    `${fs.readFileSync('./template/classes.js')}`.replace(
      /\$TM_FILENAME_BASE/gi,
      `${customedClassName}`
    ),
  store: customedClassName => {
    // TODO: 这只是占位代码
    return `${fs.readFileSync('./template/store.js')}`.replace(
      /\$TM_FILENAME_BASE/gi,
      `${customedClassName}`
    )
  },
  outputIndex: () => `
    import React from 'react'
    import ReactDOM from 'react-dom'
    import './initialize_browser_css.css'
    import './initialize_material-ui'
    import App from './components'
    
    ReactDOM.render(<App />, document.getElementById('root'))
  `,
  initialize_browser_css: () => `
    html,
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }  
  `,
  initialize_material_ui: () => `
    import { install } from '@material-ui/styles'
    install() // switches the styling engine the core components use.
  `
}

module.exports = contentRules
