/*
 * @Author: Senkita
 */

// 画布
let canvas: any = document.getElementById('canvas');
let ctx: any = canvas.getContext('2d');
const width: number = canvas.width;
const height: number = canvas.height;

// 占位块
const blockSize: number = 10;

// 虚拟块
const widthInBlocks: number = width / blockSize;
const heightInBlocks: number = height / blockSize;

// 游戏结束
let gameOver = (): void => {
    clearInterval(intervalId);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
};

// 分数
let score: number = 0;

// 场景
class Scenes {
    // 边框
    drawBorder(): void {
        ctx.fillStyle = 'Gray';
        ctx.fillRect(0, 0, width, blockSize);
        ctx.fillRect(0, height - blockSize, width, height);
        ctx.fillRect(0, 0, blockSize, height);
        ctx.fillRect(width - blockSize, 0, blockSize, height);
    };

    // 成绩
    drawScore(): void {
        ctx.font = '20px Courier';
        ctx.fillStyle = 'Black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`Score: ${score}`, blockSize, blockSize);
    };
};

// 封装画圆
let circle = (x: number, y: number, radius: number, fillCircle: boolean): void => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

// 块
class Block {
    col: number;
    row: number;

    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    };

    // 画方
    drawSquare(color: string): void {
        let x: number = this.col * blockSize;
        let y: number = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    };

    // 画圆
    drawCircle(color: string): void {
        let centerX = this.col * blockSize + blockSize / 2;
        let centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = color;
        circle(centerX, centerY, blockSize / 2, true);
    };

    // 检查重叠
    equal(otherBlock: Block): boolean {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    };
};

// 豆
class Bean {
    position: Block;

    constructor() {
        this.position = new Block(10, 10);
    };

    // 画豆
    draw(): void {
        this.position.drawCircle('LimeGreen');
    };

    // 移动
    move(): void {
        let randomCol: number = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
        let randomRow: number = Math.floor(Math.random() * (heightInBlocks - 2) + 1);
        this.position = new Block(randomCol, randomRow);
    };
};

// 蛇
class Snake {
    segments: Block[];
    direction: string;
    nextDirection: string;

    // 蛇身部分
    constructor() {
        this.segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    };

    // 画蛇
    draw(): void {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].drawSquare('Blue');
        }
    };

    // 碰撞检查
    checkCollision(head: Block): boolean {
        let topCollision: boolean = (head.row === 0);
        let rightCollision: boolean = (head.col === widthInBlocks - 1);
        let bottomCollision: boolean = (head.row === heightInBlocks - 1);
        let leftCollision: boolean = (head.col === 0);

        let wallCollision = topCollision || rightCollision || bottomCollision || leftCollision;

        let selfCollision: boolean = false;
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;
    };

    // 移动
    move(): void {
        let head: Block = this.segments[0];
        let newHead: Block;

        this.direction = this.nextDirection;

        if (this.direction === 'right') {
            newHead = new Block(head.col + 1, head.row);
        } else if (this.direction === 'down') {
            newHead = new Block(head.col, head.row + 1);
        } else if (this.direction === 'left') {
            newHead = new Block(head.col - 1, head.row);
        } else if (this.direction === 'up') {
            newHead = new Block(head.col, head.row - 1);
        }
        // @ts-ignore
        if (this.checkCollision(newHead)) {
            gameOver();
            return;
        }
        // @ts-ignore
        this.segments.unshift(newHead);
        // @ts-ignore
        if (newHead.equal(bean.position)) {
            score++;
            bean.move();
        } else {
            this.segments.pop();
        }
    };

    // 转向
    setDirection(newDirection: string): void {
        if (this.direction === 'up' && newDirection === 'down') {
            return;
        } else if (this.direction === 'right' && newDirection === 'left') {
            return;
        } else if (this.direction === 'down' && newDirection === 'up') {
            return;
        } else if (this.direction === 'left' && newDirection === 'right') {
            return;
        }

        this.nextDirection = newDirection;
    };
};

let scenes = new Scenes();
let bean = new Bean();
let snake = new Snake();

// 执行
let intervalId = setInterval((): void => {
    ctx.clearRect(0, 0, width, height);
    scenes.drawScore();
    snake.move();
    snake.draw();
    bean.draw();
    scenes.drawBorder();
}, 100);

// 按键映射
let directions: any = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

// 监视按键改向
$('body').keydown((event): void => {
    let newDirection = directions[event.keyCode];

    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});