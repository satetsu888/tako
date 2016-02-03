phina.globalize();

phina.define('MainScene', {
    superClass: 'CanvasScene',
    init: function() {
        this.superInit();


        this.floors = [];
        for(var i = 0; i < 4; i++){
            this.floors.push(this._createFloor(null, 16 - i * 4));
        }
        console.log(this.floors);

        this.player = Tako().addChildTo(this);
        this.player.setPosition(this.gridX.center(), 0);

    },

    update: function(){
        var self = this;
        this.floors.forEach(function(floor){
            if(self.player.hitTestElement(floor)){
                self.player.ground();
                self.player.bottom = floor.top;
            } else {
                self.player.air();
            }
        });

        if(this.app.pointer.getPointing()){
            self.player.charge();
        } else if(this.app.pointer.getPointingEnd()){
            self.player.jump();
        }
    },

    _createFloor: function(xspan, yspan){
        var floor = RectangleShape({width: this.gridX.width * 0.3, height: 10}).addChildTo(this);
        var xspan = xspan || 1 + Math.floor(Math.random() * 14);
        var yspan = yspan || 16;
        floor.setPosition(this.gridX.span(xspan), this.gridY.span(yspan));
        return floor;
    },
});

phina.define("Tako",{
    superClass: "phina.display.Sprite",

    init: function () {
        this.superInit("tako", 160, 200);
        this.setScale(1);
        this.pow = 0;
        this.stand = false;
    },
    update: function(){

    },

    ground: function(){
        this.physical.force(0, 0);
        this.physical.gravity.set(0, 0);
    },
    air: function(){
        this.physical.gravity.set(0, 0.98);
    },


    charge: function(){
        this.pow++;
    },

    jump: function(){
        this.physical.force(0, -this.pow);
        this.pow = 0;
        this.stand = false;
    },

});


phina.main(function() {
    var app = GameApp({
        startLabel: 'main',
        assets: {
            image: {
                tako: "assets/tako.jpg"
            },
        },
    });

    app.run();
});
