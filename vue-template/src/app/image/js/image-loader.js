(function (Application) {
    var app = Application.app('image');
    app.service('ImageLoader', function () {
        var queues = [],
            loading = [];
        var max = 3;
        this.load = function (url) {
            var p = new Promise(function (resolve,reject) {
                queues.push({
                    url:url,
                    resolve:resolve,
                    reject:reject
                });
                loop();
            });
            return p;
        };
        function loadImage(item){
            var url = item.url;
            var resolve = item.resolve,
                reject = item.reject;
            var image = new Image();
            image.onload = function () {
                resolve(image);
                loading.splice(loading.indexOf(image),1);
                loop();
            };
            image.onerror = function () {
                reject(image);
                loading.splice(loading.indexOf(image),1);
                loop();
            };
            image.src = url;
            loading.push(image);
        }
        function loop(){
            var item;
            while(loading.length <= max && (item = queues.shift())){
                loadImage(item);
            }
        }
    });
})(HERE.FRAMEWORK.Application);