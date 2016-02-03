phina.globalize();

phina.define('MainScene', {
    superClass: 'CanvasScene',
    init: function() {
        this.superInit();

        this.player = Tako().addChildTo(this);
        this.player.setPosition(this.gridX.center(), 0);

        this.floor = RectangleShape({width: this.gridX.width, height: 300}).addChildTo(this);
        this.floor.setPosition(this.gridX.center(), this.gridY.width);
    },

    update: function(){
        if(this.player.hitTestElement(this.floor)){
            this.player.ground();
            this.player.bottom = this.floor.top;
        } else {
            this.player.air();
        }

        if(this.app.pointer.getPointing()){
            this.player.charge();
        } else if(this.app.pointer.getPointingEnd()){
            this.player.jump();
        }
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
