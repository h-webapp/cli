(function (Application) {
    Application.app('info-dialog', function () {
        this.route = {
            path:'/info-dialog',
            component:{
                template:'<iframe-comp url="core/base/info-dialog/example/index.html"/>'
            }
        };
        this.resource = {
            js:[],
            css:[]
        };
        this.name('提示对话框');
    },[],['common-comp']);
})(HERE.FRAMEWORK.Application);