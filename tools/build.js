const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('Building CommonJS modules ...')

exec('babel modules -d . --ignore __tests__', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES modules ...')

exec('babel modules -d es --ignore __tests__', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding react-broadcast.js ...')

exec('webpack modules/index.js umd/react-broadcast.js', {
  NODE_ENV: 'development'
})

console.log('\nBuilding react-broadcast.min.js ...')

exec('webpack -p modules/index.js umd/react-broadcast.min.js', {
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('umd/react-broadcast.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
