const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalyser = (filename) => {
  const cont = fs.readFileSync(filename, 'utf-8')

  // parser.parse分析生成的其实就是AST,抽象语法树
  //   console.log(
  //     parser.parse(cont, {
  //       sourceType: 'module',
  //     })
  //   )
  // console.log(cont)

  const ast = parser.parse(cont, {
    sourceType: 'module',
  })
  const dependencies = {}
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename) // ./src
      const newFile = './' + path.join(dirname, node.source.value)

      dependencies[node.source.value] = newFile

      console.log(dependencies)
    },
  })
  // console.log(ast.program.body)
  // console.log(dependencies)
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  })
  // console.log(code)
  return {
    filename,
    dependencies,
    code,
  }
}

// const moduleInfo = moduleAnalyser('./src/index.js')
// console.log(moduleInfo)

const makeDependenciesGraph = (entry) => {
  const entryModule = moduleAnalyser(entry)
  const graphArray = [entryModule]
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i]
    const { dependencies } = item
    // 如果有依赖就去循环依赖，dependencies实际是个对象
    if (dependencies) {
      for (let j in dependencies) {
        // 这里就会改变外面for循环length，就会继续循环
        graphArray.push(moduleAnalyser(dependencies[j]))
      }
    }
  }
  const graph = {}

  graphArray.forEach((item) => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code,
    }
  })
  return graph
  // console.log(graph)
}

// const graphInfo = makeDependenciesGraph('./src/index.js')
// console.log(graphInfo)

const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry))

  //require,exports转化，递归，闭包
  return `
    (function(graph){
        function require(module){
            function localRequire(relativePath){
                return require(graph[module].dependencies[relativePath])
            }
            var exports = {};
            (function(require,exports, code){
                eval(code)
            })(localRequire,exports,graph[module].code)
            return exports;
        }
        require('${entry}')
    })(${graph})
  `
}

const code = generateCode('./src/index.js')

console.log(code)

// 打印出的code就可以直接运行在浏览器
