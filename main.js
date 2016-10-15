enchant();

window.onload = function(){
	var game = new Core(528, 528);	// game display size
	game.fps = 60;					// frame per second
	game.preload("images/player.png", "images/map.png", "images/bomb.png");
    var gameFlow = new GameFlow(game);
	game.onload = function(){
        game.keybind(" ".charCodeAt(0), "space");
        gameFlow.start();
    }
	game.start();
};

class GameFlow{
    constructor(game){
        this.game = game;
        this.moveVector = [null, null];
        this.xCell = 1;
        this.yCell = 1;
    }

    start(){
        // this.game.pushScene(this.createPlayScene());
        var playScene = new Scene();
        var bg = this.createBgSprite();
        playScene.addChild(bg);
        var you = this.createPlayerSprite();
        you.x = 48;
        you.y = 48;
        playScene.addChild(you);
        this.game.pushScene(playScene);
        var bombs = [];
        playScene.addEventListener("enterframe", () => {
            if(you.x % you.width === 0 && you.y % you.height === 0){
                if(this.game.input.up){
                    this.moveVector = [0, -1];
                }else if(this.game.input.right){
                    this.moveVector = [+1, 0];
                }else if(this.game.input.down){
                    this.moveVector = [0, +1];
                }else if(this.game.input.left){
                    this.moveVector = [-1, 0];
                }else{
                    this.moveVector = [0, 0];
                }
                this.xCell = you.x;
                this.yCell = you.y;
            }
            if(bg.collisionDetection(this.xCell / you.width, this.yCell / you.height, this.moveVector)){
                you.move(this.moveVector);
            }
            if (this.game.input.space) {
                var bomb = this.createBombSprite(you.putBomb());
                playScene.addChild(bomb);
                bomb.startCount(() => {
                    playScene.removeChild(bomb);
                    var index = bombs.indexOf(bomb);
                    bombs.splice(index, 1);
                })
                bombs.push(bomb);
            }
            bombs.forEach((v) => {
                v.checkCount();
            })
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

        var colMap = [
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

        var sprite = new BackGround(map, colMap, [48, 48]);
        sprite.image = this.game.assets["images/map.png"];
        sprite.create();
        return sprite;
    }

    createPlayerSprite(){
        var sprite = new Player(48, 48);
        sprite.image = this.game.assets["images/player.png"];
        return sprite;
    }

    createBombSprite(coordinate){
        var sprite = new Bomb(coordinate, 48, 3*1000);
        // if(coordinate[0] !== null && coordinate[1] !== null){
            // var sprite = new Sprite(48, 48);
            // sprite.image = this.game.assets["images/bomb.png"];
            // sprite.flame = 0;
            // sprite.x = coordinate[0];
            // sprite.y = coordinate[1];
            // console.log("put");
        return sprite;
        // }
    }
}

class CollisionDetection{
    constructor(size){      // size: Number of Cell -> Array[width, height]
        this.colMap = [];
        for(var i = 1; i <= size[0]; i++){
            this.colMap[i] = [];
            for(var j = 1; j <= size[1]; j++){
                this.colMap[i].push(0);
            }
        }
    }

    update(){

    }

    check(){

    }
}

var a = new CollisionDetection([5, 5]);
console.log(a.colMap);

var Player = Class.create(Sprite, {
    initialize(x, y){
        Sprite.call(this, x, y);
        this.isMoving = false;
        this.current = [null, null];
        this.xCell = 1;
        this.yCell = 1;
        this.bomb = false;
        this.xBomb = 1;
        this.yBomb = 1;
        this.prevBombCoordinate = [null, null];
        this.bombPutThureshold = 3/4;
    },

    move(vec){
        if((vec[0] !== 0 || vec[1] !== 0) && ((this.current[0] === null && this.current[1] === null) || (vec[0] === -1 * this.current[0] || vec[1] === -1 * this.current[1]))){
            this.current = vec;
        }

        this.x += this.current[0];
        this.y += this.current[1];

        if(this.x % this.width === 0 && this.y % this.height === 0){
            this.current = [null, null];
            this.xCell = this.x / this.width;
            this.yCell = this.y / this.height;
        }
        //console.log(vec);
        //console.log(this.current);
    },

    putBomb(){
        // if(keyDown){
            if(this.x % this.width === 0 && this.y % this.height === 0){
                return [this.x, this.y];
            }else if((this.x % this.width) <= (this.width * this.bombPutThureshold) && (this.y % this.height) <= (this.height * this.bombPutThureshold)){
                return [this.xCell * this.width, this.yCell * this.height];
            }else if((this.x % this.width) > (this.width * this.bombPutThureshold) || (this.y % this.height) > (this.height * this.bombPutThureshold)){
                return [(this.xCell + this.current[0]) * this.width, (this.yCell + this.current[1]) * this.height];
            }else {
                throw new Error("fatal error");
            }

            /*
            this.prevBombCoordinate = [this.xBomb, this.yBomb];
            this.xBomb = this.xCell;
            this.yBomb = this.yCell;
            // console.log(this.prevBombCoordinate, [this.xBomb, this.yBomb]);

            return [this.xBomb, this.yBomb];
            // if(this.prevBombCoordinate[0] !== this.xBomb || this.prevBombCoordinate[1] !== this.yBomb){
            //     return [this.xBomb, this.yBomb];
            // }
            */
        // }else{
        //     return [null, null];
        // }
    },

    die(){

    }
});

var Bomb = Class.create(Sprite, {
    initialize(coordinate, size, time){
        Sprite.call(this, size, size);
        this.image = this.game.assets["images/bomb.png"];
        this.flame = 0;
        this.coordinate = coordinate;
        this.size = size;
        this.time = time;
        this.x = this.coordinate[0] * this.size[0];
        this.y = this.coordinate[1] * this.size[1];
        this.cb = null;
    },
    startCount(cb) {
        this.startTime = +new Date();
        this.cb = cb;
    },
    checkCount() {
        if (this.startTime + this.time > +new Date()) {
            if (this.cb) {
                this.cb(this);
                this.cb = null;
            }
        }        
    },
});

var BackGround = Class.create(Group, {
    initialize(map, colMap, size){
        Group.call(this);
        this.map = map;
        this.colMap = colMap;
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
    },

    collisionDetection(x, y, vec){
        return this.colMap[x + vec[0]][y + vec[1]] === 0;
    }
});