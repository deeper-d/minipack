// 引入 打包文件
const pack = require('./static/js/lib/minipack')
// 引入配置文件
const config = require('./minipack.config')

const __main = () => {
    // 获取 a.js 的绝对路径
    let entry = require.resolve(config.entry)
    // console.log('entry', entry)
    pack(entry, config)
}

if (require.main === module) {
    __main()
}