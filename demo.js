
function drawFrame(p5,width,height){
  p5.fill(255);
  p5.noStroke();
  p5.rect(0,0,width,height*0.05);
  p5.rect(0,height-height*0.15,width,height*0.15);
  p5.rect(0,0,width*0.05,height);
  p5.rect(width-width*0.05,0,width,height);

  p5.noFill();
  p5.stroke(50);
  p5.strokeWeight(1);
  p5.rect(0,0,width,height);
  //---------------------------------------------
  let diameter = width*0.15 * CQuartEaseOutR;
  let brush=2 * (1 - CQuartEaseOutR);
  p5.push();
  p5.strokeWeight(brush);
  p5.stroke(180);
  p5.translate(width/2,height-width*0.15);
  p5.ellipse(0,0,diameter,diameter,40);
  p5.pop();
  //-------------------------------------
  if(CFrameCount==0)runAngle=p5.random(6.28);
  p5.stroke(50);
  p5.translate(width/2,height-width*0.15);
  p5.strokeWeight(3.0);
  p5.point(0,0);
  // p5.line(-width*0.055,0,width*0.055,0);
  p5.strokeWeight(1.4);
  p5.ellipse(0,0,width*0.15,width*0.15,40);
  p5.strokeWeight(0.8);
  // p5.ellipse(0,0,width*0.15,width*0.08,40);
  p5.arc(0, 0, width*0.08, width*0.15, (runAngle+0.74)%6.28*CQuartEaseOutR, (runAngle+5.8)%6.28*CQuartEaseOutR);
  // p5.noStroke();
  p5.fill(100,50);
  p5.arc(0, 0, width*0.08, width*0.15,(runAngle+5.8)%6.28*CQuartEaseOutR,(runAngle+0.74)%6.28*CQuartEaseOutR,p5.PIE);

}
