(function ($,Register,Module) {
    var configPath = 'env/applications.json';
    var register = Register.getInstance();
    $.getJSON(configPath, function (data) {
        register.main = data.main;
        register.apps = data.apps;
        register.modules = data.modules;
        register.load().then(function () {
            initEnvironment(data);
        });
    });
    function initEnvironment(data){
        Module.module('env').getService('environment').updateEnvironment(data);
    }
})(jQuery,HERE.FRAMEWORK.Register,HERE.FRAMEWORK.Module);