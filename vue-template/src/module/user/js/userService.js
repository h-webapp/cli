(function (Module) {
    Module.module('user').service('userService', ['httpService','language',function (httpService,language) {
        this.getUserById = function (userId) {
            return httpService.post('/user/' + userId).then(function (data) {
                return data;
            });
        };
        this.getHomepage = function () {
            return language.getLangText('homepage') + '-' + language.getLangText('user');
        }
    }]);
})(HERE.FRAMEWORK.Module);