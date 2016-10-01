enchant();

window.onload = function(){
	var game = new Core(528, 528);	// game display size
	game.fps = 30;					// frame per second
	game.preload("images/player.png", "images/map.png");
    var gameFlow = new GameFlow(game);
	game.onload = function(){
        gameFlow.start();
    }
	game.start();
};

class GameFlow{
    constructor(game){
        this.game = game;
    }

    start(){
        // this.game.pushScene(this.createPlayScene());
        var playScene = new Scene();
        playScene.addChild(this.createBgSprite());
        var you = this.createPlaySprite();
        you.x = 48;
        you.y = 48;
        playScene.addChild(you);
        this.game.pushScene(playScene);
        playScene.addEventListener("enterframe", () => {
            you.move(this.game.input.up, this.game.input.right, this.game.input.down, this.game.input.left);
            if(this.game.input.space){
                console.log("put a bomb");
            }
        });
    }

    createBgSprite(){
        var map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        var sprite = new BackGround(map, [48, 48]);
        sprite.image = this.game.assets["images/map.png"];
        sprite.create();
        return sprite;
    }

    createPlaySprite(){
        var sprite = new Player(48, 48);
        sprite.image = this.game.assets["images/player.png"];
        return sprite;
    }
}

var Player = Class.create(Sprite, {
    initialize(x, y){
        Sprite.call(this, x, y);
        this.isMoving = false;
        this.current = [null, null];
    },

    move(up, right, down, left){
        //console.log(up, right, down, left);
        if(up){
            this._moveTo([0, -1]);
        }else if(right){
            this._moveTo([+1, 0]);
        }else if(down){
            this._moveTo([0, +1]);
        }else if(left){
            this._moveTo([-1, 0]);
        }else{
            this._moveTo([0, 0]);
        }
    },

    _moveTo(vec){
        if((vec[0] !== 0 || vec[1] !== 0) && ((this.current[0] === null && this.current[1] === null) || (vec[0] === -1 * this.current[0] || vec[1] === -1 * this.current[1]))){
            this.current = vec;
        }
        //console.log(vec, this.current);

        this.x += this.current[0];
        this.y += this.current[1];

        if(this.x % this.width === 0 && this.y % this.height === 0){
            this.current = [null, null];
        }
        //console.log(vec);
        console.log(this.current);
    }
});

var BackGround = Class.create(Group, {
    initialize(map, size){
        Group.call(this);
        this.map = map;
        this.size = size;
        this.image = null;
    },

    create(){
        if (!this.image) { throw new Error("image is not specified."); }
        this.map.forEach((row, y) => {
            row.forEach((cel, x) => {
                var tile = new Sprite(this.size[0], this.size[1]);
                tile.image = this.image;
                tile.frame = cel;
                tile.x = x * this.size[0];
                tile.y = y * this.size[1];
                this.addChild(tile);
            });
        });
    }
});