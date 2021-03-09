import React, { useRef } from 'react';
import Sketch from 'react-p5';
import MersenneTwister from 'mersenne-twister';
import Mappa from "mappa.js";
import 'p5.easycam.js';
//------------------------------------------- help
{
  /*
  Create your Custom style to be turned into a EthBlock.art Mother NFT

  Basic rules:
   - use a minimum of 1 and a maximum of 4 "modifiers", modifiers are values between 0 and 1,
   - use a minimum of 1 and a maximum of 3 colors, the color "background" will be set at the canvas root
   - Use the block as source of entropy, no Math.random() allowed!
   - You can use a "shuffle bag" using data from the block as seed, a MersenneTwister library is provided

   Arguments:
    - block: the blockData, in this example template you are given 3 different blocks to experiment with variations, check App.js to learn more
    - mod[1-3]: template modifier arguments with arbitrary defaults to get your started
    - color: template color argument with arbitrary default to get you started

  Getting started:
   - Write p5.js code, comsuming the block data and modifier arguments,
     make it cool and use no random() internally, component must be pure, output deterministic
   - Customize the list of arguments as you wish, given the rules listed below
   - Provide a set of initial /default values for the implemented arguments, your preset.
   - Think about easter eggs / rare attributes, display something different every 100 blocks? display something unique with 1% chance?

   - check out p5.js documentation for examples!
  */
}
//-------------------------------------------
const key2 = 'AIzaSyB68yPc_unBU9fvPHyhfBqckW0EI38vqR4';
const mappa = new Mappa('Google', key2);
let jsonAddress,jsonData;
let img, noise,meteorites, bgColor;
let rx = 160,ry = 160,slitCount = 0,mapId=2,myMap ;
let landscape,uv,pg,displace,mosaic,source;
let radlng ,easycam ,radlat,radPlace,inconsolata;
let fly=[];
let checkno=15,rr=0,gg=0,bb=0;
let t0={'name':'United States','lat':38.88,'lng':-77.00};
let t1={'name':'Taiwan','lat':23.95,'lng':120.68};
let t2={'name':'Canada','lat':45.424,'lng':-75.70};
let t3={'name':'Australia','lat':-35.30,'lng':149.12};
let t4={'name':'Newtown','lat':-41.30,'lng':174.78};
let t5={'name':'United Kingdom','lat':51.50,'lng':-0.12};
let place=[t0,t1,t2,t3,t4,t5];
let land=[];
let landImg=[];
var messages, messages2,messages3,readid=0;
let formatted_address;
let fontsize=20,fontPosY=50;
var obj=[];
let checkDot=[2000];
let checkCount=0;
//-------------------------------------------
let DEFAULT_SIZE = 500;
const CustomStyle = ({
  block,
  canvasRef,
  attributesRef,
  width,
  height,
  handleResize,
  mod1 = 0.15, // Example: replace any number in the code with mod1, mod2, or color values
  mod2 = 0.25,
  color1 = 'rgb(255,255,255)',
  background = 'rgb(30,30,30)',
}) => {
  const shuffleBag = useRef();
  const hoistedValue = useRef();
  const { hash } = block;
  //-------------------------------------------
  const preload = (p5) => {
    inconsolata = p5.loadFont('RalewayDots-Regular.ttf');
    displace = p5.loadShader('shader/displace.vert', 'shader/displace.frag');
    mosaic = p5.loadShader('shader/mosaic.vert', 'shader/mosaic.frag');
    land[0]=p5.loadModel('model/cone3.obj');
    land[1]=p5.loadModel('model/cube3.obj');
    land[2]=p5.loadModel('model/cross3.obj');
    landImg[0]=p5.loadImage("model/cone3.png");
    landImg[1]=p5.loadImage("model/cube3.png");
    landImg[2]=p5.loadImage("model/cross3.png");

    //---------------------------
    let seed = parseInt(hash.slice(0, 16), 16);
    console.log(hash);
    console.log(seed);
    shuffleBag.current = new MersenneTwister(seed);
    radPlace=parseInt(shuffleBag.current.random()*6);
    radlat  =p5.nf(place[radPlace].lat + shuffleBag.current.random()*0.08-0.04,2,3);
    radlng  =p5.nf(place[radPlace].lng + shuffleBag.current.random()*0.08-0.04,2,3);
    mapId   = parseInt(shuffleBag.current.random()*3);
    //---------------------------
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
    console.log(place[radPlace],options.lat,options.lng);
    //---------------------------
    jsonAddress="https://maps.googleapis.com/maps/api/geocode/json?language=en&latlng="+
    options.lat+
    ","+
    options.lng+
    "&key="+
    key2;
    jsonData=p5.loadJSON(jsonAddress);
    //---------------------------
    myMap = mappa.staticMap(options);
    img = p5.loadImage(myMap.imgUrl);
    source = p5.createGraphics(640, 640);
    pg = p5.createGraphics(640, 640);
  }
  //-------------------------------------------
  const setup = (p5, canvasParentRef) => {
    // Keep reference of canvas element for snapshots
    let _p5 = p5.createCanvas(width, height,p5.WEBGL).parent(canvasParentRef);
    canvasRef.current = p5;
    //-------------------------------------------
    p5.easycam = p5.createEasyCam({distance:120,center: [0,0,0] });
    p5.easycam.setDistanceMin(60);
    p5.easycam.setDistanceMax(300);
    p5.noStroke();
    p5.textureWrap(p5.CLAMP);
    source.image(img, 0, 0);
    p5.textSize(0.15);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.textFont(inconsolata);
    //-------------------------------------------
    messages = jsonData.results;
    for (let i=0; i<messages.length; i++) obj[i]=messages[i];
    messages2 = obj[0];
    messages3=messages2.address_components;
    formatted_address=messages2.formatted_address;


    attributesRef.current = () => {
      return {
        // This is called when the final image is generated, when creator opens the Mint NFT modal.
        // should return an object structured following opensea/enjin metadata spec for attributes/properties
        // https://docs.opensea.io/docs/metadata-standards
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema

        attributes: [
          {
            display_type: 'number',
            trait_type: 'your trait here number',
            value: hoistedValue.current, // using the hoisted value from within the draw() method, stored in the ref.
          },

          {
            trait_type: 'your trait here text',
            value: 'replace me',
          },
        ],
      };
    };
  };
  //-------------------------------------------
  // draw() is called right after setup and in a loop
  // disabling the loop prevents controls from working correctly
  // code must be deterministic so every loop instance results in the same output

  // Basic example of a drawing something using:
  // a) the block hash as initial seed (shuffleBag)
  // b) individual transactions in a block (seed)
  // c) custom parameters creators can customize (mod1, color1)
  // d) final drawing reacting to screen resizing (M)
  const draw = (p5) => {
    let WIDTH = width;
    let HEIGHT = height;
    let DIM = Math.min(WIDTH, HEIGHT);
    let M = DIM / DEFAULT_SIZE;
    rr=p5.red(color1)/510;
    gg=p5.green(color1)/510;
    bb=p5.blue(color1)/510;
    //-------------------------------------------mainShape
    {
    p5.background(background);
    p5.noStroke();
    p5.textSize(0.15);
    p5.perspective(60 * p5.PI/180, width/height, 0.1, 5000);
    // p5.normalMaterial();
    let back=p5.abs(((p5.millis()%6000) / 6000)-0.5)-0.5;
    // console.log(back);
    p5.rotateZ(back);
    p5.rotateX(back);
    p5.rotateY(p5.millis() / 3000);
    p5.shader(displace);
    displace.setUniform("colormap", pg);
    displace.setUniform("mapId", mapId);
    displace.setUniform("mod1", mod1);
    displace.setUniform("mod2", mod2);
    displace.setUniform("color1", [rr,gg,bb]);
    // console.log([rr,gg,bb]);
    let checkInvert=(p5.frameCount%600);
    // console.log(p5.frameCount);
    let checkNum;
    if(checkInvert<100)checkNum=Math.random();
    // console.log(checkNum);
    if(checkNum>0.8)displace.setUniform("n", 0);
    else displace.setUniform("n", 1);

    displace.setUniform("uFrameCount", p5.frameCount);
    p5.scale(12);
    p5.stroke(255);
    p5.strokeWeight(2);
    for(let i=0;i<100;i++){
      let e = p5.lerp(3, -3, i/100);
      p5.point(0,e,0);
    }
    p5.noStroke();
    p5.model(land[mapId]);
    }
    //-------------------------------------------otherLine
    {
    p5.resetShader();
    p5.push();
    p5.fill(255);
    p5.translate(0,3,0);
    p5.sphere(0.05,20,20);
    p5.translate(0,-6,0);
    p5.sphere(0.05,20,20);
    p5.pop();


    p5.push();
    p5.fill(255);
    p5.rotateY(p5.millis() / 2300);
    p5.translate(2,-2,0);
    // texture(img);
    p5.shader(mosaic);
    mosaic.setUniform("colormap", img);
    mosaic.setUniform("color1", [rr,gg,bb]);
    p5.stroke(255);
    p5.strokeWeight(0.2);
    p5.rect(0,0,1,0.7);
    p5.strokeWeight(2);
    for(let i=0;i<20;i++){
      let e = p5.lerp(0.35, 1.6, i/20);
      p5.point(-0.6,e,0);
    }
    for(let i=0;i<10;i++){
      let e = p5.lerp(-0.2, -0.6, i/10);
      p5.point(e,0.35,0);
    }

    p5.resetShader();
    p5.noFill();
    p5.stroke(255);
    p5.strokeWeight(1);
    p5.rect(0,0,1,0.70);
    p5.strokeWeight(4);
    p5.point(-0.6,1.6,0);
    p5.point(-0.2,0.35,0);
    p5.pop();

    p5.push();
    p5.fill(255);
    p5.rotateY(p5.millis() / 1100);
    p5.translate(2.5,-2.5,0);
    p5.stroke(255);
    p5.strokeWeight(0.2);
    p5.strokeWeight(2);
    for(let i=0;i<20;i++){
      let e = p5.lerp(0.35, 2.2, i/20);
      p5.point(-0.6,e,0);
    }
    for(let i=0;i<10;i++){
      let e = p5.lerp(-0.3, -0.6, i/10);
      p5.point(e,0.35,0);
    }
    p5.strokeWeight(4);
    p5.point(-0.6,2.2,0);
    p5.point(-0.3,0.35,0);
    p5.fill(255);
    p5.text('LAT:'+radlat, 0, 0);
    p5.text('LNG:'+radlng, 0, 0.2);
    p5.pop();
    }
    //-------------------------------------------defultCircle
    {
      // // reset shuffle bag

      //
      // // example assignment of hoisted value to be used as NFT attribute later
      // hoistedValue.current = 42;
      //
      // objs.map((dot, i) => {
      //   p5.stroke(color1);
      //   p5.strokeWeight(1 + mod2 * 10);
      //   p5.ellipse(
      //     200 * dot.y * 6 * M,
      //     100 * dot.x * 6 * M,
      //     dot.radius * M * mod1*1.0
      //   );
      // });
    }
    //-------------------------------------------drawHud
    {
      let cameraZoom=p5.easycam.getDistance();
      let gridDist=p5.int(p5.map(cameraZoom,60,300,2,10));
      // console.log(cameraZoom);
      p5.easycam.beginHUD();
      p5.fill(255,30)
      // text(place[radPlace].name,20,60);
      p5.strokeWeight(1.0);
      for (var i = 0; i < width; i += gridDist*10) {
        p5.stroke(255,10);
        p5.line(i, 0, i, height);
        p5.line(width, i, 0, i);
      }
    checkCount=0;
    if(p5.frameCount%30==0){
      for (var i = 0; i < width; i += gridDist*10) {
        for (var j = 0; j < height; j += gridDist*10) {
          let k=p5.random(10);
          if(k>5)checkDot[checkCount]=false;
          else checkDot[checkCount]=true;
          checkCount++;
        }
      }
    }
    checkCount=0;
    p5.strokeWeight(3.0);
    p5.stroke(255,50)
    for (var i = 0; i < width; i += gridDist*10) {
      for (var j = 0; j < height; j += gridDist*10) {
          if(checkDot[checkCount])p5.point(i,j);
          checkCount++;
      }
    }
    if (messages2!= null) {
      if (p5.frameCount%20==0) {
        fontPosY=p5.random(-100,100)+height/2;
        fontsize=p5.random(40, 70);
        readid=p5.int(p5.random(3));
      }
      p5.fill(255,p5.random(255));
      p5.textSize(fontsize);
      if (messages3!=null)p5.text(messages3[readid].long_name, 10, fontPosY);

      if (p5.frameCount%5==0) {
        p5.textSize(p5.random(10, 20));
        p5.fill(p5.random(100,200),250);
        if (formatted_address!=null)p5.text(formatted_address, 10, p5.random(-200,200)+height/2);
      }
    }
    p5.easycam.endHUD();
    }
    //-------------------------------------------slitscan
    {
    rx = rx + parseInt(shuffleBag.current.random()*10-5);
    ry = ry + parseInt(shuffleBag.current.random()*4-2);
    // pg.background(Math.random()*255);
    if (slitCount < 640) {
      if (slitCount == 0) {
        pg.background(130);
        // console.log(pg);
      }
      pg.copy(img, rx, ry, 2, 320, slitCount, 0, 2, 640);
      slitCount = slitCount + 2;
      if (slitCount == 640) pg.image(landImg[mapId], 0, 0, 640, 640);
    }

    // p5.image(img,0,-3,5,3);
    // p5.image(pg,0,0,5,3);
    }
    //-------------------------------------------textAnimation

    //-------------------------------------------
  };

  return <Sketch preload={preload} setup={setup} draw={draw} windowResized={handleResize} />;
};

export default CustomStyle;

const styleMetadata = {
  name: '',
  description: '',
  image: '',
  creator_name: '',
  options: {
    mod1: 0.0,
    mod2: 0.0,
    color1: 'rgb(0,0,0)',
    background: 'rgb(30,30,30)',
  },
};

export { styleMetadata };
