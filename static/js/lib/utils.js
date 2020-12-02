const path = require('path')

const log = console.log.bind(console)

const gidGenerator = (() => {
    let id = 0
    let f = () => {
        id++
        return id
    }
    return f
})()

const resolvePath = (base, relativePath) => {
    // absolute 计算出来没有后缀名, 所以用 require.resolve 补全后缀名
    let absolute = path.resolve(base, relativePath)
    // log('abs', absolute)
    let p = require.resolve(absolute)
    return p
}

module.exports = {
    log,
    resolvePath: resolvePath,
    gidGenerator: gidGenerator,
}