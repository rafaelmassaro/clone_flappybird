let frames = 0;
const hit_sound = new Audio();
hit_sound.src = './efeitos/hit.wav';

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

function createGround(){
    const ground = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        update(){
            const groundMoviment = 1;
            const repeat = ground.width / 2;
            const moviment = ground.x - groundMoviment;

            ground.x = moviment % repeat;
        },
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
    }

    return ground;
}

function makeCollision(flappyBird, ground){
    const flappyBirdY = flappyBird.y + flappyBird.height;
    const groundY = ground.y;

    if(flappyBirdY >= groundY){
        return true;
    }

    return false;
}

function createFlappyBird(){

    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        jumpForce: 4.6,
        jump(){
            flappyBird.velocity = -flappyBird.jumpForce;
        },
        gravity: 0.25,
        velocity: 0,
        update(){
            if(makeCollision(flappyBird, globais.ground)){
                hit_sound.play();
                setTimeout(() => {
                    changeScreen(Screens.START);
                }, 500)
                return;
            }
            flappyBird.velocity = flappyBird.velocity + flappyBird.gravity,
            console.log(flappyBird.velocity)
            flappyBird.y = flappyBird.y + flappyBird.velocity;
        },
        moviment: [
            { spriteX: 0, spriteY: 0 },
            { spriteX: 0, spriteY: 26 },
            { spriteX: 0, spriteY: 52 },
        ],
        atualFrame: 0,
        updateAtualFrame(){
            const frameIntervals = 10;

            const passedIntervals = frames % frameIntervals === 0;
            if(passedIntervals){
                const incrementBase = 1;
                const increment = incrementBase + flappyBird.atualFrame;
                const repeatBase = flappyBird.moviment.length;
                flappyBird.atualFrame = increment % repeatBase;
            }
            
        },
        draw(){
            flappyBird.updateAtualFrame();
            const { spriteX, spriteY } = flappyBird.moviment[flappyBird.atualFrame];
            context.drawImage(
                sprites,
                spriteX, spriteY, //spriteX e SpriteY
                flappyBird.width, flappyBird.height, // Tamanho do recorte do Sprite
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.height,
            );
        }
    }

    return flappyBird;
}



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

function createPipes(){
    const pipes = {
        width: 52,
        height: 400,
        ground: {
            spriteX: 0,
            spriteY: 169,
        },
        sky: {
            spriteX: 52,
            spriteY: 169,
        },
        space: 80,
        draw(){
            
            pipes.pairs.forEach(function(pair){
                
                const yRandom = pair.y;
                const spaceBetweemPipes = 90;
    
                const pipeSkyX = pair.x;
                const pipeSkyY = yRandom;
                
                context.drawImage(
                    sprites,
                    pipes.sky.spriteX, pipes.sky.spriteY,
                    pipes.width, pipes.height,
                    pipeSkyX, pipeSkyY,
                    pipes.width, pipes.height,
                );
    
    
                const pipeGroundX = pair.x;
                const pipeGroundY = pipes.height + spaceBetweemPipes + yRandom;
    
                context.drawImage(
                    sprites,
                    pipes.ground.spriteX, pipes.ground.spriteY,
                    pipes.width, pipes.height,
                    pipeGroundX, pipeGroundY,
                    pipes.width, pipes.height,
                );
            });
        },
        pairs: [],
        update(){
            const pass100frames = frames % 100 === 0;

            if(pass100frames){
                pipes.pairs.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            pipes.pairs.forEach(function(pair){
                pair.x = pair.x - 2;

                if(pair.x + pipes.width <= 0){
                    pipes.pairs.shift();
                }
            });
        }
    }

    return pipes;
};

const globais = {};
let activeScreen = {};

function changeScreen(newScreen){
    activeScreen = newScreen;

    if(activeScreen.init){
        activeScreen.init();
    }
}

const Screens = {
    START: {
        init(){
            globais.flappyBird = createFlappyBird();
            globais.ground = createGround();
            globais.pipes = createPipes();
        },
        draw(){
            background.draw();
            //messageGetReady.draw();
            globais.flappyBird.draw();
            globais.pipes.draw();
            globais.ground.draw();
        },
        click(){
            changeScreen(Screens.GAME);
        },
        update(){
            globais.ground.update();
            globais.pipes.update();
        }
    }
};

Screens.GAME = {
    draw(){
        background.draw();
        globais.ground.draw();
        globais.flappyBird.draw();
    },
    click(){
        globais.flappyBird.jump();
    },
    update(){
        globais.flappyBird.update();
    }
};

function loop(){
    
    activeScreen.draw();
    activeScreen.update();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click();
    }
});

changeScreen(Screens.START);
loop();