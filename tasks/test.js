const gulp = require('gulp')
const jetpack = require('fs-jetpack')
const mocha = require('gulp-mocha')
const rollup = require('./rollup')

const generateSpecEntryFile = (specDir, specPattern) => {
  const specFile = 'spec.autogenerated.js'

  return specDir.findAsync('.', { matching: specPattern }).then(paths => {
    const content = ["import './spec_helper'"].concat(paths.map(path => "import './" + path + "'")).join('\n')
    return specDir.writeAsync(specFile, content)
  }).then(() => specDir.path(specFile))
}

gulp.task('test', () => {
  const src = jetpack.cwd('src')
  const app = jetpack.cwd('app')

  return generateSpecEntryFile(src, '*_spec.js').then(specFile => {
    return rollup(specFile, app.path('specs.js')).then(() => {
      jetpack.remove(specFile)

      gulp
        .src(app.path('specs.js'))
        .pipe(mocha())
    })
  })
})