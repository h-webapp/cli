(function (Application) {
    Application.app('cube-search', function () {
        this.route = {
            path:'/cube-search',
            component:{
                template:'<cube-search-comp/>'
            }
        };
        this.resource = {
            js:['component/search.comp.js'],
            css:[],
            langFiles:['lang/comp.json']
        };
    },[],'search');
})(HERE.FRAMEWORK.Application);