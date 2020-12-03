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
