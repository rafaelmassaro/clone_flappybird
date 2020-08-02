console.log('[Dev Soutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw(){
        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(
            sprites,
            background.spriteX, background.spriteY, //spriteX e SpriteY
            background.width, background.height, // Tamanho do recorte do Sprite
            background.x, background.y,
            background.width, background.height,
        );

        context.drawImage(
            sprites,
            background.spriteX, background.spriteY, //spriteX e SpriteY
            background.width, background.height, // Tamanho do recorte do Sprite
            (background.x + background.width), background.y,
            background.width, background.height,
        );
    }
};

const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw(){
        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY, //spriteX e SpriteY
            ground.width, ground.height, // Tamanho do recorte do Sprite
            (ground.x + ground.width), ground.y,
            ground.width, ground.height,
        );
        
        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY, //spriteX e SpriteY
            ground.width, ground.height, // Tamanho do recorte do Sprite
            ground.x, ground.y,
            ground.width, ground.height,
        );
    }
};

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    velocity: 0,
    update(){
        flappyBird.velocity = flappyBird.velocity + flappyBird.gravity,
        console.log(flappyBird.velocity)
        flappyBird.y = flappyBird.y + flappyBird.velocity;
    },
    draw(){
        context.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY, //spriteX e SpriteY
            flappyBird.width, flappyBird.height, // Tamanho do recorte do Sprite
            flappyBird.x, flappyBird.y,
            flappyBird.width, flappyBird.height,
        );
    }
};

const messageGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    draw(){
        context.drawImage(
            sprites,
            messageGetReady.sX, messageGetReady.sY, 
            messageGetReady.w, messageGetReady.h, 
            messageGetReady.x, messageGetReady.y,
            messageGetReady.w, messageGetReady.h,
        );
    }
};

let activeScreen = {};

function changeScreen(newScreen){
    activeScreen = newScreen;
}

const Screens = {
    START: {
        draw(){
            background.draw();
            ground.draw();
            flappyBird.draw();
            messageGetReady.draw();
        },
        click(){
            changeScreen(Screens.GAME);
        },
        update(){}
    }
};

Screens.GAME = {
    draw(){
        background.draw();
        ground.draw();
        flappyBird.draw();
    },
    update(){
        flappyBird.update();
    }
};

function loop(){
    
    activeScreen.draw();
    activeScreen.update();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click();
    }
});

changeScreen(Screens.START);
loop();