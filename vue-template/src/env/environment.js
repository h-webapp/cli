(function (define,ResourceLoader,Register,Module) {
    var body = document.body;
    var loadingTimeout,loadingCount = 0;
    function isResource(data){
        return /\.(js|css|json)$/.test(data && data.url);
    }
    var deferTime = 300;
    ResourceLoader.addEventListener('loadStart', function (e) {
        if(!isResource(e)){
            return;
        }
        loadingCount++;
        if(loadingTimeout){
            clearTimeout(loadingTimeout);
        }
        loadingTimeout = setTimeout(function () {
            body.setAttribute('loading-resource',true);
        },deferTime);
    });
    ResourceLoader.addEventListener('loadFinished', function (e) {
        if(!isResource(e)){
            return;
        }
        loadingCount--;
        if(loadingCount === 0){
            clearTimeout(loadingTimeout);
            loadingTimeout = setTimeout(function () {
                body.setAttribute('loading-resource',false);
            },deferTime);
        }
    });
    var configPath = 'env/applications.json';
    var register = Register.getInstance();
    ResourceLoader.load({
        type:'json',
        urls:[configPath]
    }).then(function (dataArray) {
        var data = dataArray[0];
        register.setNeedLoad(!data.release || !data.concat);
        register.apps(data.apps);
        register.modules(data.modules);
        Promise.all([register.register(), ResourceLoader.load({
            type:'js',
            urls:[data.main]
        })]).then(function () {
            var init = define('init');
            if(typeof init === 'function'){
                init();
            }
            initEnvironment(data);
        });
    });
    function initEnvironment(data){
        var environment = Module.module('env').getService('environment');
        environment.updateEnvironment(data);
    }
    function preLoad(){
        var slice = Array.prototype.slice;
        var resources = slice.call(document.querySelectorAll('resource[pre-url]'));
        var resource = {
            js:[],
            css:[]
        };
        var timeout;
        var unUsedNodes = [];
        function removeNodes(){

            unUsedNodes.forEach(function (node) {
                if(node.remove){
                    return node.remove();
                }else if(node.parentNode){
                    node.parentNode.removeChild(node);
                }
            });
        }
        function removeNode(node){
            unUsedNodes.push(node);
            if(timeout){
                clearTimeout(timeout);
            }
            timeout = setTimeout(removeNodes,10);
        }
        resources.forEach(function (el) {
            var src = el.getAttribute('pre-url');
            var type = el.getAttribute('type');
            if(!resource[type]){
                return;
            }
            resource[type].push(src);
            removeNode(el);
        });
        ResourceLoader.load([
            {
                type:'js',
                urls:resource.js
            },
            {
                type:'css',
                urls:resource.css
            }
        ]);
    }
    setTimeout(preLoad);
})(HERE.FRAMEWORK.define,HERE.ResourceLoader,HERE.FRAMEWORK.Register,HERE.FRAMEWORK.Module);