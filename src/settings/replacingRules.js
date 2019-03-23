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
        replaceFunctionParams: 'componentName'
      },

      // child components
      {
        pattern: '/* import child components */',
        replaceFunction: childComponentNames =>
          childComponentNames
            .map(childName => `import ${childName} from './${childName}'\n`)
            .join(''),
        replaceFunctionParams: 'childComponentNames'
      },
      {
        pattern: '{/* use child components */}',
        replaceFunction: childComponentNames =>
          childComponentNames.map(childName => `<${childName} />\n`).join(''),
        replaceFunctionParams: 'childComponentNames'
      },

      // mapState & selectors
      {
        pattern: '/* import selectors */',
        replaceFunction: (mapState, selectorCollection = []) => {
          selectorCollection.push(...Object.values(mapState))
          if (Object.entries(mapState).length) {
            return `import {${Object.values(
              mapState
            )}} from '../data/selectors'`
          } else {
            return ''
          }
        },
        replaceFunctionParams: 'mapState, selectorCollection'
      },
      {
        pattern: '/* set mapState with selectors */',
        replaceFunction: mapState => `const mapState = (state) => ({
        ${Object.entries(mapState).map(
          ([prop, selector]) => `${prop}: ${selector}(state)`
        )}
      })`,
        replaceFunctionParams: 'mapState'
      },
      {
        pattern: '/* get mapState Props */',
        replaceFunction: mapState => {
          if (Object.entries(mapState).length) {
            return `${Object.keys(mapState)},`
          } else {
            return ''
          }
        },
        replaceFunctionParams: 'mapState'
      },

      // mapDispatch & actionCreators
      {
        pattern: '/* import actionCreators */',
        replaceFunction: (mapDispatch, actionCreatorCollection = []) => {
          actionCreatorCollection.push(...mapDispatch)
          if (mapDispatch.length) {
            return `import {${mapDispatch}} from '../data/actionCreators'`
          } else {
            return ''
          }
        },
        replaceFunctionParams: 'mapDispatch, actionCreatorCollection'
      },
      {
        pattern: '/* set mapDispatch with actionCreators */',
        replaceFunction: mapDispatch => `const mapDispatch = {${mapDispatch}}`,
        replaceFunctionParams: 'mapDispatch'
      },
      {
        pattern: '/* get mapDispatch Props */',
        replaceFunction: mapDispatch => {
          if (mapDispatch.length) {
            return `${mapDispatch}`
          } else {
            return ''
          }
        },
        replaceFunctionParams: 'mapDispatch'
      }
    ]
  },
  // for creating selectors
  selector: {
    generateContentBy: selectorCollection => {
      if (!selectorCollection.length) {
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
