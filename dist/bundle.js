
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
        })({
        1: [
            function(require, module, exports) {
                "use strict";

var _log = _interopRequireDefault(require("./helper/log"));

var _select = _interopRequireDefault(require("./helper/select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// const es = require('./helper/gua')
var bindEventLogin = function bindEventLogin() {
  var button = (0, _select["default"])('#id-button-login');
  var box = (0, _select["default"])('.gua-box');
  button.addEventListener('click', function (event) {
    box.classList.add('pink');
  });
};

var bindEvents = function bindEvents() {
  bindEventLogin();
};

var __main = function __main() {
  bindEvents();
};

__main();
            },
            {"./helper/log":2,"./helper/select":3}
        ],
    
        2: [
            function(require, module, exports) {
                "use strict";

var log = console.log.bind(console);
module.exports = log;
            },
            {}
        ],
    
        3: [
            function(require, module, exports) {
                "use strict";

var e = function e(selector) {
  return document.querySelector(selector);
};

module.exports = e;
            },
            {}
        ],
    })
    