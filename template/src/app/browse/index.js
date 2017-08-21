(function (Application) {
    Application.app('browse', function () {
        this.route = {
            path:'/browse',
            component:{
                template:'<browse-comp/>'
            }
        };
        this.resource = {
            js:['component/browse.comp.js']
        };
        this.name('浏览');
    },[],'system');
})(HERE.FRAMEWORK.Application);