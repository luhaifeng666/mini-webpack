import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from 'babel-core'

// 模块id
let id = 0

function createAssets (sourcePath) {
	// 获取文件内容
	const source = fs.readFileSync(sourcePath, {
		encoding: 'utf-8'
	})

	// 获取依赖关系
	// 转换成AST
	const ast = parser.parse(source, {
		sourceType: 'module'
	})
	// 获取目标节点
	const deps = [] // 储存依赖关系
	traverse.default(ast, {
		ImportDeclaration({ node }) {
			// 获取路径信息
			deps.push(node.source.value)
		}
	})

	// 转换代码为ejs规范
	const { code } = transformFromAst(ast, null, {
		presets: ["env"]
	})

	return {
		code,
		deps,
		filePath: sourcePath,
		mapping: {},
		id: id++
	}
}

// 生成依赖树（图）
function createGraph() {
	// 获取入口文件的依赖信息
	const mainAssets = createAssets('./src/index.js')

	// 依赖队列
	const queue = [mainAssets]

	// 递归入口文件的依赖信息，生成依赖图
  for (const asset of queue) {
		// 遍历路径
		asset.deps.forEach(relativePath => {
			const child = createAssets(path.resolve('./src', relativePath))
			asset.mapping[relativePath] = child.id
			queue.push(child)
		})
  }

	return queue
}

const graph = createGraph()

// 打包
function build (graph) {
	// 获取ejs模板
	const template = fs.readFileSync('./bundle.ejs', {
		encoding: 'utf-8'
	})
	// 获取转译后的代码以及代码路径
	const data = graph.map(asset => {
		const { id, code, mapping } = asset
		return { id, code, mapping }
	})

	const code = ejs.render(template, { data })

	fs.writeFileSync('./dist/bundle.js', code)
}

build(graph)
