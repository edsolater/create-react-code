const fs = require('fs')
module.exports = customedClassName => {
  return `${fs.readFileSync('./template/classes.js')}`.replace(
    /\$TM_FILENAME_BASE/gi,
    `${customedClassName}`
  )
}
