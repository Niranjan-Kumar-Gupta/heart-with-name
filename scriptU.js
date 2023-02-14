const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const btn = document.getElementById('btn1');

window.addEventListener('resize',function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let song = new Audio()
song.src = 'song.mp3'
song.load()

btn.addEventListener("click", (e)=>{
e.preventDefault();
const name1 = document.getElementById('userName').value.toUpperCase()

if (name1) {
    

document.getElementById('box1').style.display = 'none'
    
setTimeout(() => {
    

const heartX = [];
const heartY = [];
let hue = 0;

ctx.fillStyle = 'white';
ctx.font = '30px verdana';
console.log(name1[0])
ctx.fillText(name1[0],0,30);
const textCooridinates = ctx.getImageData(0,0,100,100);
let roots = []
let nameRoots = []
let rootB = []


function HeartData() {
    for (let i = 0; i <= Math.PI*0.9; i += 0.035) {
        let x = (16 * Math.sin(i) ** 3);
        heartX.push(x);
        let y = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i));
        heartY.push(y);
    }
    for (let i = Math.PI*1.1; i <= Math.PI*2; i += 0.04) {
        let x = (16 * Math.sin(i) ** 3);
        heartX.push(x);
        let y = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i));
        heartY.push(y);
    }
}
HeartData();

class Heart{
    constructor(x,y,rad,col){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.maxrad = rad + Math.random()*1.2
        this.radinc = 0;
        this.dirc = 1;
        this.dt = 0
        this.col = col
        this.vely = Math.random()*5 + 4
        this.rrad = Math.random()*0.04+0.02
    }
    drawHeart(){
        ctx.beginPath();
        ctx.strokeStyle = this.col//`hsl(${Math.random()*360},100%,50%)`;      
        ctx.lineWidth = 0.5;   
        for (let i = 0; i < heartX.length; i++) {
            let x1 = heartX[i]*this.rad + this.x;
            let y1 = heartY[i]*this.rad + this.y;
            let x2 = this.x+heartX[i]*this.rad*0.2
            let y2 = this.y+heartY[i]*this.rad*0.2
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);           
        }   
        ctx.stroke();  

    
    }
    update(){  
        this.drawHeart()    
        this.y -= this.vely
        this.rad -= this.rrad
    }
}



let hearts = []

function initHeart() {
   for (let i = 0; i < 15; i++) {
    let col = `hsl(${Math.random()*360},100%,50%)`
    let rad = Math.random()*2+1       
    hearts.push(new Heart(Math.random()*canvas.width,canvas.height*0.84,rad,col))
   }

}
initHeart()

class RootElement{
    constructor(x,y,size,i,col,vel){
        this.x = x;
        this.y = y;
        this.size = size;
        this.lightness = 70; 
        this.dt = 0;
        this.index = i
        this.col = col
        this.rootVel = vel
        
    }
    draw(){
        ctx.save();
       
        ctx.translate(this.x,this.y);
        ctx.beginPath();
        ctx.strokeStyle = this.col;    
       
        ctx.fillStyle = this.col//'hsl(140,100%,'+this.lightness+'%)';    
        ctx.arc(0,0,this.size,0,Math.PI*2)
       // ctx.fill()
        ctx.stroke()
        ctx.restore();
        this.update()
    }
    update(){
       // console.log(this.index)
        this.x += this.index*Math.sin(this.dt)*this.rootVel
        this.dt += 0.1
    }
}

class Root{
    constructor(x,y,size=1,vely=0){
        this.x=x
        this.y=y
        this.speedX = Math.random()*4 - 2;
        this.speedY = Math.random()*4 - 2;
        this.size = (Math.random()*6+4)*size; 
        this.size = this.size>5*size?5*size:this.size
        this.anglex = Math.random()*6.2;
        this.vax = Math.random()*0.6 - 0.3;
        this.vay = Math.random()*0.6 - 0.3;  
        this.angley = Math.random()*6.2; 
        this.rootElements = []
        this.elementNum = 0
        this.colS = Math.random()*360
        this.vel = Math.random()*0.04+0.04
        this.haertSize = this.size*0.15
        this.sm = size  
        this.stop = Math.random()*1+2.2  
        this.vely = vely
    }
    draw(){
        ctx.shadowBlur = 0.1; 
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        this.rootElements.forEach((ele,i)=>{
            ele.draw()   
        })        
    }
    pushEle(){     
        if (this.size>this.stop) {
            let col = `hsl(${this.elementNum*4+this.colS},100%,50%)`
            this.rootElements.push(new RootElement(this.x,this.y,this.size,this.elementNum,col,this.vel))
            this.elementNum += 1
        }        
        this.x += 2*this.speedX*Math.sin(this.anglex);
        this.y += 1*this.speedY*Math.sin(this.angley)+this.vely;
        this.anglex += 0.03//this.vax
        this.angley += 0.1//this.vay
        this.size -= 0.18
        requestAnimationFrame(this.pushEle.bind(this))
     
    }
}


let ii = 0

const nameInit = ()=>{
    for (let y = 0, y2 = textCooridinates.height; y < y2; y+=1) {
        for (let x = 0, x2 = textCooridinates.width; x < x2; x+=3) {
            hue+=0.4
            if (textCooridinates.data[(y * 4 * textCooridinates.width) + (x * 4) + 1] > 128) {
                let positionX = x + canvas.width * 0.015
                let positionY = y + canvas.height * 0.06
                let root = new Root(positionX*12 , positionY*8,0.8,0.5)
                root.pushEle()
                let root1 = new Root(positionX*12 , positionY*8,0.8,0.5)
                root1.pushEle()
                nameRoots.push(root);
                nameRoots.push(root1);
            }
        }
    }   
}


function handelRoot() {
    roots.forEach((root)=>{
        root.draw()
    
       if (root.rootElements.length>5) {
        let x = root.rootElements[root.rootElements.length-1].x
        let y = root.rootElements[root.rootElements.length-1].y
        let col = root.rootElements[root.rootElements.length-5].col

        let haert = new Heart(x,y,root.haertSize,col)
        haert.drawHeart()
       }
    })
    nameRoots.forEach((root)=>{
      root.draw()
      if (root.rootElements.length>5) {
        let x = root.rootElements[root.rootElements.length-1].x
        let y = root.rootElements[root.rootElements.length-1].y
        let col = root.rootElements[root.rootElements.length-5].col

        let haert = new Heart(x,y,root.haertSize,col)
        haert.drawHeart()
       }
    })

    rootB.forEach((root)=>{
        root.draw()       
        if (root.rootElements.length>10) {
            let x = root.rootElements[root.rootElements.length-1].x
            let y = root.rootElements[root.rootElements.length-1].y
            let col = root.rootElements[root.rootElements.length-10].col
    
            let haert = new Heart(x,y,root.haertSize*0.5,col)
            haert.drawHeart()
           }
    })
   
}

function clear() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

let fontS = 30
let fdir = 1

function nameView(x,y) {
  let txt = document.getElementById('userName').value
  fontS += 0.3*fdir
  if (fontS>30) {
     fdir*=-1
  }else if(fontS<20){
     fdir*=-1
  }
  ctx.font = `bolder ${fontS}pt Calibri serif`;
  ctx.fillStyle = `hsl(${hue*0.1},100%,50%)`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(txt,x,y);
  ctx.shadowBlur = 0;
}

function aniamte() {
    song.play()
    clear()
    hearts.forEach((ele,i) => {
        ele.update()
        if (ele.rad<0) {
            hearts.splice(i,1)
            let col = `hsl(${Math.random()*360},100%,50%)`
            let rad = Math.random()*1 +1       
            hearts.push(new Heart(Math.random()*canvas.width,canvas.height*0.84,rad,col))
            
           } 
    });
    hue += 1.5
    nameView(canvas.width*0.5,canvas.height*0.25) 
   
    handelRoot()
    
    requestAnimationFrame(aniamte)
}


    const name = document.getElementById('userName').value

    console.log(name)
    let i = 5
    let rad = canvas.width*0.022

    const interval = setInterval(() => {

   
           
            let x = rad*heartX[i] + canvas.width*0.5
            let y = 1.1*rad*heartY[i] + canvas.height*0.25
            let root = new Root(x,y,0.85,0.5)
            root.pushEle()
            roots.push(root)  
    
        
        i+=1
        if (i==heartX.length-8) {
            clearInterval(interval)
        }
    }, 10);

   
    const interval1 = setInterval(() => {

        let x = i*6-20
        let y = canvas.height*0.84
        let root = new Root(x,y,3,0.95)
        root.pushEle()
        rootB.push(root)  
    
        i+=1
    
        if (i>60) {
            clearInterval(interval1)
            
            
        }
    }, 10);

    setTimeout(() => {    
        nameInit()
     },1000);
     aniamte()
  
}, 2000);
}
});
