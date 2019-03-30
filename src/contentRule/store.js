const fs = require('fs')
module.exports = customedClassName => {
  return `${fs.readFileSync('./template/store.js')}`.replace(
    /\$TM_FILENAME_BASE/gi,
    `${customedClassName}`
  )
}