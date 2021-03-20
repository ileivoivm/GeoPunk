import React, { useRef } from 'react';
import Sketch from 'react-p5';
import MersenneTwister from 'mersenne-twister';
import Mappa from "mappa.js";
import 'p5.easycam.js';
//-------------------------------------------
let DEFAULT_SIZE = 500;
//-------------------------------------------
let frameCountPerCicle = 200;
let CFrameCount,CQuartEaseInR,CQuartEaseOutR;
let CProgressR,CQuadEaseInR,CQuadEaseOutR;
let back,back2,dis=120,mapId,landId;
let inconsolata,mapDefult;
let displace,mosaic,sobel;
let land=[],landImg=[];
let jsonFile,img,pg,img2,objs,radHash;
let checkDot=[2000],checkCount=0,title,subtitle;
let fontPosY,fontsize,readid,fontPosY2,fontsize2;
let timeLine=0,tempHash;
//-------------------------------------------
const CustomStyle = ({
  block,
  canvasRef,
  attributesRef,
  width,
  height,
  handleResize,
  mod1 = 0.75, // Example: replace any number in the code with mod1, mod2, or color values
  mod2 = 0.25,
  color1 = 'hsl(170,90%,10%)',
  background = 'hsl(110,80%,10%)',
}) => {
  const shuffleBag = useRef();
  const hoistedValue = useRef();
  const { hash } = block;
  //-------------------------------------------
  const setup = (p5, canvasParentRef) => {
    // Keep reference of canvas element for snapshots
    let _p5 = p5.createCanvas(width, height,p5.WEBGL).parent(canvasParentRef);
    canvasRef.current = p5;
    //-------------------------------------------loading
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
    jsonFile=p5.loadJSON("GeoPunk.json");
    pg = p5.createGraphics(640, 640);
    //-------------------------------------------setting
    p5.easycam = p5.createEasyCam({distance:dis,center: [0,5,0] });
    p5.easycam.setDistanceMin(60);
    p5.easycam.setDistanceMax(300);
    p5.textSize(0.10);
    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.textFont(inconsolata);
    //-------------------------------------------
    attributesRef.current = () => {
      return {
        attributes: [
          {
            display_type: 'number',
            trait_type: 'your trait here number',
            value: hoistedValue.current,
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
    let WIDTH = width;
    let HEIGHT = height;
    let DIM = Math.min(WIDTH, HEIGHT);
    let M = DIM / DEFAULT_SIZE;
    // console.log(block);
    if (p5.frameCount == 10) {
      tempHash = block;
    } else {
      timeLine=timeLine+1;
      if(tempHash!=block){
        tempHash = block;
        timeLine=0;
      }
      console.log(timeLine);
    }
    //-------------------------------------------mainShape
    p5.background(background);
    p5.blendMode(p5.BLEND);
    p5.noStroke();
    p5.textSize(0.10);
    p5.perspective(60 * p5.PI/180, width/height, 0.1, 5000);
    back=p5.abs(((p5.millis()%6000) / 6000)-0.5)-0.5;
    back2=p5.millis() / 3000;
    p5.rotateZ(back);
    p5.rotateX(back);
    p5.rotateY(back2);
    //------------------------------------------- reset shuffle bag
    {
      if(timeLine<30){
        // p5.normalMaterial();
        // p5.sphere(10,30,30);
      } else if(timeLine==30){//loading .png file
        let seed = parseInt(hash.slice(0, 16), 16);
        shuffleBag.current = new MersenneTwister(seed);
        mapId   = parseInt(shuffleBag.current.random()*4);
        landId  = parseInt(shuffleBag.current.random()*160);
        console.log(jsonFile[landId]);
        img =p5.loadImage("slitMap/"+landId+".png");
        img2=p5.loadImage("sobel/p_"+landId+".png");
        hoistedValue.current = 42;
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
      }else if(timeLine>30){
        pg.background(0);
        if(img != null)pg.image(img,0,0,640,640);
        pg.image(landImg[mapId],0,0,640,640);
        p5.shader(displace);
        displace.setUniform("colormap", pg);
        displace.setUniform("mapId", mapId);
        displace.setUniform("mod1", mod1);
        displace.setUniform("mod2", 2.0*(mod2-0.5));
        displace.setUniform("color1", [p5.red(color1)/510,p5.green(color1)/510,p5.blue(color1)/510]);
        { // post-effect-invert
          let checkInvert=(p5.frameCount%600);
          let checkNum;
          if(checkInvert<100)checkNum=Math.random();
          if(checkNum>0.8)displace.setUniform("n", 0);
          else displace.setUniform("n", 1);
          displace.setUniform("uFrameCount", p5.frameCount);
        }
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
        //-------------------------------------------draw box
        {
          p5.push();
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
          p5.pop();
        }
        //-------------------------------------------draw transaction
        {
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
              p5.stroke(250,100);
              p5.strokeWeight(0.5);
              p5.scale(1.0);
            }
            p5.ellipse(0,0,objs[i].radius,objs[i].radius,20);
            p5.pop();
          }
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
          //-------
          p5.resetShader();
          p5.push();
          p5.fill(255);
          p5.rotateY(p5.millis() / 2300);
          p5.translate(2,-2,0);
          p5.shader(mosaic);
          mosaic.setUniform("colormap", img);
          mosaic.setUniform("color1", [p5.red(color1)/510,p5.green(color1)/510,p5.blue(color1)/510]);
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
          //-------
          p5.resetShader();
          p5.noFill();
          p5.stroke(255);
          p5.strokeWeight(2);
          p5.rect(0,0,1,0.70);
          p5.strokeWeight(4);
          p5.point(-0.6,1.6,0);
          p5.point(-0.2,0.35,0);
          p5.pop();
          //-------
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
          //-------
          p5.strokeWeight(4);
          p5.point(-0.6,2.2,0);
          p5.point(-0.3,0.35,0);
          p5.fill(255);
          p5.text('LAT:'+jsonFile[landId].lat, -0.2, 0.2);
          p5.text('LNG:'+jsonFile[landId].lng, -0.2, 0.4);
          p5.pop();
        }
        //-------------------------------------------drawHud
        {
          let cameraZoom=p5.easycam.getDistance();
          let gridDist=p5.int(p5.map(cameraZoom,60,300,15,6));
          //-------------------------------------------
          p5.easycam.beginHUD();
          //-------------------------------------------
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
            // p5.image(img2,0,0,width,height);

          }
          p5.pop();
          //-------------------------------------------
          p5.resetShader();
          p5.push();
          {

            p5.image(img2,0,0,width,height);

          }
          p5.pop();
          //-------------------------------------------


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
            if(timeLine%30===0){
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
            if (timeLine%20===0) {
              fontPosY=p5.random(-100,100)+height/2;
              fontsize=p5.random(20, 40);
              readid=p5.int(p5.random(4));
              if(readid==0)title=jsonFile[landId].longnameA;
              else if(readid==1)title=jsonFile[landId].longnameB;
              else if(readid==2)title=jsonFile[landId].longnameC;
              else title=jsonFile[landId].longnameD;
            }

            if (timeLine%5===0) {
              fontPosY2=p5.random(-100,100)+height/2;
              fontsize2=p5.random(10, 20);
            }
            p5.blendMode(p5.BLEND);
            p5.fill(250,p5.random(150,200));
            p5.textSize(fontsize);

            if(title!=null)p5.text(title, 10, fontPosY);
          //
            p5.textSize(fontsize2);
            p5.fill(200,60);
            p5.text(jsonFile[landId].formatted_address, 10, fontPosY2);
          //   //-----------------
            p5.textAlign(p5.CENTER,p5.CENTER);
            p5.textSize(14);
            p5.fill(150,60);
          //


          if(objs==null)p5.text(hash, width/2,height-height*0.05);
          else {
            if(timeLine%30==0)radHash=p5.int(p5.random(objs.length));
            if(objs[radHash]!=null){
              // console.log(objs[radHash]);
              p5.text(objs[radHash].name, width/2,height-height*0.05);
            }
          }


          //
          // drawFrame(p5,width,height);
          p5.easycam.endHUD();
        }
        //-------------------------------------------
      }
    }
    //-------------------------------------------
  };

  return <Sketch setup={setup} draw={draw} windowResized={handleResize} />;
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
    color1 : "hsl("+parseInt(Math.random()*360)+",90%,10%)",
    background :"hsl("+parseInt(Math.random()*360)+",80%,10%)"
  },
};
export { styleMetadata };
