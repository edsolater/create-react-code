module.exports = {
  component: {
    placeholder: {
      //related components
      'import related components': '/* placeholder: import related components */',
      'use related components': '{/* placeholder: use related components */}',

      // mapState & selectors
      'import selectors': '/* placeholder: import selectors */',
      'set mapState with selectors': '/* placeholder: set mapState with selectors */',
      'get mapState Props': '/* placeholder: get mapState Props */',

      // mapDispatch & actionCreators
      'import actionCreators': '/* placeholder: import actionCreators */',
      'set mapDispatch with actionCreators':
        '/* placeholder: set mapDispatch with actionCreators */',
      'get mapDispatch Props': '/* placeholder: get mapDispatch Props */'
    },
    placement: {
      //----- related components -----
      'import related components': childComponentNames =>
        childComponentNames
          .map(childName => `import ${childName} from './${childName}'\n`)
          .join(''),
      'use related components': childComponentNames =>
        childComponentNames.map(childName => `<${childName} />\n`).join(''),

      //----- mapState & selectors -----
      'import selectors': (mapState, selectorCollection = []) => {
        selectorCollection.push(...Object.values(mapState))
        if (Object.entries(mapState).length) {
          return `import {${Object.values(mapState)}} from '../data/selectors'`
        } else {
          return ''
        }
      },

      'set mapState with selectors': mapState => `const mapState = (state) => ({
      ${Object.entries(mapState).map(([prop, selector]) => `${prop}: ${selector}(state)`)}
    })`,

      'get mapState Props': mapState => {
        if (Object.entries(mapState).length) {
          return `${Object.keys(mapState)},`
        } else {
          return ''
        }
      },

      //----- mapDispatch & actionCreators -----
      'import actionCreators': (mapDispatch, actionCreatorCollection = []) => {
        actionCreatorCollection.push(...mapDispatch)
        if (mapDispatch.length) {
          return `import {${mapDispatch}} from '../data/actionCreators'`
        } else {
          return ''
        }
      },

      'set mapDispatch with actionCreators': mapDispatch =>
        `const mapDispatch = {${mapDispatch}}`,

      'get mapDispatch Props': mapDispatch => {
        if (mapDispatch.length) {
          return `${mapDispatch}`
        } else {
          return ''
        }
      }
    }
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
