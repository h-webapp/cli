(function (Application) {
    Application.app('system').service('loginService', ['userService',function (userService) {
        this.getLoginInfo = function () {
            return userService.getUserById('userId_' + Math.random());
        };
    }]).service('systemService',function(){


    });
})(HERE.FRAMEWORK.Application);