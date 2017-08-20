(function (Application) {
    var app = Application.app('common-comp');
    app.ready(function () {

        Vue.component('iframe-comp',{
            template:'<iframe class="iframe-comp" :src="url"></iframe>',
            props:['url'],
            data: function () {
                return {

                };
            }
        });
    });
})(HERE.FRAMEWORK.Application);