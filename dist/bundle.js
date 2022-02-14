(function(modules) {
    function require(id) {
        // 获取路径对应的方法
        const [ fn, mapping ] = modules[id]
        // 转换
        function localRequire(filePath) {
            const id = mapping[filePath]
            return require(id)
        }
        // 定义module
        const module = { exports: {} }
        // 调用函数
        fn(localRequire, module, module.exports)
        // 返回module.exports
        return module.exports
    }
    // 调用入口文件
    require(0)
})({
    
        0: [function(require, module, exports) {
            "use strict";

var _add = require("./add.js");

var _add2 = _interopRequireDefault(_add);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var num1 = 1;
var num2 = 2;
console.log((0, _add2.default)(num1, num2));
        }, {"./add.js":1}],
    
        1: [function(require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function add(a, b) {
  return a + b;
}

exports.default = add;
        }, {}],
    
})
