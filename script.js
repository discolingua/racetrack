

//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    TilingSprite = PIXI.TilingSprite,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({ 
	width: 1024, 
    height: 600,                       
    antialiasing: true, 
    transparent: false, 
    resolution: 1
	} 
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


loader
  .add("car", "assets/images/car.png")
  .add("sand", "assets/images/sand.png")
  .load(setup);

//Define any variables that are used in more than one function
var car, state;

//set up viewport object

const viewport = new Viewport.Viewport( {
	screenWidth: window.innerWidth,
	screenHeight: window.innerHeight,
	worldWidth: 2000,
	worldHeight: 2000
});

app.stage.addChild(viewport);

viewport
	.drag()
	.pinch()
	.wheel();

function setup() {

	sand = new TilingSprite(resources.sand.texture, 12800, 12800);
	viewport.addChild(sand);

	//Create the car sprite 
  	car = new Sprite(resources.car.texture);
  	car.x = 640;
  	car.y = 200; 
  	car.vx = 0;
  	car.vy = 0;
  	car.anchor.x = 0.5;
  	car.anchor.y = 0.5;
 
 	// add to viewport, not app.stage
    viewport.addChild(car);

  	//Capture the keyboard arrow keys
  	let left = keyboard(37),
      	up = keyboard(38),
      	right = keyboard(39),
      	down = keyboard(40);

  	//Left arrow key `press` method
  	left.press = () => {
     	car.vx -= 1;
    	car.vy += 0;
	};
  
  	//Left arrow key `release` method
  	left.release = () => {
  		if (!right.isDown && car.vy === 0) {
    		car.vx += 0;
    	}
  	};

  	//Up
  	up.press = () => {
   	 car.vy -= 1;
  	};
  	up.release = () => {
    	if (!down.isDown && car.vx === 0) {
      		car.vy += 0;
    	}
  	};

  	//Right
  	right.press = () => {
    	car.vx += 1;
  	};
  	right.release = () => {
    	if (!left.isDown && car.vy === 0) {
      	car.vx += 0;
    	}
  	};

  	//Down
  	down.press = () => {
    	car.vy += 1;
  	};
  	down.release = () => {
    	if (!up.isDown && car.vx === 0) {
      		car.vy += 0;
    	}
  	};

  	//Set the game state
  	state = play;
 
  	//Start the game loop 
	app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) {

  //Use the cat's velocity to make it move
  car.angle = ( Math.atan2(car.vx, -car.vy) / Math.PI ) * 180;
  car.x += car.vx;
  car.y += car.vy;
  viewport.moveCenter(car.x, car.y);

}

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}