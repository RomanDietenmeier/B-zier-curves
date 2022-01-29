//https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Constructing_B%C3%A9zier_curves

(() => {
  let canvas = document.createElement("canvas");
  const width = 640;
  const height = 640;

  canvas.width = width;
  canvas.height = height;
  const canvasContext = canvas.getContext("2d");
  document.body.append(canvas);

  function drawClearRect(): void {
    canvasContext.beginPath();
    canvasContext.rect(0, 0, width, height);
    canvasContext.fillStyle = "#eee";
    canvasContext.fill();
    canvasContext.fillStyle = "#000";
    canvasContext.font = "20px Consolas";
    canvasContext.fillText(" Left Click: Set Point", 1, 20);
    canvasContext.fillText("Right Click: Confirm", 1, 40);
    canvasContext.fillText("Bézier curves", width - 150, 20);
  }
  drawClearRect();

  type Point = { x: number; y: number };
  const bezierPoints: Array<Point> = [];

  function drawDot(x: number, y: number, color?: string, radius = 1): void {
    canvasContext.beginPath();
    canvasContext.arc(x, y, Math.max(1, radius), 0, 2 * Math.PI);
    canvasContext.fillStyle = color ?? "#000";
    canvasContext.fill();
  }

  function addBezierPointAndDraw(x: number, y: number): void {
    if (bezierPoints.length < 1) drawClearRect();
    bezierPoints.push({ x, y });
    drawDot(x, y, "red", 3);
  }

  function factorial(n: number): number {
    if (n < 1) return 1;
    let ret = 1;
    for (let i = Math.floor(n); i > 1; i--) {
      ret *= i;
    }
    return ret;
  }

  function binomialCoefficient(n: number, k: number): number {
    console.assert(
      k <= n && k >= 0,
      `illegal binomialCoefficient ${n} over ${k}`
    );
    return factorial(n) / (factorial(k) * factorial(n - k));
  }

  function multScalarWithPoint(p: Point, s: number): Point {
    return { x: p.x * s, y: p.y * s };
  }

  function addTwoPoints(lhs: Point, rhs: Point): Point {
    return { x: lhs.x + rhs.x, y: lhs.y + rhs.y };
  }

  function calcBezierY(t: number): Point {
    console.assert(t >= 0 && t <= 1, "t out of bounds");
    let erg: Point = { x: 0, y: 0 };
    for (let i = 0; i < bezierPoints.length; i++) {
      const p = multScalarWithPoint(
        bezierPoints[i],
        binomialCoefficient(bezierPoints.length - 1, i) *
          Math.pow(1 - t, bezierPoints.length - 1 - i) *
          Math.pow(t, i)
      );
      console.log(
        `p ${i}:`,
        Math.pow(t, i),
        Math.pow(1 - t, bezierPoints.length - i),
        binomialCoefficient(bezierPoints.length, i)
      );
      erg = addTwoPoints(p, erg);
    }

    return erg;
  }

  function onClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault();
    const x = clickEvent.clientX - canvas.offsetLeft;
    const y = clickEvent.clientY - canvas.offsetTop;
    console.log(clickEvent);

    addBezierPointAndDraw(x, y);
  }

  function onConfirm(contextMenuEvent: MouseEvent): void {
    contextMenuEvent.preventDefault();
    if (bezierPoints.length < 2) return;
    for (let t = 0; t <= 1; t += 0.007) {
      const point = calcBezierY(t);

      drawDot(point.x, point.y);
    }
    console.log(bezierPoints.slice());

    bezierPoints.splice(0); //clear Array
  }

  canvas.addEventListener("click", onClick);
  canvas.addEventListener("contextmenu", onConfirm);
  const buttonConfirm = document.createElement("button");
  buttonConfirm.innerText = "Confirm";
  buttonConfirm.onclick = onConfirm;
  document.body.append(document.createElement("br"));
  document.body.append(buttonConfirm);
})();
