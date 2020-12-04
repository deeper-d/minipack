# minipack
实现 webpack 的核心打包功能, 打包代码生成 bundle.js

> minipack
>> dist
>>> bundle.js
>
>> static
>>> css
>>>> a.css
>>>
>>>js
>>>> helper
>>>>> log.js
>>>>>
>>>>> select.js
>>>>
>>>> lib
>>>>> minipack.js
>>>>>
>>>>> utils.js
>>>>
>>>>a.js
>
>> a.html
>
>> index.js
>
>> minipack.config.js
>
>> package.json
>
>> README.md

1.安装依赖包
```
yarn install
```
2.运行查看打包文件
```
yarn run build
```
### minipack 核心功能
* 读取代码文件，将代码按照相应格式的 parser 解析成 AST
* 操作处理相应节点，生成新的AST，还原文件代码，写入文件中
* 使用 node 的 stream 模块将文件的 buffer 转化为 utf-8 的 string
* 使用 babel/parser 将源码转成 AST
* 使用 babel/traverse 遍历 AST，找到需要处理的节点进行操作
* 在 webpack 打包时用 IIFE 的方法处理模块，生成 bundle.js