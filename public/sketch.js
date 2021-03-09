const key2 = 'AIzaSyAwCoyAwfcVN8rYNhCYpyn9Si-5rUWySkc';
//aluan
const mappa = new Mappa('Google', key2);

// Options for map

let img, noise;
let meteorites;
let x = 0;
let rx = 160;
let ry = 160;
let pg;
let landscape;
let uv;
let displace,mosaic;
let mapId=2;
let radlng ,easycam ,radlat ;
let bgColor;
let fly=[];
let p1={
  'name':'United States',
  'lat':36.70,
  'lng':-111.08
}
let p2={
  'name':'Taiwan',
  'lat':23.79,
  'lng':120.89
}
let p3={
  'name':'Spain',
  'lat':39.35,
  'lng':-3.1
}
let p4={
  'name':'Australia',
  'lat':-24.51,
  'lng':126.88
}

let p6={
  'name':'Arab',
  'lat':21.56,
  'lng':43.72
}
let p7={
  '地點':'日本',
  'lat':36.17,
  'lng':138.29
}

let place=[p1,p2,p3,p4,p6,p7];
let radPlace;
function preload() {
  inconsolata = loadFont('inconsolata.otf');
  displace = loadShader('shader/displace.vert', 'shader/displace.frag');
  mosaic = loadShader('shader/mosaic.vert', 'shader/mosaic.frag');
  mapId= int(random(0, 3));
  if (mapId == 0) {
    landscape = loadModel('model/cone3.obj');
    uv = loadImage("model/cone3.png");
  } else if (mapId == 1) {
    landscape = loadModel('model/cube3.obj');
    uv = loadImage("model/cube3.png");
  } else if (mapId == 2) {
    landscape = loadModel('model/cross3.obj');
    uv = loadImage("model/cross3.png");
  }
  radPlace=int(random(6));
  // let radPlace=4;
  console.log(place[radPlace]);

  radlat = nf(place[radPlace].lat + random(-0.04, 0.04),2,3);
  radlng = nf(place[radPlace].lng+ random(-0.04, 0.04),2,3);

  const options = {
    lat: radlat,
    lng: radlng,
    zoom: 16,
    width: 640,
    height: 640,
    scale: 1,
    format: 'PNG',
    language: 'en',
    maptype: 'satellite',
  };

  const myMap = mappa.staticMap(options);
  img = loadImage(myMap.imgUrl);
  source = createGraphics(640, 640);
  noise = loadImage("model/noise.png");
  pg = createGraphics(640, 640);


}

function setup() {
  createCanvas(640, 640, WEBGL);
  easycam = createEasyCam({
    distance:120,
    center   : [0,0,0] });
    // camera(0, -100, 100, 0, 25, 0, 0, 1, 0);
    noStroke();
    textureWrap(CLAMP);
    bgColor=color(30,30,30) ;

    document.oncontextmenu = ()=>false;
    // Display the image
    // pg.background(255,0,0);
    source.image(img, 0, 0);
    textSize(0.15);
    textAlign(LEFT, CENTER);
    textFont(inconsolata);
    bgColor= color(random(40),random(40),random(40));
    // for(let i=0;i<500;i++){
    //   fly[i]=new flyMap();
    // }
  }


  function draw() {
    background(30);
    textSize(0.15);
    perspective(60 * PI/180, width/height, 0.1, 5000);
    push();
    // for(let i=0;i<500;i++){
    //   fly[i].display();
    //
    // }
    pop();



    let back=abs(((millis()%6000) / 6000)-0.5)-0.5;
    rotateZ(back);
    rotateX(back);
    rotateY(millis() / 3000);
    shader(displace);
    displace.setUniform("colormap", pg);
    displace.setUniform("mapId", mapId);
    displace.setUniform("uFrameCount", frameCount);
    // displace.setUniform("uNoiseTexture", pg);

    scale(12);
    stroke(255);
    strokeWeight(2);
    for(let i=0;i<100;i++){
      let e = lerp(3, -3, i/100);
      point(0,e,0);
    }
    noStroke();
    model(landscape);

    resetShader();
    push();
    fill(255);
    translate(0,3,0);
    sphere(0.05,20,20);
    translate(0,-6,0);
    sphere(0.05,20,20);
    pop();


    push();
    fill(255);
    rotateY(millis() / 2300);
    translate(2,-2,0);
    // texture(img);
    shader(mosaic);
    mosaic.setUniform("colormap", img);
    stroke(255);
    strokeWeight(0.2);
    rect(0,0,1,0.7);
    strokeWeight(2);
    for(let i=0;i<20;i++){
      let e = lerp(0.35, 1.6, i/20);
      point(-0.6,e,0);
    }
    for(let i=0;i<10;i++){
      let e = lerp(-0.2, -0.6, i/10);
      point(e,0.35,0);
    }
    resetShader();
    noFill();
    stroke(255);
    strokeWeight(1);
    rect(0,0,1,0.70);
    // translate(-0.6,1.6,0);
    strokeWeight(8);
    point(-0.6,1.6,0);
    point(-0.2,0.35,0);
    pop();

    push();
    fill(255);
    rotateY(millis() / 1100);
    translate(2.5,-2.5,0);
    stroke(255);
    strokeWeight(0.2);
    strokeWeight(2);
    for(let i=0;i<20;i++){
      let e = lerp(0.35, 2.2, i/20);
      point(-0.6,e,0);
    }
    for(let i=0;i<10;i++){
      let e = lerp(-0.3, -0.6, i/10);
      point(e,0.35,0);
    }
    strokeWeight(8);
    point(-0.6,2.2,0);
    point(-0.3,0.35,0);
    fill(255);
    text('LAT:'+radlat, 0, 0);
    text('LNG:'+radlng, 0, 0.2);
    pop();
    // sphere(5, 200, 200);
    // pop();

    rx = rx + int(random(-5, 5));
    ry = ry + int(random(-2, 2));

    if (x < 640) {
      if (x == 0) {
        pg.background(130);
      }
      pg.copy(source, rx, ry, 2, 320, x, 0, 2, 640);
      x = x + 2;
      if (x == 640) pg.image(uv, 0, 0, 640, 640);
    }
    easycam.beginHUD();
    textSize(64);
    fill(255,20)
    // text(place[radPlace].name,20,60);
    for (var i = 0; i < width; i += 80) {
      stroke(255,10);
      line(i, 0, i, height);
      line(width, i, 0, i);

    }
    easycam.endHUD();



  }

  class flyMap{
    constructor(){
      this.x=random(-100,100);
      this.y=random(-100,100);
      this.z=random(-50,50);
      this.speed=random(0,1);
      this.color=img.get(random(640),random(640));

    }

    display(){
      push();
      fill(this.color);
      if(this.y>200){
        this.y=-200;
      }else{
        this.y=this.y+this.speed;
      }
      noStroke();
      translate(this.x,this.y,this.z);
      box(0.5);
      pop();
    }

  }
