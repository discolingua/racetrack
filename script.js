//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({ 
	width: 800, 
    height: 600,                       
    antialiasing: true, 
    transparent: false, 
    resolution: 1
	} 
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
  .add("cat.png")
  .load(setup);

//Define any variables that are used in more than one function
var cat, state;

function setup() {

	//Create the `cat` sprite 
  	cat = new Sprite(resources["cat.png"].texture);
  	cat.x = 400;
  	cat.y = 200; 
  	cat.vx = 0;
  	cat.vy = 0;
  	app.stage.addChild(cat);

  	//Capture the keyboard arrow keys
  	let left = keyboard(37),
      	up = keyboard(38),
      	right = keyboard(39),
      	down = keyboard(40);

  	//Left arrow key `press` method
  	left.press = () => {
     	cat.vx -= 1;
    	cat.vy += 0;
	};
  
  	//Left arrow key `release` method
  	left.release = () => {
  		if (!right.isDown && cat.vy === 0) {
    		cat.vx += 0;
    	}
  	};

  	//Up
  	up.press = () => {
   	 cat.vy -= 1;
  	};
  	up.release = () => {
    	if (!down.isDown && cat.vx === 0) {
      		cat.vy += 0;
    	}
  	};

  //Right
  right.press = () => {
    cat.vx += 1;
  };
  right.release = () => {
    if (!left.isDown && cat.vy === 0) {
      cat.vx += 0;
    }
  };

  //Down
  down.press = () => {
    cat.vy += 1;
  };
  down.release = () => {
    if (!up.isDown && cat.vx === 0) {
      cat.vy += 0;
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
  cat.x += cat.vx;
  cat.y += cat.vy;
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