module.exports = selectorCollection => {
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
}
