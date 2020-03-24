document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const ctx = canvas.getContext("2d");

  const mouse = {
    x: undefined,
    y: undefined
  }

  const maxRadius = 40;

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  })

  window.addEventListener("resize", (e) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    init();
  })

  const colorArray = [
    "#084056",
    "#188367",
    "#9EA66D",
    "#FF914D",
    "#F53005"

  ]

  class Circle {
    constructor(x,y,dx,dy, radius){
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.minRadius = radius;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)]
    }

    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
      ctx.fillStyle = this.color;
      ctx.stroke();
      ctx.fill();
    }

    update(){
      if (this.x > innerWidth - this.radius || this.x < this.radius) { this.dx = -this.dx }
      if (this.y > innerHeight - this.radius || this.y < this.radius) { this.dy = -this.dy }
      this.x += this.dx;
      this.y += this.dy;
      // if (Math.abs(mouse.x - this.x < 50) && Math.abs(mouse.y - this.y < 50)) {

      if ((mouse.x - this.x < 50) && (mouse.x - this.x > -50) && (mouse.y - this.y < 50) && (mouse.y - this.y > -50)) { 
        if (this.radius < maxRadius) this.radius += 1;
      } else if (this.radius > this.minRadius){
        this.radius -= 1;
      }
      
      
      this.draw();
    }

  }

  let cirArray = [];

  function init(){
    cirArray = [];
    for (let i = 0; i < 800; i++) {
      let radius = Math.random() * 4 + 1
      let x = Math.random() * (innerWidth - radius * 2) + radius;
      let y = Math.random() * (innerHeight - radius * 2) + radius;
      let dx = (Math.random() - 0.5) * 5;
      let dy = (Math.random() - 0.5) * 5;
      cirArray.push(new Circle(x, y, dx, dy, radius))
    }
  }
  
  function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    for (let i = 0; i < cirArray.length; i++) {
      cirArray[i].update()
    }
  }
  
  init();
  animate();

})