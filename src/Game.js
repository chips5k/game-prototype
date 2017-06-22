import Player from './Player';
import Path from './Path';
import BoundingBox from './BoundingBox';
import Edge from './Edge';
import Vector from './Vector';
import RigidBody from './RigidBody';
import tilesheet from './images/tilesheet.png';

export default function Game(document) {
    let self = this;

    self.currentHeight = 400;
    self.currentWidth = 600;

    self.canvas = document.createElement('canvas');
    self.canvas.width = self.currentWidth;
    self.canvas.height = self.currentHeight;

    document.body.appendChild(self.canvas);
    
    self.ctx = self.canvas.getContext('2d');
    
    self.startTimestamp = self.getTimestamp();
    self.currentTickTimestamp = self.startTimestamp;
    self.lastTickTimestamp = self.startTimestamp;
    self.numTicks = 0;
    self.tickTimestep = 16;//milliseconds
    self.keyMap = {};

    self.spriteSheet = null;                
    
    self.viewport = {
        x: 0, 
        y: 0,
        width: 600,
        height: 400
    };

    self.imageMap = [
        { x: 0, y: 63 },
        { x: 63, y: 0 },
        { x: 0, y: 0 },
        { x: 127, y: 0},
        { x: 127, y: 63 }
    ];

    self.player = new Player(new Vector(264,264));
    
    

    self.tileRigidBodies = {
        // '1': new RigidBody([
        //     new ConstrainedPath(new Vector(0, 0), new Vector(0, 64)),
        //     new ConstrainedPath(new Vector(0, 64), new Vector(64, 64)),
        //     new ConstrainedPath(new Vector(64, 64), new Vector(0, 0))
        // ]),
        // '2': new RigidBody([
        //     new ConstrainedPath(new Vector(0, 0), new Vector(0, 64)),
        //     new ConstrainedPath(new Vector(0, 64), new Vector(64, 64)),
        //     new ConstrainedPath(new Vector(64, 64), new Vector(0, 0))
        // ]),
        // '4': new RigidBody([
        //     new ConstrainedPath(new Vector(0, 0), new Vector(0, 64)),
        //     new ConstrainedPath(new Vector(0, 64), new Vector(64, 64)),
        //     new ConstrainedPath(new Vector(64, 64), new Vector(0, 0))
        // ])
    };

    self.scene = [
        [
            [
                { z: 0, image: 1, collidable: true},
                { z: 0, image: 2, collidable: true},
                { z: 0, image: 1, collidable: true},
                { z: 0, image: 1, collidable: true},
                { z: 0, image: 1, collidable: true},
                { z: 0, image: 2, collidable: true},
                { z: 0, image: 1, collidable: true},
                { z: 0, image: 2, collidable: true},
                { z: 0, image: 3, collidable: true},
            ],
            [
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},  
            ],
            [
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},  
            ]
        ],
        [
            [
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
                { z: 0, image: null, collidable: false},
            ], 
            [
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 4, collidable: true},  
            ],
            [
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 0, collidable: false},
                { z: 0, image: 4, collidable: true},  
            ],
        ]
        
    ];

}

Game.prototype.loadAssets = function() {
    let self = this;

    return new Promise(function(resolve, reject) {
        
        self.spriteSheet = new Image();
        self.spriteSheet.src = tilesheet;
        
        self.spriteSheet.addEventListener('load', function() {
            resolve();
        });
    });

}

Game.prototype.run = function() {
    let self = this;
    self.registerListeners();

    

    
    self.loadAssets().then(function() {
        
        self.tick();
    })
}

Game.prototype.getTimestamp = function() {
    let self = this;

    return window.performance.now();
}

Game.prototype.tick = function() {
    let self = this;

    self.numTicks++;
    self.lastTickTimestamp = self.currentTickTimestamp;
    self.currentTickTimestamp = self.getTimestamp();

    window.requestAnimationFrame(self.tick.bind(self));

    //calculated time elapsed since last tick
    self.accumulatedSinceLastTick = self.currentTickTimestamp - self.lastTickTimestamp;

    while(self.accumulatedSinceLastTick >= 16) {
        self.accumulatedSinceLastTick--;
        self.processInput();
        self.processPhysics();
        
    }

    //Render scene
    self.clearCanvas();
    //Need to interpolate physics state based on any remaining time to smooth things out
    self.renderScene();
    self.renderUi();
    
}

Game.prototype.processInput = function() {
    let self = this;

    let edge = self.player.boundingBox.path.edges[0];
    let direction = Vector.subtract(edge.path[1], edge.path[0]).normalize();
    

    if(self.keyMap['s']) {
        self.player.translate(new Vector(0, 1));
        
        self.player.boundingBox.path.correctEdges();

    }

    if(self.keyMap['w']) {
        self.player.translate(new Vector(0, -1));
        
        self.player.boundingBox.path.correctEdges();

    }

    if(self.keyMap['a']) {
        self.player.translate(new Vector(-1, 0));
        
        self.player.boundingBox.path.correctEdges();

    }

    if(self.keyMap['d']) {
        self.player.translate(new Vector(1, 0));
        
        self.player.boundingBox.path.correctEdges();

    }
}


