import React, { useRef } from 'react';
import Sketch from 'react-p5';
import MersenneTwister from 'mersenne-twister';
import Mappa from "mappa.js";
import 'p5.easycam.js';
//-------------------------------------------

let img,img2,back,back2;
let rx = 160,ry = 160,slitCount = 0,mapId=2,myMap ;
let pg,displace,mosaic,source,mapDefult,jsonDefult;
let radlng,radlat,radPlace,inconsolata,sobel;
let rr=0,gg=0,bb=0;
let land=[],landImg=[];
var messages, messages2,messages3,readid=0;
let formatted_address,checkJson=false;
let fontsize=20,fontPosY=50;
let fontsize2=20,fontPosY2=50;
var obj=[],objs;
let checkDot=[2000];
let checkCount=0,dis=120,radHash=0;
//-------------------------------------------
var frameCountPerCicle = 200;
var CFrameCount;
var CProgressR,CQuadEaseInR,CQuadEaseOutR,CQuartEaseInR,CQuartEaseOutR;
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
    inconsolata = p5.loadFont('HindGuntur-Light.ttf');
    displace = p5.loadShader('shader/displace.vert', 'shader/displace.frag');
    mosaic = p5.loadShader('shader/mosaic.vert', 'shader/mosaic.frag');
    sobel=p5.loadShader('shader/sobel.vert', 'shader/sobel.frag');
    land[0]=p5.loadModel('model/cone3.obj');
    land[1]=p5.loadModel('model/cube3.obj');
    land[2]=p5.loadModel('model/cross2.obj');
    land[3]=p5.loadModel('model/quad.obj');
    landImg[0]=p5.loadImage("model/cone3.png");
    landImg[1]=p5.loadImage("model/cube3.png");
    landImg[2]=p5.loadImage("model/cross3.png");
    landImg[3]=p5.loadImage("model/quad4.png");
    mapDefult=p5.loadImage("model/map.png");

    //---------------------------
    let seed = parseInt(hash.slice(0, 16), 16);
    console.log(hash);
    // console.log(seed);
    shuffleBag.current = new MersenneTwister(seed);
    // console.log(objs);

    radPlace=parseInt(shuffleBag.current.random()*6);
    radlat  =p5.nf(place[radPlace].lat + shuffleBag.current.random()*0.08-0.04,2,3);
    radlng  =p5.nf(place[radPlace].lng + shuffleBag.current.random()*0.08-0.04,2,3);
    // mapId   = 2;
    mapId   = parseInt(shuffleBag.current.random()*4);
    objs = block.transactions.map((t) => {
      let seed = parseInt(t.hash.slice(0, 16), 16);
      let invert=shuffleBag.current.random();
      // console.log(invert);
      let dir=1;
      if(invert>0.5)dir=1;
      else dir=-1;
      return {
        name:t.hash,
        z: (shuffleBag.current.random()*2+1)*dir,
        radius: seed / 500000000000000000,
      };
    });
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
    jsonAddress="https://maps.googleapis.com/maps/api/geocode/json?language=en&latlng="+options.lat+","+options.lng+"&key="+key2;
    jsonData=p5.loadJSON(jsonAddress);
    jsonDefult=p5.loadJSON("data.json")
    //---------------------------
    // img = p5.loadImage(myMap.imgUrl);
    // console.log(myMap.imgUrl);
    //---------------------------
    myMap = mappa.staticMap(options);
    function responseImg(){img = p5.loadImage(myMap.imgUrl);}
    function noresponseImg(){img = mapDefult;}
    //---------------------------
    function getRequestImg(url)  { p5.httpDo(url, "GET", false, responseImg,  noresponseImg);}
    getRequestImg(myMap.imgUrl);
    //---------------------------
  }
  //-------------------------------------------
  const setup = (p5, canvasParentRef) => {
    // Keep reference of canvas element for snapshots
    p5.createCanvas(width, height,p5.WEBGL).parent(canvasParentRef);
    p5.pixelDensity(2);
    canvasRef.current = p5;
    //-------------------------------------------
    source = p5.createGraphics(640, 640);
    pg = p5.createGraphics(640, 640);
    img2 = p5.createGraphics(640, 640);

    //-------------------------------------------
    img2.background(0);
    img2.image(img,0,0,660,660);
    p5.easycam = p5.createEasyCam({distance:dis,center: [0,5,0] });
    p5.easycam.setDistanceMin(60);
    p5.easycam.setDistanceMax(300);
    p5.noStroke();
    p5.textureWrap(p5.CLAMP);
    source.image(img, 0, 0);
    p5.textSize(0.10);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.textFont(inconsolata);
    //-------------------------------------------

    //-------------------------------------------
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

  const draw = (p5) => {
    // let WIDTH = width;
    // let HEIGHT = height;
    // let DIM = Math.min(WIDTH, HEIGHT);
    // let M = DIM / DEFAULT_SIZE;
    updateCProgress(p5);
    rr=p5.red(color1)/510;
    gg=p5.green(color1)/510;
    bb=p5.blue(color1)/510;
    //-------------------------------------------mainShape
    {
      p5.background(background);
      p5.blendMode(p5.BLEND);
      p5.noStroke();
      p5.textSize(0.10);
      p5.perspective(60 * p5.PI/180, width/height, 0.1, 5000);
      // p5.normalMaterial();
      back=p5.abs(((p5.millis()%6000) / 6000)-0.5)-0.5;
      back2=p5.millis() / 3000;
      p5.rotateZ(back);
      p5.rotateX(back);
      p5.rotateY(back2);
      p5.shader(displace);
      displace.setUniform("colormap", pg);
      displace.setUniform("mapId", mapId);
      displace.setUniform("mod1", mod1);
      displace.setUniform("mod2", mod2);
      displace.setUniform("color1", [rr,gg,bb]);
      // console.log([rr,gg,bb]);
      let checkInvert=(p5.frameCount%600);
      let checkNum;
      if(checkInvert<100)checkNum=Math.random();
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
      p5.fill(255);
      p5.model(land[mapId]);
      p5.resetShader();

      //-----------------------------draw box
      p5.push();
      {
        p5.noFill();
        p5.stroke(100,10);
        if(mapId==0){
          p5.translate(0,0.5,0);
          p5.scale(0.8,0.2,0.8);
        }
        else if(mapId==1){
          p5.translate(0,0.1,0);
          p5.scale(0.9,0.25,0.9);
        }
        else if(mapId==2){
          p5.scale(1,0.2,1);
        }
        else if(mapId==3){
          p5.translate(0,0.4,0);
          p5.scale(1,0.2,1);
        }
        p5.box(8);
      }
      p5.pop();

      //-----------------------------draw transaction
      p5.noFill();
      for(let i=0;i<objs.length;i++){
        p5.push();
        p5.translate(0,objs[i].z,0);
        p5.rotateX(3.14/2);
        if(i==radHash){
          p5.stroke(255,0,0,150);
          p5.strokeWeight(2.0);
          p5.scale(2.0);
        }else{
          p5.stroke(200,100);
          p5.strokeWeight(0.5);
          p5.scale(1.0);
        }
        p5.ellipse(0,0,objs[i].radius,objs[i].radius,20);
        p5.pop();
      }
      //-----------------------------


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



      p5.resetShader();
      p5.push();
      p5.fill(255);
      p5.rotateY(p5.millis() / 2300);
      p5.translate(2,-2,0);
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
      for(let i=0;i<5;i++){
        let e = p5.lerp(-0.2, -0.6, i/5);
        p5.point(e,0.35,0);
      }


      p5.resetShader();
      p5.noFill();
      p5.stroke(255);
      p5.strokeWeight(2);
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
      for(let i=0;i<5;i++){
        let e = p5.lerp(-0.3, -0.6, i/5);
        p5.point(e,0.35,0);
      }
      p5.strokeWeight(4);
      p5.point(-0.6,2.2,0);
      p5.point(-0.3,0.35,0);
      p5.fill(255);
      p5.text('LAT:'+radlat, -0.2, 0.2);
      p5.text('LNG:'+radlng, -0.2, 0.4);
      p5.pop();
    }
    //-------------------------------------------drawHud
    {
      let cameraZoom=p5.easycam.getDistance();
      let gridDist=p5.int(p5.map(cameraZoom,60,300,15,6));
      // console.log(cameraZoom);
      //-------------------------------------------

      //-------------------------------------------
      p5.easycam.beginHUD();
      p5.push();
      {
        p5.resetShader();
        p5.blendMode(p5.SCREEN);
        sobel.setUniform("resolution", [640.0,640.0]);
        sobel.setUniform("colormap", img2);
        if(p5.frameCount%10==0)sobel.setUniform("pos", [Math.random()*2.0-1.0,Math.random()*2.0-1.0]);
        // sobel.setUniform("vol",vol );
        sobel.setUniform("time", p5.float(p5.frameCount%100000)/1000.0);
        p5.shader(sobel);
        p5.fill(100,100);
        p5.rect(0,0,width,height);
      }
      p5.pop();
      //-----------------
      p5.resetShader();
      {
        p5.fill(100,100)
        // text(place[radPlace].name,20,60);
        p5.strokeWeight(1.0);
        for (var i = 0; i < width; i += gridDist*10) {
          p5.stroke(80,50);
          p5.line(i, 0, i, height);
          p5.line(width, i, 0, i);
        }
        checkCount=0;
        if(p5.frameCount%30===0){
          for (let i = 0; i < width; i += gridDist*10) {
            for (let j = 0; j < height; j += gridDist*10) {
              let k=p5.random(10);
              if(k>5)checkDot[checkCount]=false;
              else checkDot[checkCount]=true;
              if(checkDot[checkCount])p5.point(i,j);
              checkCount++;
            }
          }
        }
        checkCount=0;
        p5.strokeWeight(3.0);
        p5.stroke(150,100)
        for (let i = 0; i < width; i += gridDist*10) {
          for (let j = 0; j < height; j += gridDist*10) {
            if(checkDot[checkCount])p5.point(i,j);
            checkCount++;
          }
        }
      }
      //-----------------
      if (messages2!= null) {
        if (p5.frameCount%20===0) {
          fontPosY=p5.random(-100,100)+height/2;
          fontsize=p5.random(20, 40);
          readid=p5.int(p5.random(3));
        }

        if (p5.frameCount%5===0) {
          fontPosY2=p5.random(-100,100)+height/2;
          fontsize2=p5.random(10, 20);
        }
        p5.blendMode(p5.BLEND);
        p5.fill(250,p5.random(150,200));
        p5.textSize(fontsize);
        if (messages3!=null)p5.text(messages3[readid].long_name, 10, fontPosY);

        p5.textSize(fontsize2);
        p5.fill(200,60);
        if (formatted_address!=null)p5.text(formatted_address, 10, fontPosY2);
        //-----------------
        p5.textAlign(p5.CENTER,p5.CENTER);
        p5.textSize(14);
        p5.fill(150,60);

      if(checkJson){

        if(objs==null)p5.text(hash, width/2,height-height*0.05);
        else {
        if(p5.frameCount%30==0)radHash=p5.int(p5.random(objs.length));
        p5.text(objs[radHash].name, width/2,height-height*0.05);
        }
      }
      else p5.text("OFFLINE", width/2,height-height*0.05);
      }
      // drawFrame(p5,width,height);
      p5.easycam.endHUD();
    }
    //-------------------------------------------slitscan
    {
      //-----
      if (slitCount < 640) {
        rx = rx + parseInt(shuffleBag.current.random()*10-5);
        ry = ry + parseInt(shuffleBag.current.random()*4-2);
        if (slitCount === 0) {
          pg.background(130);
        }
        pg.copy(img, rx, ry, 5, 320, slitCount, 0, 5, 640);
        slitCount = slitCount + 5;
        if (slitCount === 640) {
          pg.image(landImg[mapId], 0, 0, 640, 640);

          if(jsonData.error_message!=null){
            console.log("json can't load");
            jsonData=jsonDefult;
            checkJson=false;
            // console.log(jsonData);
          }else{
            console.log("loaded");
            checkJson=true;
            // console.log(jsonData);
          }

          messages = jsonData.results;
          for (let i=0; i<messages.length; i++) obj[i]=messages[i];
          messages2 = obj[0];
          messages3=messages2.address_components;
          formatted_address=messages2.formatted_address;
        }
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
    mod1: 0.15,
    mod2: 0.7,
    color1: "hsl("+parseInt(Math.random()*360)+",90%,10%)",
    background: "hsl("+parseInt(Math.random()*360)+",80%,10%)"
  },
};
function updateCProgress(p5) {
  CFrameCount = p5.frameCount % frameCountPerCicle;
  CProgressR = CFrameCount / frameCountPerCicle;
  CQuadEaseInR = CProgressR * CProgressR;
  CQuadEaseOutR = -p5.sq(CProgressR - 1) + 1;
  CQuartEaseInR = p5.pow(CProgressR, 4);
  CQuartEaseOutR = -p5.pow(CProgressR - 1, 4) + 1;
}
export { styleMetadata };
