const blokdrip = {
  i: [
    [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
  ],
  j: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[1, 1, 0], [1, 0, 0], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  l: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[1, 0, 0], [1, 0, 0], [1, 1, 0]],
    [[1, 1, 1], [1, 0, 0], [0, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
  o: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  s: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ],
  t: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[1, 0, 0], [1, 1, 0], [1, 0, 0]],
    [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ],
};

const rotationStates = {
  l: { 0: [0, 1], 1: [1, -1], 2: [-1, 1], 3: [0, -1] },
  j: { 0: [0, 1], 1: [1, -1], 2: [-1, 1], 3: [0, -1] },
  t: { 0: [0, 0], 1: [1, -1], 2: [-1, 1], 3: [0, 0] },
  s: { 0: [-1, 1], 1: [1, -1] },
  z: { 0: [-1, 1], 1: [1, -1] },
  i: { 0: [-1, 1], 1: [1, -1] },
  o: { 0: [0, 0] },
};

let gameOver = false;
let lines = 0;
let score = 0;
let level = 1;

document.getElementById("startGame").addEventListener("click", function () {
  window.game.scene.keys["BlokDrop"].resetGame();
});

class BlokDrop extends Phaser.Scene {
  constructor() {
    super({ key: "BlokDrop" });
    this.gameBoard = [];
    this.currentBlok = null;
    this.blockSprites = [];
    for (let i = 0; i < 20; i++) {
      this.blockSprites[i] = new Array(10).fill(null);
    }
    this.shuffleBag = [];
    // Touch input properties
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.swipeThreshold = 50;      // Pixels for swipe detection (e.g., for rotation)
    this.tapThreshold = 20;        // Pixels for tap detection
    this.timeThreshold = 300;      // Max time (ms) for tap/swipe detection
    this.doubleTapThreshold = 300; // Max time (ms) between taps for double tap
    this.swipeAccumulatorX = 0;    // Tracks horizontal swipe distance
    this.swipeAccumulatorY = 0;    // Tracks vertical swipe distance (for soft drop)
    this.previousX = null;         // Previous x-position of finger
    this.previousY = null;         // Previous y-position of finger
    this.rotateTap = false;
    this.tapTimer = null;
  }

  preload() {
    this.load.image("j", "assets/Shape Blocks/J.png");
    this.load.image("i", "assets/Shape Blocks/I.png");
    this.load.image("l", "assets/Shape Blocks/L.png");
    this.load.image("z", "assets/Shape Blocks/Z.png");
    this.load.image("s", "assets/Shape Blocks/S.png");
    this.load.image("t", "assets/Shape Blocks/T.png");
    this.load.image("o", "assets/Shape Blocks/O.png");
    this.load.image("j1", "assets/Shape Blocks/J1.png");
    this.load.image("i1", "assets/Shape Blocks/I1.png");
    this.load.image("l1", "assets/Shape Blocks/L1.png");
    this.load.image("z1", "assets/Shape Blocks/Z1.png");
    this.load.image("s1", "assets/Shape Blocks/S1.png");
    this.load.image("t1", "assets/Shape Blocks/T1.png");
    this.load.image("j2", "assets/Shape Blocks/J2.png");
    this.load.image("l2", "assets/Shape Blocks/L2.png");
    this.load.image("t2", "assets/Shape Blocks/T2.png");
    this.load.image("j3", "assets/Shape Blocks/J3.png");
    this.load.image("l3", "assets/Shape Blocks/L3.png");
    this.load.image("t3", "assets/Shape Blocks/T3.png");
    this.load.image("block-j", "assets/Single Blocks/Blue.png");
    this.load.image("block-i", "assets/Single Blocks/LightBlue.png");
    this.load.image("block-l", "assets/Single Blocks/Orange.png");
    this.load.image("block-s", "assets/Single Blocks/Green.png");
    this.load.image("block-t", "assets/Single Blocks/Purple.png");
    this.load.image("block-z", "assets/Single Blocks/Red.png");
    this.load.image("block-o", "assets/Single Blocks/Yellow.png");
    this.load.image("board", "assets/Board/Board.png");
    this.load.audio("lineClear", "assets/Sound Effects/clear-lines.wav");
    this.load.on("complete", () => {
      this.blockSize = this.textures.get("block-o").getSourceImage().width * 0.5;
    });
  }