Game.prototype.findTileCoordinates = function(pX, pY) {
    let self = this;
    let points = {
        'topLeft': {pX: pX, pY: pY},
        'bottomRight': {pX: pX + 64, pY: pY + 64},
        'topRight': {pX: pX + 64, pY: pY},
        'bottomLeft': {pX: pX, pY: pY + 64} 
    }
    
    let keys = Object.keys(points);
    for(let i in keys) {
        let key = keys[i];
        let tX = points[key].pX / 64;
        let tY = points[key].pY / 64;
        
        
        let iTx = parseInt(tX);
        let iTy = parseInt(tY);
        
        
        if(key === 'topRight' || key === 'bottomRight') {
            if(tX - iTx <= 0) {
                iTx--;
            }
        } else {
            if(tX - iTx < 0) {
                iTx--;
            }
        }

        if(key === 'bottomLeft' || key === 'bottomRight') {
            if(tY - iTy <= 0) {
                iTy--;
            }
        } else {
            if(tY - iTy < 0) {
                iTy--;
            }
        }

        points[key] = { tX: iTx, tY: iTy};
    }

    return points;
}

Game.prototype.findPixelPosition = function(tX, tY) {
    return {x: 0, y: 0};
}

Game.prototype.processPhysics = function() {
    let self = this;


    // let tileCoordinates = self.findTileCoordinates(self.player.topLeft().x, self.player.topLeft().y);
    
    // let keys = Object.keys(tileCoordinates);
    // for(let i in keys) {
    //     let tileCoord = tileCoordinates[keys[i]];
    //     //Check if a tile exists at the specified coordinate
    //     for(let x in self.scene) {
    //         let layer = self.scene[x];
    //         if(layer[tileCoord.tY] && layer[tileCoord.tY][tileCoord.tX] && layer[tileCoord.tY][tileCoord.tX].collidable) {
                
    //             let tile = layer[tileCoord.tY][tileCoord.tX];
    //             let rigidBody = self.tileRigidBodies[tile.image];
    //             // self.player.topLeft().y += 1;
    //             //self.player.topLeft().x -= 1;
    //             //.console.log(self.player.topLeft().vectorA);
    //             //self.player.rigidBody.enforceConstraints();
                
                
    //         }
    //     }


    // }
    
}

Game.prototype.renderScene = function() {
    let self = this;
    
    for(let l in self.scene) {
        let layer = self.scene[l];
        for(let tY in layer) {
            let row = layer[tY];
            for(let tX in row) {
                let tile = row[tX];
                
                if(tile.image !== null) {
                    if(tY * 64 + 64 >= self.viewport.y && tX * 64 + 64 >= self.viewport.x) {
                        self.ctx.drawImage(self.spriteSheet, self.imageMap[tile.image].x, self.imageMap[tile.image].y, 64, 64, tX * 64 - self.viewport.x, tY * 64 - self.viewport.y, 64, 64);
                    }
                }
            }
        }
    }

    
    for(var i in self.player.boundingBox.path.edges) {
        
        let edge = self.player.boundingBox.path.edges[i];  
        
        self.ctx.strokeStyle = 'red';
        self.ctx.beginPath();
        self.ctx.moveTo(edge.path[0].x, edge.path[0].y);
        self.ctx.lineTo(edge.path[1].x, edge.path[1].y);
        self.ctx.closePath();
        self.ctx.stroke();

        if(i == 0) {
            self.ctx.fillStyle = 'yellow';
            self.ctx.fillRect(edge.path[0].x - 3, edge.path[0].y -3, 6, 6);
            self.ctx.fillStyle = 'orange';
            self.ctx.fillRect(edge.path[1].x - 3, edge.path[1].y - 3, 6, 6);
        }

    }

    // self.ctx.fillRect(self.player.topLeft().x - self.viewport.x, self.player.topLeft().y - self.viewport.y, 64, 64);

}

Game.prototype.clearCanvas = function() {
    let self = this;
    self.ctx.clearRect(0,0, 600, 400);
}

Game.prototype.renderUi = function() {
    let self = this;

    self.ctx.fillStyle = "black";
    self.ctx.font = "30px Arial";
    let fps = self.numTicks / (self.currentTickTimestamp - self.startTimestamp) * 1000;
    self.ctx.fillText("FPS: " + fps.toFixed(0), 10, 50);
        self.ctx.fillStyle = "white";
    self.ctx.fillText("FPS: " + fps.toFixed(0), 9, 49);

}

Game.prototype.registerListeners = function() {
    let self = this;
    
    window.addEventListener('keydown', function(e) {
        self.keyMap[e.key] = true;
    });

    window.addEventListener('keyup', function(e) {
        delete self.keyMap[e.key];
    });
}