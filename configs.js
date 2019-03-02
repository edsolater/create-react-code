module.exports = {
  placeholder: {
    'import related components': '/* placeholder: import related components */',
    'use related component': '{/* placeholder: use related component */}',
    'set mapState': '/* placeholder: set mapState with selector */',
    'connect mapState': '/* placeholder: connect mapState */',
    'use mapState': '/* placeholder: use mapState */'
  },
  codeBlockSyntax: {
    'import related components': (childComponentNames) =>
      childComponentNames
        .map((childName) => `import ${childName} from './${childName}'\n`)
        .join(''),
    'use related component': (childComponentNames) =>
      childComponentNames
        .map((childName) => `<${childName} />\n`)
        .join('')
  }
}
