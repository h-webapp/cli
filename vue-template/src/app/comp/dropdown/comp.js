(function (Application) {
    var app = Application.app('comp');
    app.ready(function () {
        var def = {
            templateUrl:'dropdown/comp.html',
            cssUrl:'dropdown/comp.css',
            data: function () {
                return {
                    mouseup:null,
                    collapsePending:false,
                    state:{},
                    collapse:true
                };
            },
            mounted: function () {
                this.mouseup = function () {
                    if(this.collapsePending){
                        this.collapsePending = false;
                        return;
                    }
                    this.collapse = true;
                }.bind(this);
                document.body.addEventListener('click',this.mouseup);
            },
            destroyed: function () {
                document.body.removeEventListener('click',this.mouseup);
            },
            methods:{
                toggleCollapse: function () {
                    this.collapse = !this.collapse;
                    this.collapsePending = true;
                    var menu = this.$refs['dropdown'];
                    this.$nextTick(function () {
                        menu.style.marginLeft = - menu.clientWidth / 2 + 'px';
                        this.$emit('click');
                    }.bind(this));
                }
            }
        };
        app.component('mg-dropdown',def);
    });
})(HERE.FRAMEWORK.Application);