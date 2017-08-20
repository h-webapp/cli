(function (define,Application) {
    var routes = [];
    Application.apps().forEach(function (app) {
        var route = {};
        if(app.route && app.route.path){
            route.path = app.route.path;
            route.component = app.route.component || {
                    template:'<span>empty component</span>'
                };
            route.beforeEnter = function (to,from,next) {
                app.load().then(function () {
                    next();
                });
            };
            routes.push(route);
        }
    });
    var router = new VueRouter({
        routes:routes
    });
    define('main',new Vue({
        router:router
    }).$mount('#deepClue-app'));

})(HERE.FRAMEWORK.define,HERE.FRAMEWORK.Application);