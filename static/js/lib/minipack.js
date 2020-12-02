const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAstSync } = require('@babel/core')

const { log, gidGenerator, resolvePath } = require('./utils')

// 1. ntry 作为起点, 先收集相关依赖
const parsedEntry = (entry) => {
    let o = {}
    // 用 id 来标记每一个模块, 用 gidGenerator 来生成全局变量 id
    // let id = gid++
    let id = gidGenerator()
    let ds = collectedDeps(entry)
    // 这里的代码需要多次用到, 其实应该封装成函数
    let s = fs.readFileSync(entry, 'utf8')
    let ast = astFromCode(s)

    // 因为浏览器并不能直接处理 es6 的代码(现在的这种处理方式我们并不满意), 所以转成 es5 代码
    let es5Code = codeFromAst(ast, s)


    o[entry] = {
        id: id,
        dependencies: ds,
        code: es5Code,
        content: s,
    }

    Object.values(ds).forEach(d => {
        // 依赖是一个树状图的关系, 遍历收集并且解析依赖
        let r = parsedEntry(d)
        // 把返回值与初始值合并
        Object.assign(o, r)
    })

    log('entry o', o)
    return o
}

const collectedDeps = (entry) => {
    let s = fs.readFileSync(entry, 'utf8')
    let ast = astFromCode(s)

    let l = []
    traverse(ast, {
        // ImportDeclaration 是指遇到 import a from b 类型语句的时候, 进入这个函数
        ImportDeclaration(path) {
            // 这个时候的 module 就是 from 后面的值, 是一个相对路径
            let module = path.node.source.value
            l.push(module)
        }
    })
    // log('l is', l)
    let o = {}
    l.forEach(e => {
        // 一个模块里面可以 import 其他模块, 子模块里面也可以引入更多模块
        // 所以需要遍历处理每一个 from 后面的模块
        // 而这些模块本身是一个相对路径, 不能读出代码, 所以要先处理成绝对路径

        // 先根据 entry 拿到 entry 所在的目录
        // 拿到目录之后根据相对路径可以计算出绝对路径
        let directory = path.dirname(entry)
        let p = resolvePath(directory, e)

        // 本来直接返回 p 表示的绝对路径就可以, 但是因为转码之后的代码还需要相对路径
        // 所以要把相对路径和绝对路径都返回, 返回字典很方便
        o[e] = p
    })
    // log('o is', o)
    // {
    //   './helper/log': '/uer/lin/Document/....helper/log.js'
    // }
    return o
}

const astFromCode = (code) => {
    let ast = parser.parse(code, {
        sourceType: 'module',
    })
    return ast
}

const codeFromAst = (ast, sourceCode) => {
    let r = transformFromAstSync(ast, sourceCode, {
        // 转成 es5 代码的时候需要配置 presets
        presets: ['@babel/preset-env'],
    })
    return r.code
}

// 2. 拿到依赖图之后, 还需要处理成模块的形式才能直接运行
const moduleFromGraph = (graph) => {
    let modules = ''
    Object.values(graph).forEach(g => {
        // 参数 g 实际上是 module, 也就是下面的形成
        // {
        //     id: id,
        //     dependencies: ds,
        //     code: es5Code,
        //     content: s,
        // }

        let ds = g.dependencies

        let o = {}
        // [[k1, v1], [k2, v2]]
        Object.entries(ds).forEach(([k, v]) => {
            o[k] = graph[v].id
        })

        log('graph o is', g)

        // module 几乎是一样的, 用一个模板函数来生成
        modules += moduleTemplate(g, o)
    })
    return modules
}

const moduleTemplate = (graph, mapping) => {
    // 下面这个对象是 graph[绝对路径]
    // {
    //     id: 3,
    //         dependencies: {},
    //     code: '"use strict";\n' +
    //     '\n' +
    //     'var e = function e(selector) {\n' +
    //     '  return document.querySelector(selector);\n' +
    //     '};\n' +
    //     '\n' +
    //     'module.exports = e;',
    //         content: 'const e = selector => document.querySelector(selector)\n' +
    // '\n' +
    // 'module.exports = e'
    // }
    let g = graph
    let m = JSON.stringify(mapping)
    let s = `
        ${g.id}: [
            function(require, module, exports) {
                ${g.code}
            },
            ${m}
        ],
    `
    return s
}

// 3.生成的 bundle 文件
const bundleTemplate = (module) => {
    let s = `
        (function(modules) {
            const require = (id) => {
                let [fn, mapping] = modules[id]

                const localRequire = (name) => {
                    return require(mapping[name])
                }

                const localModule = {
                    exports: {

                    }
                }

                fn(localRequire, localModule, localModule.exports)

                return localModule.exports
            }

            require(1)
        })({${module}})
    `
    return s
}

// 4.写入
const writeBundle = (bundle, file) => {
    fs.writeFileSync(file, bundle)
}

const bundle = (entry, config) => {
    // 生成图
    let graph = parsedEntry(entry) // entry: a.js  的绝对路径

    // 生成 module
    let module = moduleFromGraph(graph)

    // 打包方法
    let bundle = bundleTemplate(module)

    // 写入文件
    // let file = 'dist/bundle.js'
    let file = path.join(config.output.directory, config.output.filename)
    writeBundle(bundle, file)
}

module.exports = bundle
