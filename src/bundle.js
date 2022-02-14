(function(modules) {
	function require(path) {
		// 获取路径对应的方法
		const fn = modules[path]
		// 定义module
		const module = { exports: {} }
		// 调用函数
		fn(require, module, module.exports)
		// 返回module.exports
		return module.exports
	}
	// 调用入口文件
	require('./main.js')
})({

})