  create() {
    let bg = this.add.image(0, 0, "board");
    this.lineClear = this.sound.add("lineClear");
    bg.setOrigin(0, 0);
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;
    for (let i = 0; i < 20; i++) {
      this.gameBoard[i] = [];
      for (let j = 0; j < 10; j++) {
        this.gameBoard[i][j] = 0;
      }
    }
    this.moveCounter = 0;
    this.moveInterval = 40; // Normal falling speed
    this.moveDelay = 5;    // Delay for continuous keyboard movement
    this.refillShuffleBag();
    this.spawnBlok();
    this.cursors = this.input.keyboard.createCursorKeys();

    // **Touch Input Handlers**
    this.input.on("pointerdown", (pointer) => {
      // Initialize touch tracking
      this.swipeAccumulatorX = 0;
      this.swipeAccumulatorY = 0;
      this.previousX = pointer.x;
      this.previousY = pointer.y;
      this.touchStartX = pointer.x;
      this.touchStartY = pointer.y;
      this.touchStartTime = this.time.now;
    });

    this.input.on("pointermove", (pointer) => {
      // Handle horizontal swipes (left/right)
      if (this.previousX !== null) {
        let dx = pointer.x - this.previousX; // Distance moved since last frame
        this.swipeAccumulatorX += dx;

        // Move right when accumulated distance reaches block size
        while (this.swipeAccumulatorX >= this.blockSize) {
          if (this.isMoveValid(1)) { // Check if moving right is valid
            this.setBlokOnBoard(0);  // Clear current position
            this.currentBlok.x += this.blockSize;
            this.setBlokOnBoard(2);  // Set new position
            this.checkAndHandleLandedBlok();
          }
          this.swipeAccumulatorX -= this.blockSize;
        }

        // Move left when accumulated distance reaches block size
        while (this.swipeAccumulatorX <= -this.blockSize) {
          if (this.isMoveValid(-1)) { // Check if moving left is valid
            this.setBlokOnBoard(0);
            this.currentBlok.x -= this.blockSize;
            this.setBlokOnBoard(2);
            this.checkAndHandleLandedBlok();
          }
          this.swipeAccumulatorX += this.blockSize;
        }
      }

      // Handle vertical swipes (down for soft drop)
      if (this.previousY !== null) {
        let dy = pointer.y - this.previousY;
        if (dy > 0) { // Only accumulate downward movement
          this.swipeAccumulatorY += dy;
          while (this.swipeAccumulatorY >= this.blockSize) {
            this.setBlokOnBoard(0);
            if (!this.hasLanded()) this.currentBlok.y += this.blockSize;
            this.setBlokOnBoard(2);
            if (this.hasLanded()) this.landBlok();
            this.swipeAccumulatorY -= this.blockSize;
          }
        }
      }

      // Update previous positions
      this.previousX = pointer.x;
      this.previousY = pointer.y;
    });

    this.input.on("pointerup", (pointer) => {
      let dt = this.time.now - this.touchStartTime;
      let dx = pointer.x - this.touchStartX;
      let dy = pointer.y - this.touchStartY;

      // Swipe up for rotation
      if (dy < -this.swipeThreshold && Math.abs(dx) < this.swipeThreshold / 2) {
        this.rotateTap = true;
      }
      // Tap detection (single or double)
      else if (
        dt < this.timeThreshold &&
        Math.abs(dx) < this.tapThreshold &&
        Math.abs(dy) < this.tapThreshold
      ) {
        if (this.tapTimer) {
          // Double tap - hard drop
          this.tapTimer.remove();
          this.tapTimer = null;
          if (this.currentBlok) {
            while (!this.hasLanded()) {
              this.currentBlok.y += this.blockSize;
            }
            this.landBlok();
          }
        } else {
          // Single tap - set timer for potential double tap
          this.tapTimer = this.time.delayedCall(
            this.doubleTapThreshold,
            () => {
              this.rotateTap = true; // Single tap triggers rotation
              this.tapTimer = null;
            },
            [],
            this
          );
        }
      }
    });
  }

