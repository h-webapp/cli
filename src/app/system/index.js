(function (Application) {
    Application.app('system', function () {
        this.resource = {
            js:['service/loginService.js'],
            css:[]
        };
    },['env','user']);
})(HERE.FRAMEWORK.Application);