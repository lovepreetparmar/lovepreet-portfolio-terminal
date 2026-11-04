type Pen = CanvasRenderingContext2D;

function circle(ctx: Pen, x: number, y: number, r: number, fill = false) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function line(ctx: Pen, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function roundRect(ctx: Pen, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
}

function poly(ctx: Pen, points: Array<[number, number]>, close = true) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
  if (close) {
    ctx.closePath();
  }
  ctx.stroke();
}

function cylinder(ctx: Pen, x: number, y: number, w: number, h: number) {
  const ry = Math.max(2.2, w * 0.16);
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, x - w / 2, y, x - w / 2, y + h);
  line(ctx, x + w / 2, y, x + w / 2, y + h);
  ctx.beginPath();
  ctx.ellipse(x, y + h, w / 2, ry, 0, 0, Math.PI);
  ctx.stroke();
}

const icons: Record<string, (ctx: Pen) => void> = {
  react(ctx) {
    circle(ctx, 12, 12, 1.5, true);
    ctx.beginPath();
    ctx.ellipse(12, 12, 9, 3.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(12, 12, 9, 3.4, Math.PI / 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(12, 12, 9, 3.4, -Math.PI / 3, 0, Math.PI * 2);
    ctx.stroke();
  },
  next(ctx) {
    roundRect(ctx, 4, 4, 16, 16, 4);
    poly(ctx, [[9, 16], [9, 8], [15, 12], [9, 16]], false);
  },
  typescript(ctx) {
    roundRect(ctx, 4, 3.5, 16, 17, 3);
    line(ctx, 8, 10, 16, 10);
    line(ctx, 12, 10, 12, 16);
    line(ctx, 9, 16, 15, 16);
  },
  tailwind(ctx) {
    ctx.beginPath();
    ctx.moveTo(3, 9);
    ctx.bezierCurveTo(6, 5, 9, 5, 12, 9);
    ctx.bezierCurveTo(15, 13, 18, 13, 21, 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, 15);
    ctx.bezierCurveTo(6, 11, 9, 11, 12, 15);
    ctx.bezierCurveTo(15, 19, 18, 19, 21, 15);
    ctx.stroke();
  },
  html(ctx) {
    poly(ctx, [[9, 6], [4, 12], [9, 18]], false);
    poly(ctx, [[15, 6], [20, 12], [15, 18]], false);
  },
  css(ctx) {
    line(ctx, 4, 7, 20, 7);
    line(ctx, 6, 12, 18, 12);
    line(ctx, 8, 17, 16, 17);
  },
  "react-native"(ctx) {
    roundRect(ctx, 7, 2.5, 10, 19, 2);
    line(ctx, 10, 18.5, 14, 18.5);
    circle(ctx, 12, 10, 1.1, true);
  },
  jquery(ctx) {
    circle(ctx, 12, 12, 8);
    ctx.beginPath();
    ctx.arc(12, 12, 4.2, Math.PI * 0.2, Math.PI * 1.45);
    ctx.stroke();
  },
  javascript(ctx) {
    roundRect(ctx, 5, 3, 14, 18, 2);
    line(ctx, 8, 8, 16, 8);
    line(ctx, 8, 12, 14, 12);
    line(ctx, 8, 16, 12, 16);
  },
  node(ctx) {
    poly(ctx, [[12, 3], [20, 7.5], [20, 16.5], [12, 21], [4, 16.5], [4, 7.5]]);
  },
  express(ctx) {
    circle(ctx, 5, 16, 1.6, true);
    circle(ctx, 12, 8, 1.6, true);
    circle(ctx, 19, 16, 1.6, true);
    line(ctx, 6.4, 14.8, 10.6, 9.2);
    line(ctx, 13.4, 9.2, 17.6, 14.8);
  },
  php(ctx) {
    roundRect(ctx, 4, 3, 16, 18, 2);
    line(ctx, 4, 8, 20, 8);
    circle(ctx, 12, 14.5, 2.4);
  },
  mysql(ctx) {
    cylinder(ctx, 12, 5, 14, 12);
  },
  codeigniter(ctx) {
    ctx.beginPath();
    ctx.moveTo(12, 20);
    ctx.bezierCurveTo(5, 14, 6, 7, 12, 3);
    ctx.bezierCurveTo(18, 7, 19, 14, 12, 20);
    ctx.stroke();
  },
  wordpress(ctx) {
    roundRect(ctx, 5, 4, 14, 16, 2);
    line(ctx, 8, 9, 16, 9);
    line(ctx, 8, 13, 14, 13);
    line(ctx, 8, 16.5, 12, 16.5);
  },
  firebase(ctx) {
    poly(ctx, [[12, 3], [18, 14], [12, 21], [6, 14]]);
  },
  laravel(ctx) {
    poly(ctx, [[4, 18], [12, 4], [20, 18]], false);
    line(ctx, 8, 18, 12, 11);
  },
  bootstrap(ctx) {
    roundRect(ctx, 4, 4, 7, 7, 1.5);
    roundRect(ctx, 13, 4, 7, 7, 1.5);
    roundRect(ctx, 4, 13, 7, 7, 1.5);
    roundRect(ctx, 13, 13, 7, 7, 1.5);
  },
  ajax(ctx) {
    ctx.beginPath();
    ctx.arc(12, 12, 6.2, Math.PI * 0.2, Math.PI * 1.25);
    ctx.stroke();
    poly(ctx, [[6.4, 16.6], [4.4, 12.6], [8.6, 13.2]], false);
    ctx.beginPath();
    ctx.arc(12, 12, 6.2, Math.PI * 1.2, Math.PI * 2.25);
    ctx.stroke();
    poly(ctx, [[17.6, 7.4], [19.6, 11.4], [15.4, 10.8]], false);
  },
  json(ctx) {
    ctx.beginPath();
    ctx.moveTo(10, 5);
    ctx.bezierCurveTo(5, 5, 5, 9, 8, 12);
    ctx.bezierCurveTo(5, 15, 5, 19, 10, 19);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(14, 5);
    ctx.bezierCurveTo(19, 5, 19, 9, 16, 12);
    ctx.bezierCurveTo(19, 15, 19, 19, 14, 19);
    ctx.stroke();
  },
  sql(ctx) {
    cylinder(ctx, 12, 4, 14, 6);
    line(ctx, 6, 13, 18, 13);
    line(ctx, 6, 16.5, 18, 16.5);
  },
  mysqli(ctx) {
    cylinder(ctx, 12, 4, 14, 8);
    circle(ctx, 12, 18.5, 2);
  },
  docker(ctx) {
    roundRect(ctx, 3, 9, 5, 4, 0.8);
    roundRect(ctx, 9, 9, 5, 4, 0.8);
    roundRect(ctx, 15, 9, 5, 4, 0.8);
    roundRect(ctx, 9, 4.5, 5, 4, 0.8);
    ctx.beginPath();
    ctx.moveTo(3, 13);
    ctx.bezierCurveTo(3, 19, 8, 21, 13, 20);
    ctx.bezierCurveTo(18, 21, 22, 17, 21, 13);
    ctx.stroke();
  },
  gcp(ctx) {
    ctx.beginPath();
    ctx.moveTo(6, 16);
    ctx.bezierCurveTo(3, 16, 3, 11, 7, 11);
    ctx.bezierCurveTo(8, 7, 15, 6, 17, 10);
    ctx.bezierCurveTo(21, 10, 22, 16, 18, 16);
    ctx.closePath();
    ctx.stroke();
  },
  github(ctx) {
    circle(ctx, 6, 7, 2);
    circle(ctx, 18, 7, 2);
    circle(ctx, 12, 17.5, 2);
    line(ctx, 8, 7, 16, 7);
    line(ctx, 7, 8.6, 10.4, 16.2);
    line(ctx, 17, 8.6, 13.6, 16.2);
  },
  linux(ctx) {
    roundRect(ctx, 3, 4, 18, 14, 2);
    line(ctx, 6, 15, 9, 12);
    line(ctx, 9, 12, 11, 14);
    line(ctx, 3, 18, 21, 18);
  },
  kali(ctx) {
    poly(ctx, [[12, 3], [20, 6.5], [18.5, 14], [12, 21], [5.5, 14], [4, 6.5]]);
  },
  photoshop(ctx) {
    roundRect(ctx, 3, 5, 18, 14, 2);
    circle(ctx, 12, 12, 3.2);
    circle(ctx, 17.2, 8, 1.1, true);
  },
  inkscape(ctx) {
    poly(ctx, [[5, 19], [14, 5], [19, 8], [10, 21]], false);
    line(ctx, 14, 5, 16, 3);
  },
  eclipse(ctx) {
    ctx.beginPath();
    ctx.arc(10.5, 12, 7, Math.PI * 0.32, Math.PI * 1.68);
    ctx.arc(14.4, 12, 5.4, Math.PI * 1.52, Math.PI * 0.48, true);
    ctx.closePath();
    ctx.fill();
  },
  sublime(ctx) {
    roundRect(ctx, 4, 3, 16, 18, 2);
    line(ctx, 7, 8, 17, 8);
    line(ctx, 7, 12, 15, 12);
    line(ctx, 7, 16, 12, 16);
  },
  word(ctx) {
    roundRect(ctx, 5, 3, 14, 18, 2);
    line(ctx, 8, 8, 16, 8);
    line(ctx, 8, 12, 16, 12);
    line(ctx, 8, 16, 13, 16);
  },
  excel(ctx) {
    roundRect(ctx, 4, 4, 16, 16, 2);
    line(ctx, 4, 9.5, 20, 9.5);
    line(ctx, 4, 14.5, 20, 14.5);
    line(ctx, 10, 4, 10, 20);
    line(ctx, 15, 4, 15, 20);
  },
  powerpoint(ctx) {
    roundRect(ctx, 3, 6, 14, 12, 1.5);
    line(ctx, 17, 8, 21, 6);
    line(ctx, 21, 6, 21, 18);
    line(ctx, 21, 18, 17, 16);
  },
  office(ctx) {
    roundRect(ctx, 3, 8, 18, 12, 2);
    line(ctx, 8, 8, 8, 6);
    line(ctx, 8, 6, 16, 6);
    line(ctx, 16, 6, 16, 8);
  },
  "logo-design"(ctx) {
    circle(ctx, 12, 12, 6);
    circle(ctx, 12, 12, 2.2);
  },
  "poster-design"(ctx) {
    roundRect(ctx, 6, 3, 12, 18, 1.5);
    line(ctx, 9, 8, 15, 8);
    line(ctx, 9, 12, 15, 12);
  },
  "graphic-design"(ctx) {
    poly(ctx, [[4, 16], [10, 6], [16, 16]]);
    circle(ctx, 17.5, 8, 2.4);
  },
  "software-design"(ctx) {
    roundRect(ctx, 3, 4, 18, 13, 2);
    line(ctx, 3, 8, 21, 8);
    line(ctx, 8, 17, 6, 20);
    line(ctx, 16, 17, 18, 20);
  },
  "web-development"(ctx) {
    roundRect(ctx, 3, 4, 18, 14, 2);
    line(ctx, 3, 8, 21, 8);
    poly(ctx, [[8, 11], [6, 13.5], [8, 16]], false);
    poly(ctx, [[12, 11], [14, 13.5], [12, 16]], false);
  },
  "web-applications"(ctx) {
    roundRect(ctx, 6, 6, 14, 12, 2);
    roundRect(ctx, 3, 9, 14, 11, 2);
  },
  "web-services"(ctx) {
    circle(ctx, 6, 8, 2.2);
    circle(ctx, 18, 8, 2.2);
    circle(ctx, 12, 17, 2.2);
    line(ctx, 8, 9, 16, 9);
    line(ctx, 7.4, 9.6, 10.6, 15.4);
    line(ctx, 16.6, 9.6, 13.4, 15.4);
  },
  "php-applications"(ctx) {
    roundRect(ctx, 4, 3, 16, 14, 2);
    line(ctx, 4, 7, 20, 7);
    circle(ctx, 12, 20, 1.8);
    line(ctx, 12, 17, 12, 18.2);
  },
  research(ctx) {
    circle(ctx, 10.5, 10.5, 5.5);
    line(ctx, 14.4, 14.4, 20, 20);
  },
  "strategic-planning"(ctx) {
    circle(ctx, 12, 12, 8);
    circle(ctx, 12, 12, 4.2);
    circle(ctx, 12, 12, 1.3, true);
  },
  "social-media"(ctx) {
    circle(ctx, 6, 12, 2.3);
    circle(ctx, 18, 7, 2.3);
    circle(ctx, 18, 17, 2.3);
    line(ctx, 8.2, 11, 15.8, 7.8);
    line(ctx, 8.2, 13, 15.8, 16.2);
  },
  management(ctx) {
    circle(ctx, 12, 6, 2.2);
    circle(ctx, 6, 16, 2.2);
    circle(ctx, 18, 16, 2.2);
    line(ctx, 12, 8.2, 6.6, 13.8);
    line(ctx, 12, 8.2, 17.4, 13.8);
  },
  leadership(ctx) {
    poly(ctx, [[7, 21], [7, 4], [18, 8], [7, 12]], false);
  },
  "ethical-hacking"(ctx) {
    roundRect(ctx, 5, 10, 14, 10, 2);
    ctx.beginPath();
    ctx.arc(12, 10, 4, Math.PI, 0);
    ctx.stroke();
    circle(ctx, 12, 15, 1.2, true);
  },
  "information-technology"(ctx) {
    roundRect(ctx, 4, 4, 16, 16, 2);
    line(ctx, 9, 4, 9, 20);
    line(ctx, 15, 4, 15, 20);
    line(ctx, 4, 9, 20, 9);
    line(ctx, 4, 15, 20, 15);
  },
  "coding-languages"(ctx) {
    poly(ctx, [[9, 6], [4, 12], [9, 18]], false);
    poly(ctx, [[15, 6], [20, 12], [15, 18]], false);
    line(ctx, 13, 5, 11, 19);
  },
  tools(ctx) {
    line(ctx, 5, 19, 14, 10);
    circle(ctx, 16, 8, 3.2);
    line(ctx, 8, 16, 6, 18);
  },
};

export function drawCraftIcon(
  ctx: Pen,
  id: string,
  color: string,
  centerX = 256,
  centerY = 208,
  scale = 6.5,
) {
  const draw = icons[id] ?? icons.tools;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.45;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx);
  ctx.restore();
}
