(function (Application) {
    Application.app('menu', function () {
        this.route = {
            path:'/menu',
            component:{
                template:'<iframe-comp url="core/base/annular-menu/example/index.html"/>'
            }
        };
        this.resource = {
            js:[],
            css:[]
        };
        this.name('环形菜单');
    },[],['common-comp']);
})(HERE.FRAMEWORK.Application);