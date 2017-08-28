(function (Application) {
    var app = Application.app('cube-search');
    app.ready(function () {

        var loginService = app.getService('loginService');
        var langService = app.getService('language');
        Vue.component('cube-search-comp',{
            template:'<span><span>{{homepage}}</span>-cube search app,current user:{{loginInfo.userName}}</span>',
            data: function () {
                return {
                    loginInfo:{
                        userName:'loading-cube...'
                    }
                };
            },
            computed: {
                homepage: function () {
                    return langService.getLangText('homepage');
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