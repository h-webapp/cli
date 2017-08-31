(function (ResourceLoader,Register,Module) {
    var configPath = 'env/applications.json';
    var register = Register.getInstance();
    ResourceLoader.load({
        type:'json',
        urls:[configPath]
    }).then(function (dataArray) {
        var data = dataArray[0];
        register.apps = data.apps;
        register.modules = data.modules;
        register.afterLoadResource = {
            type:'js',
            urls:[data.main]
        };
        register.register().then(function () {
            initEnvironment(data);
        });
    });
    function initEnvironment(data){
        Module.module('env').getService('environment').updateEnvironment(data);
    }
})(HERE.ResourceLoader,HERE.FRAMEWORK.Register,HERE.FRAMEWORK.Module);