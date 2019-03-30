module.exports = actionCreatorCollection => {
  if (!actionCreatorCollection.length) {
    return '// no actionCreator in this app'
  } else {
    return actionCreatorCollection
      .map(actionCreator => `export const ${actionCreator} = (state) => ({type: 'unknown'})`)
      .join('\n\n')
  }
}
