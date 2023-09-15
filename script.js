// Script is one big method >>>

planck.testbed("Galton Board", (testbed) => {
  // __ VARS BLOCK __

  const BALL_SIZE = 0.15, // ball size
    NAIL_SIZE = BALL_SIZE * 4, // circle size
    LANE_SIZE = BALL_SIZE * 6, // lane width
    LANE_NUM = 25, // how many lanes
    SIZE = LANE_SIZE * LANE_NUM * 2, // board size
    LANE_MARGIN = 1.75, // gap between lanes
    BALL_NUM = 1000, // how many balls
    xPos = (x, y) => {
      return (x * 2 - Math.abs(y)) * LANE_SIZE;
    }, // X position
    yPos = (y) => {
      return SIZE - y * LANE_SIZE * LANE_MARGIN;
    }, // Y position
    LANE_TOP_YPOS = yPos(LANE_NUM), // top coordinates for lanes
    LANE_LENGTH = SIZE / 1.6 + LANE_TOP_YPOS; // lane length

  // __ CORE BLOCK __

  // add core
  const pl = planck;
  const Vec2 = pl.Vec2;
  // create new world and adding gravity
  const world = pl.World({
    gravity: Vec2(0, -70),
  });
  // create a board
  const board = world.createBody();
  // colors
  board.render = { fill: "#1e5f74", stroke: "#1e5f74" };

  // __ DRAW A BOARD __

  // left
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
  // right
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
  // draw lanes
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
  // draw columns
  for (let y = 1; y <= LANE_NUM; y++) {
    // chequerwise
    for (let x = 0; x <= Math.abs(y); x++) {
      //
      board.createFixture(pl.Circle(Vec2(xPos(x, y), yPos(y)), NAIL_SIZE));
    }
  }

  // __ BALLS __

  // timer
  let dropBallsId = 0;
  // balls array
  let balls = [];
  // function to drop balls
  const dropBall = () => {
    // creat ball
    const ball = world.createDynamicBody({
      // random position
      position: Vec2(xPos(2, -2) * 2 * Math.random() - xPos(2, -2), yPos(-2)),
    });
    // draw a ball
    ball.render = { fill: "#fcdab7", stroke: "#1e5f74" };
    // ball params
    ball.createFixture(pl.Circle(BALL_SIZE), {
      density: 1000.0,
      friction: 10,
      restitution: 0.3,
    });
    // add ball
    balls.push(ball);
  };

  // balls in turn
  const dropBalls = (ballNum) => {
    // interval
    dropBallsId = setInterval(() => {
      // drop
      dropBall();
      // count down
      ballNum--;
      // stop when no balls
      if (ballNum <= 0) {
        clearInterval(dropBallsId);
      }
    }, 200);
  };
  // drop balls
  dropBalls(BALL_NUM);

  // __ CONTRALS __

  // kill balls
  const clearBalls = () => {
    balls.forEach((ball) => {
      // cleare from balls
      world.destroyBody(ball);
    });
    // cleare the balls array
    balls = [];
    // stop dropping
    clearInterval(dropBallsId);
  };

  // add keys touching
  testbed.keydown = (code, char) => {
    // looking what has been presed
    switch (char) {
      // restart
      case "X":
        clearBalls();
        dropBalls(BALL_NUM);
        break;
      // one ball
      case "D":
        dropBall();
        break;
      // cleare
      case "C":
        clearBalls();
        break;
    }
  };

  return world;
});
