(function ($,Module) {
    Module.module('http').service('httpService', function () {
        this.send = function (request) {
            return $.ajax({
                method:request.method || 'GET',
                url:request.url
            });
        };
        this.post = function (url,data) {
            var request = {
                url:url,
                method:'POST',
                data:data
            };
            return this.send(request);
        };
        this.getJSON = function (url) {
            return $.getJSON(url);
        };
    });;
})(jQuery,HERE.FRAMEWORK.Module);