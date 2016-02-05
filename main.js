phina.globalize();

phina.define('MainScene', {
    superClass: 'CanvasScene',
    init: function() {
        this.superInit();

        this.orientation = DeviceOrientation();


        this.floors = CanvasElement().addChildTo(this);
        for(var i = 0; i < 4; i++){
            var floor = this._createFloor(null, 16 - i * 4);
            floor.addChildTo(this.floors);
        }

        this.player = Tako().addChildTo(this);
        this.player.setPosition(this.gridX.center(), 0);

    },

    update: function(){
        var self = this;
        this.floors.children.some(function(floor){
            if(self._standTest(self.player, floor)){
                self.player.ground(floor);
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

        this.player.move(this.orientation.getGamma() * 0.1);
    },

    _createFloor: function(xspan, yspan){
        var xspan = xspan || 1 + Math.floor(Math.random() * 14);
        var yspan = yspan || 16;
        var floor = Floor(this.gridX.span(xspan), this.gridX.span(yspan), this.gridX.width * 0.3);
        floor.addChildTo(this);
        return floor;
    },

    _standTest: function(tako, floor){
        // 雑な当たり判定なのであとでちゃんと直す！！
        return tako.hitTestElement(floor) && tako.bottom <= floor.bottom ? true : false;
    },
});

phina.define("Tako",{
    superClass: "phina.display.Sprite",

    init: function () {
        var SCALE = 0.5;
        this.superInit("tako", 160 * SCALE, 200 * SCALE);

        this.srcRect = {
            x: 0,
            y: 0,
            width: this.width / SCALE,
            height: this.height / SCALE,
        };

        this.pow = 0;
        this.stand = false;
        this.standingObject = null;
    },

    ground: function(obj){
        this.physical.force(0, 0);
        this.physical.gravity.set(0, 0);
        this.stand = true;
        this.standingObject = obj;
    },
    air: function(){
        this.physical.gravity.set(0, 0.98);
    },


    charge: function(){
        this.pow++;
    },

    jump: function(){
        if(!this.stand) return;
        this.physical.addForce(0, -this.pow);
        this.pow = 0;
        this.stand = false;
        if(this.standingObject){
            this.standingObject.kicked(this);
        }
    },
    
    move: function(xforce){
        if(this.stand) return;

        var FORCE_LIMIT = 7;

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

    kicked: function(element){
        this.remove(); 
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
