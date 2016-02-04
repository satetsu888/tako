(function(){

/**
* @class phina.input.DeviceOrientation
* @extends phina.input.Input
*/

phina.define('phina.input.DeviceOrientation', {

    superClass: 'phina.input.Input',

    /**
    * @constructor
    */
    init: function(){
        var self = this;

        self.alpha = 0;
        self.beta  = 0;
        self.gamma = 0;

        window.addEventListener("deviceorientation", function(event){
            self.alpha = event.alpha;
            self.beta  = event.beta;
            self.gamma = event.gamma;
        });
    },

    getAlpha: function(){
        return this.alpha;
    },
    getBeta: function(){
        return this.beta;
    },
    getGamma: function(){
        return this.gamma;
    },

});

})();
