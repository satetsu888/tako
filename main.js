phina.globalize();

phina.define('MainScene', {
    superClass: 'CanvasScene',
    init: function() {
        this.superInit();

        this.orientation = DeviceOrientation();


        this.floors = [];
        for(var i = 0; i < 4; i++){
            this.floors.push(this._createFloor(null, 16 - i * 4));
        }

        this.player = Tako().addChildTo(this);
        this.player.setPosition(this.gridX.center(), 0);

    },

    update: function(){
        var self = this;
        this.floors.forEach(function(floor){
            if(self._standTest(self.player, floor)){
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

        this.player.move(this.orientation.getGamma());
    },

    _createFloor: function(xspan, yspan){
        var xspan = xspan || 1 + Math.floor(Math.random() * 14);
        var yspan = yspan || 16;
        var floor = Floor(this.gridX.span(xspan), this.gridX.span(yspan), this.gridX.width * 0.3);
        floor.addChildTo(this);
        return floor;
    },

    _standTest: function(tako, floor){
        return tako.hitTestElement(floor) && tako.bottom <= floor.bottom ? true : false;
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

    ground: function(){
        this.physical.force(0, 0);
        this.physical.gravity.set(0, 0);
        this.stand = true;
    },
    air: function(){
        this.physical.gravity.set(0, 0.98);
    },


    charge: function(){
        this.pow++;
    },

    jump: function(){
        this.physical.force(this.physical.velocity.x, -this.pow);
        this.pow = 0;
        this.stand = false;
    },
    
    move: function(xforce){
        if(this.stand) return;

        var FORCE_LIMIT = 10;

        xforce = Math.min(xforce, FORCE_LIMIT);
        xforce = Math.max(xforce, -FORCE_LIMIT);

        this.physical.force(xforce, this.physical.velocity.y);
    },

});

phina.define("Floor", {
    superClass: "phina.display.RectangleShape",

    init: function(x, y, width){
        this.superInit({width: width, height: 30});
        this.setPosition(x, y);
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
