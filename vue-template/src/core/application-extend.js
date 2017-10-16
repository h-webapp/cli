(function (Application) {
    Application.component = function (id,definition) {
        if(definition === void 0){
            return function (resolve) {
                var def = Vue.component(id);
                if(typeof def === 'function'){
                    return def(resolve);
                }
                return resolve(def);
            };
        }
        return Vue.component.apply(Vue,arguments);
    };
    Application.prototype.component = function (id,definition) {
        if(typeof definition === 'object'){
            var templateUrl = definition['templateUrl'],
                cssUrl = definition['cssUrl'];
            delete definition['templateUrl'];
            delete definition['cssUrl'];
            if(!templateUrl && !cssUrl){
                return Vue.component.apply(Vue,arguments);
            }

            var resources = [];
            if(templateUrl){
                resources.push({
                    type:'text',
                    urls:[templateUrl]
                });
            }
            if(cssUrl){
                resources.push({
                    type:'css',
                    urls:[].concat(cssUrl)
                });
            }

            var _this = this;
            var callback = function (resolve) {
                _this.loadResource.apply(_this,resources).then(function (dataArray) {
                    if(templateUrl){
                        definition.template = dataArray.shift();
                    }
                    resolve(definition);
                });
            }
            return Vue.component(id,callback);
        }
        return Vue.component.apply(Vue,arguments);
    };
})(HERE.FRAMEWORK.Application);