(function () {
    var contentEl = document.querySelector('.statistics');
    var input = document.querySelector('#urlInput');
    input.value = location.protocol + '//' + location.host + '/index.html';

    var program;
    var timeout;
    function checkLoad(){
        clearTimeout(timeout);
        var define;
        if((define = program.contentWindow) && (define = define.HERE) && (define = define.FRAMEWORK)){
            try{
                define = define.define;
                if(define && define('main')){
                    programLoaded();
                    return;
                }
            }catch(e){
                console.error(e);
            }
        }
        timeout = setTimeout(checkLoad,300);
    }
    function programLoaded(){
        contentEl.innerHTML = '';
        var el = document.createElement('div');
        el.id = 'statistics';
        contentEl.appendChild(el);
        var config = statistics(program.contentWindow);
        var model = new go.Model.fromJson(config);
        var diagram = new Diagram({
            container:'statistics',
            model:model
        });
        diagram.render();
    }
    window.refreshUrl = function(){
        if(program && program.parentNode){
            if(program.remove){
                program.remove();
            }else{
                program.parentNode.removeChild(program);
            }
        }
        program = document.createElement('iframe');
        program.src = input.value;
        document.body.appendChild(program);
        checkLoad();
    };

    window.refreshUrl();
})();