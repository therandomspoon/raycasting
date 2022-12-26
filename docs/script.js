window.addEventListener('load', function() {
	var cvs = document.getElementById('screen');
	var graphics = cvs.getContext('2d', {alpha: false});

	// create game
	var game = new Game();
	game.init(graphics);

	// create frame requester
	var rqstFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		null;

	var processFrame = function() {
		game.update();
		game.draw(graphics);

		rqstFrame(processFrame);
	};

    // mouselock stuff
    cvs.requestPointerLock = cvs.requestPointerLock ||
                            cvs.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock ||
                            document.mozExitPointerLock;

    cvs.onclick = function() {
        cvs.requestPointerLock();
    };

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    function lockChangeAlert() {
        if (document.pointerLockElement === cvs ||
            document.mozPointerLockElement === cvs) {
            console.log('The pointer is now locked');
            document.addEventListener("mousemove", game.handleMousemove, false);
        } else {
            console.log('The pointer is now unlocked');  
            document.removeEventListener("mousemove", game.handleMousemove, false);
        }
    }

	// start the game
	processFrame();
});


// Game assets
var Metrics = function(w, h) {
	this.Width = w;
	this.Height = h;
};

var Screen = {
	Metrics: new Metrics(640, 360)
};

var World = {
	Map: {
		Metrics: new Metrics(24, 24),
		wallData: [
			[8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 6, 4, 4, 6, 4, 6, 4, 4, 4, 6, 4],
			[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
			[8, 0, 3, 3, 0, 0, 0, 0, 0, 8, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
			[8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
			[8, 0, 3, 3, 0, 0, 0, 0, 0, 8, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
			[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4, 0, 0, 0, 0, 0, 6, 6, 6, 0, 6, 4, 6],
			[8, 8, 8, 8, 0, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 6, 0, 0, 0, 0, 0, 6],
			[7, 7, 7, 7, 0, 7, 7, 7, 7, 0, 8, 0, 8, 0, 8, 0, 8, 4, 0, 4, 0, 6, 0, 6],
			[7, 7, 0, 0, 0, 0, 0, 0, 7, 8, 0, 8, 0, 8, 0, 8, 8, 6, 0, 0, 0, 0, 0, 6],
			[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 6, 0, 0, 0, 0, 0, 4],
			[7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 6, 0, 6, 0, 6, 0, 6],
			[7, 7, 0, 0, 0, 0, 0, 0, 7, 8, 0, 8, 0, 8, 0, 8, 8, 6, 4, 6, 0, 6, 6, 6],
			[7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 8, 4, 0, 6, 8, 4, 8, 3, 3, 3, 0, 3, 3, 3],
			[2, 2, 2, 2, 0, 2, 2, 2, 2, 4, 6, 4, 0, 0, 6, 0, 6, 3, 0, 0, 0, 0, 0, 3],
			[2, 2, 0, 0, 0, 0, 0, 2, 2, 4, 0, 0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 0, 3],
			[2, 0, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 0, 3],
			[1, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 6, 0, 6, 3, 3, 0, 0, 0, 3, 3],
			[2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 6, 6, 0, 0, 5, 0, 5, 0, 5],
			[2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 5, 0, 5, 0, 0, 0, 5, 5],
			[2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 5, 0, 5, 0, 5, 0, 5, 0, 5],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
			[2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 5, 0, 5, 0, 5, 0, 5, 0, 5],
			[2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 5, 0, 5, 0, 0, 0, 5, 5],
			[2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5]
		]
	},
	Textures: {
		Metrics: new Metrics(64, 64),
		Data: []
	},
	Sprites: {
		Metrics: new Metrics(64, 64),
		Data: []
	}
};

var Texture = function() {
	this.Pixels = [];
	this.ImageBitmap = undefined;

	this.Pixels[World.Textures.Metrics.Height * World.Textures.Metrics.Width - 1] = undefined;
};

var Sprite = function(x, y, tex) {
	this.x = x;
	this.y = y;
	this.texture = tex;
};

var Color = function(colorABGR) {
	this.setFromABGR(colorABGR);
};
Color.prototype.setFromABGR = function(colorABGR) {
	this.a = (colorABGR >>> 24); // we need to shift this as a signed num
	this.b = ((colorABGR >> 16) & 0x00FF);
	this.g = ((colorABGR >> 8) & 0x0000FF);
	this.r = (colorABGR & 0x000000FF);
};
Color.prototype.toRGBA = function() {
	return (this.r << 24) | (this.g << 16) | (this.b << 8) | (this.a);
};

var Player = function() {
	// initial start x/y
	this.posX = 22.0;
	this.posY = 11.5;

	// initial direction
	this.dirX = -1.0;
	this.dirY = 0.0;

	// the 2d raycaster version of camera plane
	this.planeX = 0.0;
	this.planeY = 0.88; // this is FOV - 0.66 for 4:3, 0.88 for 16:9
};

var FPSCounter = function() {
	var initTime = 0;
	var startTime = 0;
	var font = "bold 10px Courier";

	return {
		frameTime: 0,
		init: function() {
			initTime = new Date().getTime();
		},
		getTicks: function() {
			return new Date().getTime() - initTime;
		},
		update: function() {
			var oldTime = startTime;
			startTime = this.getTicks();
			this.frameTime = (startTime - oldTime) / 1000.0;
		},
		getFPS: function() {
			return 1.0 / this.frameTime;
		},
		renderFPS: function(ctx) {
			ctx.font = font;
			ctx.fillStyle = "white";
			ctx.fillText(this.getFPS().toFixed(0) + " FPS", 10, 10);
		}
	};
};

// main draw
var Game = function() {
	// drawing
	var imgData;
	var ZBuffer = [];

	// input
	var keyDown = [];
	var keyPress = [];
    var mouseMovement = 0;
	var KeyID = {
		// movement
		W: 87,
		A: 65,
		S: 83,
		D: 68,
		right: 39,
		left: 37,

		// special keys
		T: 84,
		Z: 90,
		X: 88
	};

	// logic
	var fps = new FPSCounter();

	// game
	var player = new Player();
	var drawSprites = true;
	var drawGeometry = true;
	var showFPS = true;

	return {

		// Game functions
		imgToTexture: function(img, ctx, maskBlack) {
			var tex = new Texture();

			ctx.drawImage(img, 0, 0);

			var imgData = ctx.getImageData(0, 0, img.width, img.height);
			//Create ArrayBuffer backing
			var buf = new ArrayBuffer(imgData.data.length);
			//Get a uint8 view to the buffer
			var buf8 = new Uint8ClampedArray(buf);
			//Get a uint32 view to the buffer
			var data = new Uint32Array(buf);

			//Copy pixel data to buffer (via uint8 view. uint32 view is also updated)
			buf8.set(imgData.data);

			if (maskBlack) {
				for (var i = 0; i < data.length; ++i) {
					if (!(data[i] & 0x00FFFFFF)) data[i] = 0x00000000;
				}
			}

			tex.ImageData = imgData;
			tex.Pixels = data;
			createImageBitmap(new ImageData(buf8, img.width, img.height)).then(function(bmp) {
				tex.ImageBitmap = bmp;
			});
			return tex;
		},

		init: function(ctx) {
			// input processing
			window.onkeydown = this.handleKeydown;
			window.onkeyup = this.handleKeyup;
			ctx.imageSmoothingEnabled = false;

			// fps initialization
			fps.init();

			// buffer initialization
			imgData = ctx.getImageData(0, 0, Screen.Metrics.Width, Screen.Metrics.Height);
			ZBuffer[Screen.Metrics.Width - 1] = undefined;

			// create textures
			/* uncomment for generated textures
			for (var x = 0;x < World.Textures.Metrics.Width;++x) {
			  for (var y = 0;y < World.Textures.Metrics.Height;++y) {
			    for (var t = 0;t != 12;++t) {
			      World.Textures.Data[t].Pixels[World.Textures.Metrics.Width * y + x] = 0xC00000 * ((x % 16) && (y % 16) && 1);
			    }
			  }
			}
			*/

			World.Textures.Data = [
				// Walls
				this.imgToTexture(document.getElementById('eagle'), ctx),
				this.imgToTexture(document.getElementById('brick'), ctx),
				this.imgToTexture(document.getElementById('purple_stone'), ctx),
				this.imgToTexture(document.getElementById('cobble'), ctx),
				this.imgToTexture(document.getElementById('bluebrick'), ctx),
				this.imgToTexture(document.getElementById('cobble_moss'), ctx),
				this.imgToTexture(document.getElementById('wood'), ctx),
				this.imgToTexture(document.getElementById('cobble_colored'), ctx),

				// Sprites
				this.imgToTexture(document.getElementById('barrel'), ctx, true),
				this.imgToTexture(document.getElementById('column'), ctx, true),
				this.imgToTexture(document.getElementById('lamp'), ctx, true),
			];

			// Sprites
			World.Sprites.Data = [
				new Sprite(20.5, 11.5, 10), //green light in front of playerstart
				//green lights in every room
				new Sprite(18.5, 4.5, 10),
				new Sprite(10.0, 4.5, 10),
				new Sprite(10.0, 12.5, 10),
				new Sprite(3.5, 6.5, 10),
				new Sprite(3.5, 20.5, 10),
				new Sprite(3.5, 14.5, 10),
				new Sprite(14.5, 20.5, 10),

				//row of pillars in front of wall: fisheye test
				new Sprite(18.5, 10.5, 9),
				new Sprite(18.5, 11.5, 9),
				new Sprite(18.5, 12.5, 9),

				//some barrels around the map
				new Sprite(21.5, 1.5, 8),
				new Sprite(15.5, 1.5, 8),
				new Sprite(3.5, 2.5, 8),
				new Sprite(9.5, 15.5, 8),
				new Sprite(10.5, 15.5, 8)
			];
		},

		clearBuffer: function() {
			var black = new Color(0x00000000);
			for (var x = 0; x < Screen.Metrics.Width; ++x) {
				for (var y = 0; y < Screen.Metrics.Height; ++y) {
					var index = (y * Screen.Metrics.Width + x) * 4;
					imgData.data[index++] = black.r;
					imgData.data[index++] = black.g;
					imgData.data[index++] = black.b;
					imgData.data[index] = 0xC0; // give it that gray color
				}
			}
		},

		draw: function(ctx) {
			// clear the screen
			this.clearBuffer();

			// geometry calculations
			if (drawGeometry) {
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "rgba(0,0,0,0.6)"; //For overlaying the walls to create shadow
				for (var x = 0; x < Screen.Metrics.Width; ++x) {
					var cameraX = 2.0 * x / Screen.Metrics.Width - 1; // x-coord in camera space
					var rayPosX = player.posX;
					var rayPosY = player.posY;
					var rayDirX = player.dirX + player.planeX * cameraX;
					var rayDirY = player.dirY + player.planeY * cameraX;

					// which box of the map we're in
					var mapX = Math.floor(rayPosX);
					var mapY = Math.floor(rayPosY);

					// length of the ray from the current position to the next x or y-side
					var sideDistX;
					var sideDistY;

					// length of ray from one x or y-side to the next x or y-side
					var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
					var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
					var perpWallDist;

					// what direction to step in x or y-direction (either +1 or -1)
					var stepX;
					var stepY;

					var hit = false; // was there a wall hit?
					var side = false; // was a NS or EW wall hit?

					// calculate step and initial sideDist
					if (rayDirX < 0) {
						stepX = -1;
						sideDistX = (rayPosX - mapX) * deltaDistX;
					} else {
						stepX = 1;
						sideDistX = (mapX + 1.0 - rayPosX) * deltaDistX;
					}

					if (rayDirY < 0) {
						stepY = -1;
						sideDistY = (rayPosY - mapY) * deltaDistY;
					} else {
						stepY = 1;
						sideDistY = (mapY + 1.0 - rayPosY) * deltaDistY;
					}

					// perform DDA
					while (!hit) {
						// jump to the next map square or in x-direction or y-direction
						if (sideDistX < sideDistY) {
							sideDistX += deltaDistX;
							mapX += stepX;
							side = false;
						} else {
							sideDistY += deltaDistY;
							mapY += stepY;
							side = true;
						}
						// check if ray has hit a wall
						hit = World.Map.wallData[mapX][mapY] > 0;
					}

					// calculate lowest and highest pixel to fill in current stripe
					if (!side) {
						perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;
					} else {
						perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;
					}

					// calculate line height of line to draw on screen
					var lineHeight = Math.floor(Screen.Metrics.Height / perpWallDist);

					// calculate lowest and highest pixel to fill in current stripe
					var drawStart = -Math.floor(lineHeight / 2) + Math.floor(Screen.Metrics.Height / 2);
					if (drawStart < 0) {
						drawStart = 0;
					}
					var drawEnd = Math.floor(lineHeight / 2) + Math.floor(Screen.Metrics.Height / 2);
					if (drawEnd >= Screen.Metrics.Height) {
						drawEnd = Screen.Metrics.Height;
					}

					// texturing calculations
					var texNum = World.Map.wallData[mapX][mapY] - 1;

					// calculate value of wallX
					var wallX; // where exactly the wall was hit
					if (!side) {
						wallX = rayPosY + perpWallDist * rayDirY;
					} else {
						wallX = rayPosX + perpWallDist * rayDirX;
					}
					wallX -= Math.floor(wallX);

					// x coordinate on texture
					var texX = Math.floor(wallX * World.Textures.Metrics.Width);
					if (!side && rayDirX > 0) {
						texX = World.Textures.Metrics.Width - texX - 1;
					}
					if (side && rayDirY < 0) {
						texX = World.Textures.Metrics.Width - texX - 1;
					}

					var color = new Color(0x00000000);
					for (var y = drawStart; y < drawEnd; ++y) {
						var d = y * 256 - Screen.Metrics.Height * 128 + lineHeight * 128;
						var texY = Math.floor(((d * World.Textures.Metrics.Height) / lineHeight) / 256);
						var colorABGR = World.Textures.Data[texNum].Pixels[World.Textures.Metrics.Height * texY + texX];
						if (side) {
							colorABGR = ((colorABGR >>> 1) & 0x7F7F7F7F) | (colorABGR & 0xFF000000); // darken
						}
						color.setFromABGR(colorABGR);
						var index = (y * Screen.Metrics.Width + x) * 4;
						imgData.data[index++] = color.r;
						imgData.data[index++] = color.g;
						imgData.data[index++] = color.b;
						imgData.data[index] = color.a;
					}

					// save ZBuffer for sprites
					ZBuffer[x] = perpWallDist;

					// floor casting
					if (side == 0 && rayDirX > 0) {
						var floorXWall = mapX;
						var floorYWall = mapY + wallX;
					} else if (side == 0 && rayDirX < 0) {
						var floorXWall = mapX + 1.0;
						var floorYWall = mapY + wallX;
					} else if (side == 1 && rayDirY > 0) {
						var floorXWall = mapX + wallX;
						var floorYWall = mapY;
					} else {
						var floorXWall = mapX + wallX;
						var floorYWall = mapY + 1.0;
					}

					var distWall = perpWallDist;
					var distPlayer = 0.0;


					for (var y = drawEnd + 1; y <= Screen.Metrics.Height; ++y) {
						var currentDist = Screen.Metrics.Height / (2.0 * y - Screen.Metrics.Height); //you could make a small lookup table for this instead

						var weight = (currentDist - distPlayer) / (distWall - distPlayer);

						var currentFloorX = weight * floorXWall + (1.0 - weight) * rayPosX;
						var currentFloorY = weight * floorYWall + (1.0 - weight) * rayPosY;

						var floorTexX = Math.floor(currentFloorX * 64) % 64;
						var floorTexY = Math.floor(currentFloorY * 64) % 64;

						var color = new Color(0x00000000);
						var colorABGR = World.Textures.Data[3].Pixels[World.Textures.Metrics.Height * floorTexY + floorTexX];
						colorABGR = ((colorABGR >>> 1) & 0x7F7F7F7F) | (colorABGR & 0xFF000000);
						color.setFromABGR(colorABGR);
						var index = ((y - 1) * Screen.Metrics.Width + x) * 4;
						imgData.data[index++] = color.r;
						imgData.data[index++] = color.g;
						imgData.data[index++] = color.b;
						imgData.data[index] = color.a;

						colorABGR = World.Textures.Data[6].Pixels[World.Textures.Metrics.Height * floorTexY + floorTexX];
						color.setFromABGR(colorABGR);
						index = ((Screen.Metrics.Height - (y)) * Screen.Metrics.Width + x) * 4;
						imgData.data[index++] = color.r;
						imgData.data[index++] = color.g;
						imgData.data[index++] = color.b;
						imgData.data[index] = color.a;
					}
				}
				ctx.stroke();
			} // Draw geometry

			if (drawSprites) {
				var spriteOrder = [];
				for (var i = 0; i != World.Sprites.Data.length; ++i) {
					spriteOrder[i] = {
						Index: i,
						Distance: ((player.posX - World.Sprites.Data[i].x) * (player.posX - World.Sprites.Data[i].x) + (player.posY - World.Sprites.Data[i].y) * (player.posY - World.Sprites.Data[i].y))
					}; // sqrt not taken, unnecessary
				}
				spriteOrder.sort(function(a, b) {
					return b.Distance - a.Distance;
				});

                var once_seen = false;
				for (var i = 0; i != World.Sprites.Data.length; ++i) {
					// translate sprite position relative to camera
					var spriteX = World.Sprites.Data[spriteOrder[i].Index].x - player.posX;
					var spriteY = World.Sprites.Data[spriteOrder[i].Index].y - player.posY;

					//transform sprite with the inverse camera matrix
					// [ planeX   dirX ] -1                                       [ dirY      -dirX ]
					// [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
					// [ planeY   dirY ]                                          [ -planeY  planeX ]
					var invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);

					var transformX = invDet * (player.dirY * spriteX - player.dirX * spriteY);
					var transformY = invDet * (-player.planeY * spriteX + player.planeX * spriteY);

					var spriteScreenX = Math.floor((Screen.Metrics.Width / 2) * (1 + transformX / transformY));

					var vMoveScreen = Math.floor(0.0 / transformY);

					// calculate height of sprite on screen
					var spriteHeight = Math.abs(Math.floor(Screen.Metrics.Height / transformY)) / 1;
					// calculate lowest and highest pixel to fill current stripe
					var drawStartY = -Math.floor(spriteHeight / 2) + Math.floor(Screen.Metrics.Height / 2) + vMoveScreen;
					if (drawStartY < 0) {
						drawStartY = 0;
					}
					var drawEndY = Math.floor(spriteHeight / 2) + Math.floor(Screen.Metrics.Height / 2) + vMoveScreen;
					if (drawEndY >= Screen.Metrics.Height) {
						drawEndY = Screen.Metrics.Height - 1;
					}

					// calculate width of the sprite
					var spriteWidth = Math.abs(Math.floor(Screen.Metrics.Height / transformY)) / 1;
					var drawStartX = -Math.floor(spriteWidth / 2) + spriteScreenX;
					if (drawStartX < 0) {
						drawStartX = 0;
					}
					var drawEndX = Math.floor(spriteWidth / 2) + spriteScreenX;
					if (drawEndX >= Screen.Metrics.Width) {
						drawEndX = Screen.Metrics.Width - 1;
					}

					// loop through every vertical stripe of sprite on screen
					var color = new Color(0x00000000);
					for (var stripe = drawStartX; stripe <= drawEndX; ++stripe) {
						var texX = Math.floor((256 * (stripe - (-spriteWidth / 2 + spriteScreenX)) * World.Textures.Metrics.Width / spriteWidth) / 256);
                        var seen = false;
						// the conditions in the if are:
						// 1) it's in front of the camera plane so you don't see things behind you
						// 2) it's on the screen (left)
						// 3) it's on the screen (right)
						// 4) ZBuffer perpendicular distance
						if (transformY > 0 && stripe >= 0 && stripe < Screen.Metrics.Width && transformY < ZBuffer[stripe]) {
							for (var y = drawStartY; y < drawEndY; ++y) {
								var d = Math.floor((y - vMoveScreen) * 256 - Screen.Metrics.Height * 128 + spriteHeight * 128);
								var texY = Math.floor(((d * World.Textures.Metrics.Height) / spriteHeight) / 256);
								var colorABGR = World.Textures.Data[World.Sprites.Data[spriteOrder[i].Index].texture].Pixels[World.Textures.Metrics.Height * texY + texX];
								color.setFromABGR(colorABGR);
								if (color.a > 0) {
                                    // aiming at objects
                                    if (stripe == Screen.Metrics.Width / 2 && !seen) {
                                        if (World.Sprites.Data[spriteOrder[i].Index].texture == 8) {
                                            // aiming at barrel
                                            seen = true;
                                            once_seen = true;
                                        }
                                    }

									var index = (y * Screen.Metrics.Width + stripe) * 4;
									imgData.data[index++] = color.r;
									imgData.data[index++] = color.g;
									imgData.data[index++] = color.b;
									imgData.data[index] = color.a;
								}
							}
						}
					}
				}
			}

			// draw buffer
			ctx.putImageData(imgData, 0, 0);

            // draw text if looking at barrel
            if (once_seen) {
                ctx.fillText("Locked on!", 10, 30);
            }

            // draw crosshair
            ctx.translate(0.5, 0.5);

            ctx.moveTo(Screen.Metrics.Width / 2, Screen.Metrics.Height / 2 - 5);
            ctx.lineTo(Screen.Metrics.Width / 2, Screen.Metrics.Height / 2 + 5);

            ctx.moveTo(Screen.Metrics.Width / 2 - 5, Screen.Metrics.Height / 2);
            ctx.lineTo(Screen.Metrics.Width / 2 + 5, Screen.Metrics.Height / 2);
            
            // set crosshair colour - change this if needed
            ctx.strokeStyle = 'black';
            
            ctx.stroke();
            ctx.translate(-0.5, -0.5);

			// show fps
			if (showFPS) {
				fps.renderFPS(ctx);
			}
		},

		update: function() {
			fps.update();

			var moveSpeed = fps.frameTime * 5.0;
			var rotSpeed = fps.frameTime * 3;

            var sprite_collide_distance = 0.3; // distance from sprite counted as collision

			if (keyDown[KeyID.W] && !keyDown[KeyID.S]) {
                var sprite_collide = false;

                for (i = 0; i < World.Sprites.Data.length; ++i) {
                    if ((Math.hypot(World.Sprites.Data[i].x - (player.posX + player.dirX * moveSpeed), World.Sprites.Data[i].y - (player.posY + player.dirY * moveSpeed)) < sprite_collide_distance) && (World.Sprites.Data[i].texture != 10)) {
                        sprite_collide = true;
                        break;
                    }
                }

                if (!sprite_collide) {
                    if (World.Map.wallData[Math.floor(player.posX + player.dirX * moveSpeed)][Math.floor(player.posY)] == 0) {
                        player.posX += player.dirX * moveSpeed;
                    }
                    if (World.Map.wallData[Math.floor(player.posX)][Math.floor(player.posY + player.dirY * moveSpeed)] == 0) {
                        player.posY += player.dirY * moveSpeed;
                    }
                }
			}
			if (keyDown[KeyID.S] && !keyDown[KeyID.W]) {
				var sprite_collide = false;

                for (i = 0; i < World.Sprites.Data.length; ++i) {
                    if ((Math.hypot(World.Sprites.Data[i].x - (player.posX - player.dirX * moveSpeed), World.Sprites.Data[i].y - (player.posY - player.dirY * moveSpeed)) < sprite_collide_distance) && (World.Sprites.Data[i].texture != 10)) {
                        sprite_collide = true;
                        break;
                    }
                }

                if (!sprite_collide) {
                    if (World.Map.wallData[Math.floor(player.posX - player.dirX * moveSpeed)][Math.floor(player.posY)] == 0) {
                        player.posX -= player.dirX * moveSpeed;
                    }
                    if (World.Map.wallData[Math.floor(player.posX)][Math.floor(player.posY - player.dirY * moveSpeed)] == 0) {
                        player.posY -= player.dirY * moveSpeed;
                    }
                }
			}
			if (keyDown[KeyID.D] && !keyDown[KeyID.A]) {
				var sprite_collide = false;

                for (i = 0; i < World.Sprites.Data.length; ++i) {
                    if ((Math.hypot(World.Sprites.Data[i].x - (player.posX + player.planeX * moveSpeed), World.Sprites.Data[i].y - (player.posY + player.planeY * moveSpeed)) < sprite_collide_distance) && (World.Sprites.Data[i].texture != 10)) {
                        sprite_collide = true;
                        break;
                    }
                }

                if (!sprite_collide) {
                    if (World.Map.wallData[Math.floor(player.posX + player.planeX * moveSpeed)][Math.floor(player.posY)] == 0) {
                        player.posX += player.planeX * moveSpeed;
                    }
                    if (World.Map.wallData[Math.floor(player.posX)][Math.floor(player.posY + player.planeY * moveSpeed)] == 0) {
                        player.posY += player.planeY * moveSpeed;
                    }
                }
			}
			if (keyDown[KeyID.A] && !keyDown[KeyID.D]) {
				var sprite_collide = false;

                for (i = 0; i < World.Sprites.Data.length; ++i) {
                    if ((Math.hypot(World.Sprites.Data[i].x - (player.posX - player.planeX * moveSpeed), World.Sprites.Data[i].y - (player.posY - player.planeY * moveSpeed)) < sprite_collide_distance) && (World.Sprites.Data[i].texture != 10)) {
                        sprite_collide = true;
                        break;
                    }
                }

                if (!sprite_collide) {
                    if (World.Map.wallData[Math.floor(player.posX - player.planeX * moveSpeed)][Math.floor(player.posY)] == 0) {
                        player.posX -= player.planeX * moveSpeed;
                    }
                    if (World.Map.wallData[Math.floor(player.posX)][Math.floor(player.posY - player.planeY * moveSpeed)] == 0) {
                        player.posY -= player.planeY * moveSpeed;
                    }
                }
			}
			if (keyDown[KeyID.left] && !keyDown[KeyID.right]) {
				var oldDirX = player.dirX;
				player.dirX = player.dirX * Math.cos(rotSpeed) - player.dirY * Math.sin(rotSpeed);
				player.dirY = oldDirX * Math.sin(rotSpeed) + player.dirY * Math.cos(rotSpeed);
				var oldPlaneX = player.planeX;
				player.planeX = player.planeX * Math.cos(rotSpeed) - player.planeY * Math.sin(rotSpeed);
				player.planeY = oldPlaneX * Math.sin(rotSpeed) + player.planeY * Math.cos(rotSpeed);
			}
			if (keyDown[KeyID.right] && !keyDown[KeyID.left]) {
				var oldDirX = player.dirX;
				player.dirX = player.dirX * Math.cos(-rotSpeed) - player.dirY * Math.sin(-rotSpeed);
				player.dirY = oldDirX * Math.sin(-rotSpeed) + player.dirY * Math.cos(-rotSpeed);
				var oldPlaneX = player.planeX;
				player.planeX = player.planeX * Math.cos(-rotSpeed) - player.planeY * Math.sin(-rotSpeed);
				player.planeY = oldPlaneX * Math.sin(-rotSpeed) + player.planeY * Math.cos(-rotSpeed);
			}
            if (mouseMovement != 0) {
                rotSpeed = fps.frameTime * 0.1;
            }
            if (mouseMovement < 0) {
                for (var i = 0; i < -mouseMovement; ++i) {
                    var oldDirX = player.dirX;
                    player.dirX = player.dirX * Math.cos(rotSpeed) - player.dirY * Math.sin(rotSpeed);
                    player.dirY = oldDirX * Math.sin(rotSpeed) + player.dirY * Math.cos(rotSpeed);
                    var oldPlaneX = player.planeX;
                    player.planeX = player.planeX * Math.cos(rotSpeed) - player.planeY * Math.sin(rotSpeed);
                    player.planeY = oldPlaneX * Math.sin(rotSpeed) + player.planeY * Math.cos(rotSpeed);
                }
            }
            if (mouseMovement > 0) {
                for (var i = 0; i < mouseMovement; ++i) {
                    var oldDirX = player.dirX;
                    player.dirX = player.dirX * Math.cos(-rotSpeed) - player.dirY * Math.sin(-rotSpeed);
                    player.dirY = oldDirX * Math.sin(-rotSpeed) + player.dirY * Math.cos(-rotSpeed);
                    var oldPlaneX = player.planeX;
                    player.planeX = player.planeX * Math.cos(-rotSpeed) - player.planeY * Math.sin(-rotSpeed);
                    player.planeY = oldPlaneX * Math.sin(-rotSpeed) + player.planeY * Math.cos(-rotSpeed);
                }
            }

			// special keys
			if (keyPress[KeyID.T]) {
				// toggle FPS
				showFPS = !showFPS;
			}
			if (keyPress[KeyID.Z]) {
				// toggle geometry drawing
				drawGeometry = !drawGeometry;
			}
			if (keyPress[KeyID.X]) {
				// toggle sprites
				drawSprites = !drawSprites;
			}

			// clear pressed keys
			keyPress = [];

            // clear mouse movement
            mouseMovement = 0;
		},

		handleKeydown: function(e) {
			keyDown[e.keyCode] = true;
		},

		handleKeyup: function(e) {
			keyPress[e.keyCode] = true;
			keyDown[e.keyCode] = false;
		},

        handleMousemove: function(e) {
            mouseMovement = e.movementX;
        }

	};

};