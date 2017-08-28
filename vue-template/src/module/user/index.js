(function (Module) {
    Module.module('user', function () {
        this.resource = {
            js:['js/userService.js'],
            langFiles:['lang/comp.json','lang/user.json']
        };
    },['env','http']);
})(HERE.FRAMEWORK.Module);