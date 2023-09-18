// Script consists of one large method >>>

planck.testbed("Galton Board", (testbed) => {
  // __ VARIABLES BLOCK __

  const BALL_SIZE = 0.105; // Scaling factor for ball size
  const NAIL_SIZE = BALL_SIZE * 4; // Size of the circular nails
  const LANE_SIZE = BALL_SIZE * 6; // Width of each lane
  const LANE_NUM = 25; // Number of lanes
  const SIZE = LANE_SIZE * LANE_NUM * 2; // Size of the board
  const LANE_MARGIN = 1.75; // Gap between lanes
  const BALL_NUM = 1000; // Number of balls
  const xPos = (x, y) => {
    return (x * 2 - Math.abs(y)) * LANE_SIZE;
  }; // Calculate X position
  const yPos = (y) => {
    return SIZE - y * LANE_SIZE * LANE_MARGIN;
  }; // Calculate Y position
  const LANE_TOP_YPOS = yPos(LANE_NUM); // Top coordinates for lanes
  const LANE_LENGTH = SIZE / 1.6 + LANE_TOP_YPOS; // Length of each lane

  // __ CORE BLOCK __

  // Adding core
  const pl = planck;
  const Vec2 = pl.Vec2;
  // Create a new world and set gravity
  const world = pl.World({
    gravity: Vec2(0, -70),
  });
  // Create a board
  const board = world.createBody();
  // Colors
  board.render = { fill: "#2F3640", stroke: "#2F3640" };

  // __ DRAW THE BOARD __

  // Left side
  board.createFixture(
    pl.Chain([
      Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, yPos(-3)),
      Vec2(xPos(0, -3), yPos(-3)),
      Vec2(xPos(0, -1), yPos(-1)),
      Vec2(xPos(0, 1), yPos(1)),
      Vec2(xPos(0, LANE_NUM), LANE_TOP_YPOS),
      Vec2(xPos(0, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
      Vec2(
        xPos(0, LANE_NUM) + NAIL_SIZE,
        LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE
      ),
      Vec2(0, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
      Vec2(0, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
      Vec2(
        xPos(0, LANE_NUM) - NAIL_SIZE,
        LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE
      ),
      Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
    ])
  );
  // Right side
  board.createFixture(
    pl.Chain([
      Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, yPos(-3)),
      Vec2(xPos(3, -3), yPos(-3)),
      Vec2(xPos(1, -1), yPos(-1)),
      Vec2(xPos(1, 1), yPos(1)),
      Vec2(xPos(LANE_NUM, LANE_NUM), LANE_TOP_YPOS),
      Vec2(xPos(LANE_NUM, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
      Vec2(
        xPos(LANE_NUM, LANE_NUM) - NAIL_SIZE,
        LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE
      ),
      Vec2(0, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
      Vec2(0, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
      Vec2(
        xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE,
        LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE
      ),
      Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
    ])
  );
  // Draw lanes
  for (let x = 1; x < LANE_NUM; x++) {
    board.createFixture(
      pl.Chain([
        Vec2(xPos(x, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH),
        Vec2(xPos(x, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
        Vec2(xPos(x, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
        Vec2(xPos(x, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH),
      ])
    );
  }
  // Draw columns
  for (let y = 1; y <= LANE_NUM; y++) {
    // Checkerboard pattern
    for (let x = 0; x <= Math.abs(y); x++) {
      board.createFixture(pl.Circle(Vec2(xPos(x, y), yPos(y)), NAIL_SIZE));
    }
  }

  // __ BALLS __

  // Timer
  let dropBallsId = 0;
  // Balls array
  let balls = [];
  // Function to drop balls
  const dropBall = () => {
    // Create a ball
    const ball = world.createDynamicBody({
      // Random position
      position: Vec2(xPos(2, -2) * 2 * Math.random() - xPos(2, -2), yPos(-2)),
    });
    // Set ball appearance
    ball.render = { fill: "#F375F3", stroke: "#F375F3" };
    // Ball parameters
    ball.createFixture(pl.Circle(BALL_SIZE), {
      density: 1000.0,
      friction: 10,
      restitution: 0.3,
    });
    // Add the ball
    balls.push(ball);
  };

  // Drop balls one by one
  const dropBalls = (ballNum) => {
    // Interval
    dropBallsId = setInterval(() => {
      // Drop a ball
      dropBall();
      // Decrease ball count
      ballNum--;
      // Stop when no more balls to drop
      if (ballNum <= 0) {
        clearInterval(dropBallsId);
      }
    }, 200);
  };
  // Start dropping balls
  dropBalls(BALL_NUM);

  // __ CONTROLS __

  // Clear all balls
  const clearBalls = () => {
    balls.forEach((ball) => {
      // Remove the ball from the world
      world.destroyBody(ball);
    });
    // Clear the balls array
    balls = [];
    // Stop dropping balls
    clearInterval(dropBallsId);
  };

  // Add keyboard controls
  testbed.keydown = (code, char) => {
    // Check which key was pressed
    switch (char) {
      // Restart with new balls
      case "X":
        clearBalls();
        dropBalls(BALL_NUM);
        break;
      // Drop a single ball
      case "D":
        dropBall();
        break;
      // Clear all balls
      case "C":
        clearBalls();
        break;
    }
  };

  return world;
});
