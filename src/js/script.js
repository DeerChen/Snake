"use strict";
/*
 * @Author: Senkita
 */
// 画布
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
// 占位块
var blockSize = 10;
// 虚拟块
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
// 游戏结束
var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
};
// 分数
var score = 0;
// 场景
var Scenes = /** @class */ (function () {
    function Scenes() {
    }
    // 边框
    Scenes.prototype.drawBorder = function () {
        ctx.fillStyle = 'Gray';
        ctx.fillRect(0, 0, width, blockSize);
        ctx.fillRect(0, height - blockSize, width, height);
        ctx.fillRect(0, 0, blockSize, height);
        ctx.fillRect(width - blockSize, 0, blockSize, height);
    };
    ;
    // 成绩
    Scenes.prototype.drawScore = function () {
        ctx.font = '20px Courier';
        ctx.fillStyle = 'Black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText("Score: " + score, blockSize, blockSize);
    };
    ;
    return Scenes;
}());
;
// 封装画圆
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
};
// 块
var Block = /** @class */ (function () {
    function Block(col, row) {
        this.col = col;
        this.row = row;
    }
    ;
    // 画方
    Block.prototype.drawSquare = function (color) {
        var x = this.col * blockSize;
        var y = this.row * blockSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
    };
    ;
    // 画圆
    Block.prototype.drawCircle = function (color) {
        var centerX = this.col * blockSize + blockSize / 2;
        var centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = color;
        circle(centerX, centerY, blockSize / 2, true);
    };
    ;
    // 检查重叠
    Block.prototype.equal = function (otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    };
    ;
    return Block;
}());
;
// 豆
var Bean = /** @class */ (function () {
    function Bean() {
        this.position = new Block(10, 10);
    }
    ;
    // 画豆
    Bean.prototype.draw = function () {
        this.position.drawCircle('LimeGreen');
    };
    ;
    // 移动
    Bean.prototype.move = function () {
        var randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
        var randomRow = Math.floor(Math.random() * (heightInBlocks - 2) + 1);
        this.position = new Block(randomCol, randomRow);
    };
    ;
    return Bean;
}());
;
// 蛇
var Snake = /** @class */ (function () {
    // 蛇身部分
    function Snake() {
        this.segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }
    ;
    // 画蛇
    Snake.prototype.draw = function () {
        for (var i = 0; i < this.segments.length; i++) {
            this.segments[i].drawSquare('Blue');
        }
    };
    ;
    // 碰撞检查
    Snake.prototype.checkCollision = function (head) {
        var topCollision = (head.row === 0);
        var rightCollision = (head.col === widthInBlocks - 1);
        var bottomCollision = (head.row === heightInBlocks - 1);
        var leftCollision = (head.col === 0);
        var wallCollision = topCollision || rightCollision || bottomCollision || leftCollision;
        var selfCollision = false;
        for (var i = 0; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;
    };
    ;
    // 移动
    Snake.prototype.move = function () {
        var head = this.segments[0];
        var newHead;
        this.direction = this.nextDirection;
        if (this.direction === 'right') {
            newHead = new Block(head.col + 1, head.row);
        }
        else if (this.direction === 'down') {
            newHead = new Block(head.col, head.row + 1);
        }
        else if (this.direction === 'left') {
            newHead = new Block(head.col - 1, head.row);
        }
        else if (this.direction === 'up') {
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
        }
        else {
            this.segments.pop();
        }
    };
    ;
    // 转向
    Snake.prototype.setDirection = function (newDirection) {
        if (this.direction === 'up' && newDirection === 'down') {
            return;
        }
        else if (this.direction === 'right' && newDirection === 'left') {
            return;
        }
        else if (this.direction === 'down' && newDirection === 'up') {
            return;
        }
        else if (this.direction === 'left' && newDirection === 'right') {
            return;
        }
        this.nextDirection = newDirection;
    };
    ;
    return Snake;
}());
;
var scenes = new Scenes();
var bean = new Bean();
var snake = new Snake();
// 执行
var intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    scenes.drawScore();
    snake.move();
    snake.draw();
    bean.draw();
    scenes.drawBorder();
}, 100);
// 按键映射
var directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};
// 监视按键改向
$('body').keydown(function (event) {
    var newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});
