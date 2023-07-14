// place at : /ghpages.js
// you can see more info at https://github.com/tschaub/gh-pages
const ghpages = require('gh-pages')

const options = {
  branch: 'gh-pages',
  repo: 'https://github.com/daylilystudio/maskmap.git' // project github repo
}
const callback = err => {
  if (err) console.error(err)
  else console.log('publish success')
}

/**
 * This task pushes to the `master` branch of the configured `repo`.
 */
ghpages.publish('dist', options, callback)
