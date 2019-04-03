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
const replacingRules = [
  // example: {
  //   pattern: '/* placeholderName*/',
  //   replaceFunction(){},
  //   parameters:['parameter']
  //   }

  // component's name
  {
    pattern: /\$TM_FILENAME_BASE/g,
    replaceFunction: componentName => componentName,
    parameters: ['componentName']
  },
  // import material-ui core
  {
    pattern: '/* import material-ui core */',
    replaceFunction: ({ coreMain, coreOthers } = {}) => {
      let cores = []
      if (coreMain) cores.push(coreMain)
      if (coreOthers) cores.push(...preprocessing.stringToArray(coreOthers))
      if (cores.length) {
        return `// 👇:material-ui core
            import {${cores.map(preprocessing.toPascalCase)}} from '@material-ui/core'`
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
      coreMain ? `<${preprocessing.stringToArray(coreMain)}>` : '',
    parameters: ['componentProperties.materialUI']
  },
  /* use material-ui coreMain::endTag */
  {
    pattern: '{/* use material-ui coreMain::endTag */}',
    replaceFunction: ({ coreMain } = {}) =>
      coreMain ? `</${preprocessing.stringToArray(coreMain)}>` : '',
    parameters: ['componentProperties.materialUI']
  },
  // import material-ui icons
  {
    pattern: '/* import material-ui icons */',
    replaceFunction: ({ icons } = {}) => {
      icons = preprocessing.stringToArray(icons)
      if (icons.length) {
        return `// 👇:material-ui icons
            import {${icons.map(preprocessing.suffixIconName)}} from '@material-ui/icons'`
      } else {
        return ''
      }
    },
    parameters: ['componentProperties.materialUI']
  },
  // import child components
  {
    pattern: '/* import child components */',
    replaceFunction: (childComponentNames = []) =>
      childComponentNames.length
        ? `import {${childComponentNames.join(',')}} from '../components'`
        : '',
    parameters: ['componentProperties.childComponentNames']
  },
  // use child components
  {
    pattern: '{/* use child components */}',
    replaceFunction: (childComponentNames = []) =>
      childComponentNames.map(childName => `<${childName} />\n`).join(''),
    parameters: ['componentProperties.childComponentNames']
  },
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
  },
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
  },
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

module.exports = {
  componentFile: (
    // will be used by eval()
    componentName,
    componentProperties,
    collection = {}
  ) => {
    const componentTemplate = fs.readFileSync('./template/componentFile.js')
    return replacingRules.reduce(
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
  classes: customedClassName => {
    return `${fs.readFileSync('./template/classes.js')}`.replace(
      /\$TM_FILENAME_BASE/gi,
      `${customedClassName}`
    )
  },
  store: customedClassName => {
    return `${fs.readFileSync('./template/store.js')}`.replace(
      /\$TM_FILENAME_BASE/gi,
      `${customedClassName}`
    )
  }
}