  refillShuffleBag() {
    const types = ["j", "i", "l", "z", "s", "t", "o"];
    this.shuffleBag = Phaser.Utils.Array.Shuffle(types.slice());
  }

  spawnBlok() {
    if (this.shuffleBag.length === 0) {
      this.refillShuffleBag();
    }
    if (!this.nextBlokType) {
      this.nextBlokType = this.shuffleBag.pop();
    }
    this.currentBlokType = this.nextBlokType;
    this.nextBlokType = this.shuffleBag.pop();
    nextBlokImage.src = "assets/Shape Blocks/" + this.nextBlokType.toUpperCase() + ".png";
    this.currentBlok = this.physics.add.image(0, this.blockSize, this.currentBlokType);
    const BlokWidth = 0.5 * this.currentBlok.displayWidth / this.blockSize;
    const xOffset = BlokWidth % 2 === 0 ? (this.blockSize * (10 - BlokWidth)) / 2 : 3 * this.blockSize;
    this.currentBlok.x = xOffset;
    this.currentBlok.y = 0;
    this.currentBlok.rotationState = 0;
    this.currentBlok.setOrigin(0, 0);
    this.currentBlok.setScale(0.5);
    this.physics.world.enable(this.currentBlok);
    this.currentBlok.body.collideWorldBounds = true;
    this.currentBlok.blocks = this.calculateBlockPositions(this.currentBlokType, 0);
    gameOver = this.isGameOver();
    if (gameOver) {
      this.displayEndGameMessage();
    }
  }

  spawnBlokAt(type, x, y, rotationState) {
    this.currentBlok = this.physics.add.image(0, this.blockSize, type);
    this.currentBlok.setOrigin(0, 0);
    this.currentBlok.setScale(0.5);
    this.physics.world.enable(this.currentBlok);
    this.currentBlok.body.collideWorldBounds = true;
    this.currentBlok.x = x + rotationStates[this.currentBlokType][rotationState][0] * this.blockSize;
    this.currentBlok.y = y + rotationStates[this.currentBlokType][rotationState][1] * this.blockSize;
    this.currentBlok.rotationState = rotationState;
    this.currentBlok.blocks = this.calculateBlockPositions(this.currentBlokType, rotationState);
  }

  isGameOver() {
    let spawnLocations = { i: [0, 3], o: [0, 4], default: [0, 3] };
    let spawnLocation = spawnLocations[this.currentBlokType] || spawnLocations["default"];
    let blockPositions = this.calculateBlockPositions(this.currentBlokType, this.currentBlok.rotationState);
    for (let block of blockPositions) {
      let x = spawnLocation[1] + block.x;
      let y = spawnLocation[0] + block.y;
      if (this.gameBoard[y] && this.gameBoard[y][x] === 1) {
        return true;
      }
    }
    return false;
  }

  displayEndGameMessage() {
    endGameContainer.style.display = "flex";
    finalScore.innerText = score;
  }

  resetGame() {
    endGameContainer.style.display = "none";
    gameOver = false;
    score = 0;
    lines = 0;
    level = 1;
    scoreNumber.innerText = 0;
    linesNumber.innerText = 0;
    levelNumber.innerText = 1;
    this.create();
  }

