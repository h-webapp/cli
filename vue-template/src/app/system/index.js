(function (Application) {
    Application.app('system', function () {
        this.route = {
            path:'/',
            redirect:'search'
        };
        this.resource = {
            js:['service/loginService.js'],
            css:[]
        };
    },['env','user']);
})(HERE.FRAMEWORK.Application);