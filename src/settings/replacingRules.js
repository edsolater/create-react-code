const preprocessing={
  stringToArray(param=[]){
    return (Array.isArray(param) ? param : [param])
  },
  toPascalCase(string=''){
    return string.replace(/(?:_|^)(\w)/g, (all, letter) => letter.toUpperCase())
  },
  suffixIconName(string){
    return `${preprocessing.toPascalCase(string)}Icon`
  }
}
module.exports = {
  // for creating single-file react component
  component: {
    rules: [
      // example: {
      //   pattern: '/* placeholderName*/',
      //   replaceFunction(){},
      //   replaceFunctionParams:['parameter']
      //   }

      // component's name
      {
        pattern: /\$TM_FILENAME_BASE/g,
        replaceFunction: componentName => componentName,
        replaceFunctionParams: ['componentName']
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
        replaceFunctionParams: ['materialUI']
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
        replaceFunctionParams: ['materialUI']
      },
      // import child components
      {
        pattern: '/* import child components */',
        replaceFunction: (childComponentNames = []) =>
          childComponentNames
            .map(childName => `import ${childName} from './${childName}'\n`)
            .join(''),
        replaceFunctionParams: ['childComponentNames']
      },
      // use child components
      {
        pattern: '{/* use child components */}',
        replaceFunction: (childComponentNames = []) =>
          childComponentNames.map(childName => `<${childName} />\n`).join(''),
        replaceFunctionParams: ['childComponentNames']
      },
      // import selectors
      {
        pattern: '/* import selectors */',
        replaceFunction: (mapState = {}, selectorCollection = []) => {
          selectorCollection.push(...Object.values(mapState))
          if (Object.entries(mapState).length) {
            return `import {${Object.values(
              mapState
            )}} from '../data/selectors'`
          } else {
            return ''
          }
        },
        replaceFunctionParams: ['mapState', 'selectorCollection']
      },
      // set mapState with selectors
      {
        pattern: '/* set mapState with selectors */',
        replaceFunction: (mapState = {}) => `const mapState = (state) => ({
        ${Object.entries(mapState).map(
          ([prop, selector]) => `${prop}: ${selector}(state)`
        )}
      })`,
        replaceFunctionParams: ['mapState']
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
        replaceFunctionParams: ['mapState']
      },
      // import actionCreators
      {
        pattern: '/* import actionCreators */',
        replaceFunction: (mapDispatch = [], actionCreatorCollection = []) => {
          mapDispatch = preprocessing.stringToArray(mapDispatch)
          actionCreatorCollection.push(...mapDispatch)
          if (mapDispatch.length) {
            return `import {${mapDispatch}} from '../data/actionCreators'`
          } else {
            return ''
          }
        },
        replaceFunctionParams: ['mapDispatch', 'actionCreatorCollection']
      },
      // set mapDispatch with actionCreators
      {
        pattern: '/* set mapDispatch with actionCreators */',
        replaceFunction: (mapDispatch = []) =>
          `const mapDispatch = {${mapDispatch}}`,
        replaceFunctionParams: ['mapDispatch']
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
        replaceFunctionParams: ['mapDispatch']
      },
      // wrapperType
      {
        pattern: '/* wrapperType */ div',
        replaceFunction: (wrapperType = 'div') => wrapperType,
        replaceFunctionParams: ['wrapperType']
      },
      // style
      {
        pattern: '/* style */',
        replaceFunction: (style = {}) =>
          Object.entries(style)
            .map(([CSSName, CSSValue]) => `${CSSName}: ${CSSValue};`)
            .join('\n'),
        replaceFunctionParams: ['style']
      }
    ]
  },
  // for creating selectors
  selector: {
    generateContentBy: selectorCollection => {
      if (!selectorCollection || !selectorCollection.length) {
        return '// no selector in this app'
      } else {
        return selectorCollection
          .map(
            selector =>
              `export const ${selector} = (state) => {
              // haven't defined yet
            }`
          )
          .join('\n\n')
      }
    }
  },
  // for creating actionCreators
  actionCreator: {
    generateContentBy: actionCreatorCollection => {
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
    }
  }
}