  calculateBlockPositions(type, rotationState) {
    const positions = [];
    const matrix = blokdrip[type][rotationState];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          positions.push({ x: j, y: i });
        }
      }
    }
    return positions;
  }

  rotate() {
    const numberOfStates = { i: 2, j: 4, l: 4, t: 4, s: 2, z: 2, o: 1 };
    let rotationState = (this.currentBlok.rotationState + 1) % numberOfStates[this.currentBlokType];
    if (!this.isRotationValid(this.currentBlokType, rotationState)) return;
    const x = this.currentBlok.x;
    const y = this.currentBlok.y;
    this.currentBlok.rotationState = rotationState;
    let rotatedType = rotationState === 0 ? this.currentBlokType : this.currentBlokType + rotationState;
    this.currentBlok.destroy();
    this.spawnBlokAt(rotatedType, x, y, rotationState);
    this.checkAndHandleLandedBlok();
  }

  isRotationValid(type, rotationState) {
    const positions = this.calculateBlockPositions(type, rotationState);
    for (let block of positions) {
      let currentBlokX = this.currentBlok.x + rotationStates[type][rotationState][0] * this.blockSize;
      let currentBlokY = this.currentBlok.y + rotationStates[type][rotationState][1] * this.blockSize;
      const x = Math.floor((currentBlokX + block.x * this.blockSize) / this.blockSize);
      const y = Math.floor((currentBlokY + block.y * this.blockSize) / this.blockSize);
      if (x > 9 || x < 0 || y < 0 || y > 19 || (this.gameBoard[y] && this.gameBoard[y][x] === 1)) {
        return false;
      }
    }
    return true;
  }

  update() {
    if (gameOver || !this.currentBlok) return;

    // Normal falling
    if (this.moveCounter >= this.moveInterval) {
      this.setBlokOnBoard(0);
      this.currentBlok.y += this.blockSize;
      this.setBlokOnBoard(2);
      this.moveCounter = 0;
      this.time.delayedCall(500, () => this.checkAndHandleLandedBlok());
    }
    this.moveCounter++;

    // Keyboard Controls
    // Left
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      if (this.isMoveValid(-1)) {
        this.setBlokOnBoard(0);
        this.currentBlok.x -= this.blockSize;
        this.setBlokOnBoard(2);
        this.checkAndHandleLandedBlok();
      }
    }
    if (this.cursors.left.isDown && this.moveCounter % this.moveDelay === 0) {
      if (this.isMoveValid(-1)) {
        this.setBlokOnBoard(0);
        this.currentBlok.x -= this.blockSize;
        this.setBlokOnBoard(2);
        this.checkAndHandleLandedBlok();
      }
    }

    // Right
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      if (this.isMoveValid(1)) {
        this.setBlokOnBoard(0);
        this.currentBlok.x += this.blockSize;
        this.setBlokOnBoard(2);
        this.checkAndHandleLandedBlok();
      }
    }
    if (this.cursors.right.isDown && this.moveCounter % this.moveDelay === 0) {
      if (this.isMoveValid(1)) {
        this.setBlokOnBoard(0);
        this.currentBlok.x += this.blockSize;
        this.setBlokOnBoard(2);
        this.checkAndHandleLandedBlok();
      }
    }

    // Down (soft drop)
    if (this.cursors.down.isDown && this.moveCounter % 3 === 0) {
      this.setBlokOnBoard(0);
      if (!this.hasLanded()) this.currentBlok.y += this.blockSize;
      this.setBlokOnBoard(2);
      if (this.hasLanded()) this.landBlok();
    }

    // Rotation
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.rotateTap) {
      this.setBlokOnBoard(0);
      this.rotate();
      this.setBlokOnBoard(2);
      this.rotateTap = false;
    }

    // Hard drop (spacebar)
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      while (!this.hasLanded()) {
        this.currentBlok.y += this.blockSize;
      }
      this.landBlok();
    }
  }

  checkAndHandleLandedBlok() {
    if (this.hasLanded()) {
      this.setBlokOnBoard(0);
      this.landBlok();
    }
  }

  isMoveValid(direction) {
    for (let block of this.currentBlok.blocks) {
      const x = Math.floor((this.currentBlok.x + block.x * this.blockSize) / this.blockSize);
      const y = Math.floor((this.currentBlok.y + block.y * this.blockSize) / this.blockSize);
      if (this.gameBoard[y][x + direction] === 1 || x + direction < 0 || x + direction > 9) {
        return false;
      }
    }
    return true;
  }

  setBlokOnBoard(value) {
    for (let block of this.currentBlok.blocks) {
      const x = Math.floor((this.currentBlok.x + block.x * this.blockSize) / this.blockSize);
      const y = Math.floor((this.currentBlok.y + block.y * this.blockSize) / this.blockSize);
      if (x >= 0 && x < 10 && y >= 0 && y < 20) {
        this.gameBoard[y][x] = value;
      }
    }
  }

  hasLanded() {
    for (let block of this.currentBlok.blocks) {
      const x = Math.floor((this.currentBlok.x + block.x * this.blockSize) / this.blockSize);
      const y = Math.floor((this.currentBlok.y + block.y * this.blockSize) / this.blockSize);
      if (y >= 19 || (y < 19 && x < 10 && this.gameBoard[y + 1][x] === 1)) {
        return true;
      }
    }
    return false;
  }

  landBlok() {
    this.setBlokOnBoard(1);
    this.replaceBlokWithBlocks();
    this.checkLines();
    this.spawnBlok();
  }

  replaceBlokWithBlocks() {
    for (let block of this.currentBlok.blocks) {
      let x = this.currentBlok.x + block.x * this.blockSize;
      let y = this.currentBlok.y + block.y * this.blockSize;
      let blockSprite = this.physics.add.image(x, y, "block-" + this.currentBlokType);
      blockSprite.setOrigin(0, 0);
      blockSprite.setScale(0.5);
      this.physics.world.enable(blockSprite);
      let i = Math.floor(y / this.blockSize);
      let j = Math.floor(x / this.blockSize);
      this.blockSprites[i][j] = blockSprite;
    }
    this.currentBlok.destroy();
    this.currentBlok = null;
  }

  checkLines() {
    let linesToRemove = [];
    let completedTweenCount = 0;
    for (let i = 19; i >= 0; i--) {
      if (this.gameBoard[i].every(cell => cell === 1)) {
        linesToRemove.push(i);
        for (let j = 0; j < 10; j++) {
          let blockSprite = this.blockSprites[i][j];
          if (blockSprite) {
            this.lineClear.play();
            this.tweens.add({
              targets: blockSprite,
              alpha: 0,
              ease: "Power1",
              duration: 50,
              yoyo: true,
              repeat: 3,
              onComplete: () => {
                blockSprite.destroy();
                completedTweenCount++;
                if (completedTweenCount === linesToRemove.length * 10) {
                  this.updateScoreAndLevel(linesToRemove);
                  this.shiftBlocks(linesToRemove);
                }
              },
            });
            this.blockSprites[i][j] = null;
          }
        }
      }
    }
  }

  shiftBlocks(linesToRemove) {
    let clearedSet = new Set(linesToRemove);
    let targetRow = 19;
    for (let i = 19; i >= 0; i--) {
      if (!clearedSet.has(i)) {
        this.gameBoard[targetRow] = this.gameBoard[i];
        this.blockSprites[targetRow] = this.blockSprites[i];
        if (this.blockSprites[targetRow]) {
          for (let j = 0; j < 10; j++) {
            if (this.blockSprites[targetRow][j]) {
              this.blockSprites[targetRow][j].y = targetRow * this.blockSize;
            }
          }
        }
        targetRow--;
      }
    }
    for (let i = targetRow; i >= 0; i--) {
      this.gameBoard[i] = new Array(10).fill(0);
      this.blockSprites[i] = new Array(10).fill(null);
    }
  }

  updateScoreAndLevel(linesToRemove) {
    let linesCleared = linesToRemove.length;
    if (linesCleared > 0) {
      let scores = [0, 40, 100, 300, 1200];
      score += scores[linesCleared] * level;
      scoreNumber.innerText = score;
      lines += linesCleared;
      linesNumber.innerText = lines;
      level = Math.floor(lines / 10) + 1;
      levelNumber.innerText = level;
      this.moveInterval = Math.max(3, 60 * Math.pow(0.8, level - 1));
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 640,
  parent: "boardContainer",
  transparent: true,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [BlokDrop],
};

window.game = new Phaser.Game(config);