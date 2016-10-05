enchant();

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

window.onload = function(){
	var game = new Core(528, 528);	// game display size
	game.fps = 30;					// frame per second
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
            this.createBombSprite(you.putBomb(this.game.input.space));
        });
    }

    createBgSprite(){
        // var map = [
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        // ];
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

    createBombSprite(coordinate){
        if(coordinate[0] !== null && coordinate[1] !== null){
            var sprite = new Sprite(48, 48);
            sprite.image = this.game.assets["images/bomb.png"];
            sprite.flame = 0;
            sprite.x = coordinate[0];
            sprite.y = coordinate[1];
            console.log("put");
            return sprite;
        }
    }
}

var Player = Class.create(Sprite, {
    initialize(x, y){
        Sprite.call(this, x, y);
        this.isMoving = false;
        this.current = [null, null];
        this.xCell = 1;
        this.yCell = 1;
        this.xColDet = 1;
        this.yColDet = 1;
        this.bomb = false;
        this.xBomb = 1;
        this.yBomb = 1;
        this.prevBombCoordinate = [null, null];
        this.bombPutThureshold = 3/4;
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
        this.xCell = this.x / this.width;
        this.yCell = this.y / this.height;
        
        if(this.x % this.width === 0 && this.y % this.height === 0){
            this.xColDet = this.xCell;
            this.yColDet = this.yCell;
        }
        //console.log(this.xColDet + ", " + this.yColDet);

        if(map[this.xColDet + this.current[0]][this.yColDet + this.current[1]] === 1){
            this.current = [null, null];    //If cell of "map" you're going to has "1", turn your deplacement 0.
        }

        //console.log(this.xCell + ", " + this.yCell);

        this.x += this.current[0];
        this.y += this.current[1];

        if(this.x % this.width === 0 && this.y % this.height === 0){
            this.current = [null, null];
        }
        //console.log(vec);
        //console.log(this.current);
    },

    putBomb(keyDown){
        if(keyDown){
            if(this.x % this.width === 0 && this.y % this.height === 0){
                return [this.x / this.width, this.y / this.height];
            }else if((this.x % this.width) <= (this.width * this.bombPutThureshold) && (this.y % this.height) <= (this.height * this.bombPutThureshold)){
                return [this.xColDet, this.yColDet];
            }else if((this.x % this.width) > (this.width * this.bombPutThureshold) || (this.y % this.height) > (this.height * this.bombPutThureshold)){
                return [this.xColDet + this.current[0], this.yColDet + this.current[1]];
            }

            /*
            this.prevBombCoordinate = [this.xBomb, this.yBomb];
            this.xBomb = this.xColDet;
            this.yBomb = this.yColDet;
            // console.log(this.prevBombCoordinate, [this.xBomb, this.yBomb]);

            return [this.xBomb, this.yBomb];
            // if(this.prevBombCoordinate[0] !== this.xBomb || this.prevBombCoordinate[1] !== this.yBomb){
            //     return [this.xBomb, this.yBomb];
            // }
            */
        }else{
            return [null, null];
        }
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