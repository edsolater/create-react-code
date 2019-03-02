module.exports = {
  placeholder: {
    'import selectors': '/* placeholder: import selectors */', // TODO
    'import related components': '/* placeholder: import related components */',
    'use related component': '{/* placeholder: use related component */}',

    'set mapState with selectors':
      '/* placeholder: set mapState with selectors */',
    'get mapState Props': '/* placeholder: get mapState Props */',

    'set mapDispatch with actionCreators':
      '/* placeholder: /* placeholder: set mapDispatch with actionCreators */', // TODO
    'get mapDispatch Props': '/* placeholder: get mapDispatch Props */' // TODO
    // 'export component': '/* placeholder: export component */'
  },
  codeBlockSyntax: {
    'import related components': (childComponentNames) =>
      childComponentNames
        .map((childName) => `import ${childName} from './${childName}'\n`)
        .join(''),

    'use related component': (childComponentNames) =>
      childComponentNames.map((childName) => `<${childName} />\n`).join(''),

    'set mapState with selectors': (mapState) => `const mapState = (state) => ({
      ${Object.entries(mapState)
        .map(([prop, selector]) => `${prop}: ${selector}(state)`)
        .join('')}
    })`,

    'get mapState Props': (mapState) => {
      if (Object.entries(mapState).length) {
        return `{${Object.keys(mapState)}}`
      } else {
        return ''
      }
    }

    // 'export component': (name, mapState, mapDispatch) => {
    //   if (
    //     Object.entries(mapState).length ||
    //     Object.entries(mapDispatch).length
    //   ) {
    //     return `export default connect(
    //       ${Object.entries(mapState).length ? 'mapState,' : ''}
    //       ${Object.entries(mapDispatch).length ? 'mapDispatch' : ''}
    //     )(${name})`
    //   } else {
    //     return `export default ${name}`
    //   }
    // }
  }
}
