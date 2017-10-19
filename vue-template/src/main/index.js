(function (define,Application) {
    var routes = [];
    function buildRoute(routeOption){
        var route = {};
        route.path = routeOption.path;
        route.name = routeOption.name;
        route.redirect = routeOption.redirect;
        route.component = routeOption.component || {
                template:'<span>empty component</span>'
            };
        if(routeOption.children && routeOption.children.length > 0){
            route.children = routeOption.children.map(function (child) {
                return buildRoute(child);
            });
        }
        return route;
    }
    Application.apps().forEach(function (app) {
        var route;
        if(app.route && app.route.path){
            route = buildRoute(app.route);
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
    }).$mount('#main-app'));

})(HERE.FRAMEWORK.define,HERE.FRAMEWORK.Application);