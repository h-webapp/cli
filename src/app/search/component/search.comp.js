(function (Application) {
    var app = Application.app('search');
    app.ready(function () {
        var loginService = app.getService('loginService');
        var userService = app.getService('userService');
        var env = app.getService('environment');
        Vue.component('search-comp',{
            template:'<div><span>{{welcome}}</span>:<span>search app,current user:{{loginInfo.userName}}</span>' +
            '<ul><li v-for="(value,key) in attributes">{{key}}:{{value}}</li></ul></div>',
            data: function () {
                return {
                    loginInfo:{
                        userName:'loading...'
                    }
                };
            },
            computed:{
                attributes: function () {
                    return env.attributes();
                },
                welcome: function () {
                    return userService.getHomepage();
                }
            },
            created: function () {
                var _this = this;
                loginService.getLoginInfo().then(function (loginInfo) {
                    _this.loginInfo = loginInfo;
                });
            }
        });
    });

})(HERE.FRAMEWORK.Application);