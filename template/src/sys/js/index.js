var program = document.querySelector('iframe');
var input = document.querySelector('#urlInput');
input.value = location.protocol + '//' + location.host + '/index.html';
var timeout;
function checkLoad(){
    clearTimeout(timeout);
    var define;
    try{
        define = program.contentWindow.HERE.FRAMEWORK.define;
        if(define && define('main')){
            programLoaded();
            return;
        }
    }catch(e){

    }
    timeout = setTimeout(checkLoad,300);
}
checkLoad();
function programLoaded(){

    var config = statistics();
    var model = new go.Model.fromJson(config);
    var diagram = new Diagram({
        container:'statistics',
        model:model
    });
    diagram.render();
}
function refreshUrl(){
    program.src = input.value;
    checkLoad();
}