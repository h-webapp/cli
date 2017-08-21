(function (Application) {
    Application.app('search', function () {
        this.route = {
            path:'/search',
            component:{
                template:'<search-comp/>'
            }
        };
        this.resource = {
            js:['component/search.comp.js'],
            css:[]
        };
    },[],'system');
})(HERE.FRAMEWORK.Application);