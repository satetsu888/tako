phina.globalize();

phina.define('MainScene', {
    superClass: 'CanvasScene',
    init: function() {
        this.superInit();

        this.orientation = DeviceOrientation();

        this.floors = Floors(this).addChildTo(this);

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


    _standTest: function(tako, floor){
        // 雑な当たり判定なのであとでちゃんと直す！！
        return tako.hitTestElement(floor) && tako.bottom <= floor.bottom ? true : false;
    },
});

phina.define("Tako",{
    superClass: "phina.display.Sprite",

    init: function () {
        var SCALE = 0.5;
        this.superInit("tako");
        var self = this;
        self.width = 160 * SCALE;
        self.height = 200 * SCALE;


        self.pow = 0;
        self.tweener.call(function(){
            console.log("call" + self.pow);
            console.log(self.tweener._tasks);
            if(self.pow <= 0){
                self.tweener._tasks = [self.tweener._tasks[0]];
                self.tweener.wait(1);
            } else { 
                self.tweener._tasks = [self.tweener._tasks[0]];
                self.tweener.fadeOut(self.animationTime()).fadeIn(self.animationTime()).play();
            }
        }).setLoop(true);

        self.stand = false;
        self.standingObject = null;
    },

    animationTime: function(){
        return 101 - (this.pow * 2);
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
        var self = this;
        if(self.pow < 50){
            self.pow++;
        }
    },

    jump: function(){
        this.tweener.set({alpha: 1.0});
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

phina.define("Floors", {
    superClass: "phina.display.CanvasElement",

    init: function(scene){
        this.superInit();
        this.scene = scene;

        this.speed = 1;

        for(var i = 0; i < 4; i++){
            var floor = this.createFloor(null, 16 - i * 4);
            floor.addChildTo(this);
        }
    },

    update: function(app){
        var self = this;
        this.children.forEach(function(floor){
            floor.y -= self.speed;
        });

        if(app.frame % 200 == 0){
            var floor = this.createFloor();
            floor.addChildTo(this);
        }
    },

    createFloor: function(xspan, yspan){
        var xspan = xspan || 1 + Math.floor(Math.random() * 14);
        var yspan = yspan || 16;
        var scene = this.scene;
        var floor = Floor(scene.gridX.span(xspan), scene.gridY.span(yspan), scene.gridX.width * 0.3);
        return floor;
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
