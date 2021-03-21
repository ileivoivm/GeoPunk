uniform sampler2D colormap;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uFrameCount;
uniform int mapId;
uniform float mod1;
//-------------------------------------
uniform sampler2D uNoiseTexture;
varying float time;
varying vec2 vTexCoord;
varying vec3 vNoise;

float rand(vec3 co) {
  return fract(sin(dot(co.xyz, vec3(12.9898, 73.233, 2.3456))) * uFrameCount);
}

void main(void) {
  vTexCoord = aTexCoord;
  time = uFrameCount;
  // vec4 color = texture2D(colormap, vTexCoord);
  float speed = 0.00003;
  vec4 color = texture2D(colormap, fract(vTexCoord* 2.0 + uFrameCount * speed));
  float df = color.r*0.2126 + color.g*0.7152 + color.b*0.0722;
  df=pow(df*0.6, 2.0)*2.0*(1.0+mod1*8.0);
  vec4 positionVec4 = vec4(aPosition, 1.0);
  vec4 p = vec4(aPosition, 1.0);
  vec4 newVertexPos = positionVec4;

  //

  if (mapId==0) {
    if (p.y<0.0 && vTexCoord.x>0.001 && vTexCoord.x<0.999 )newVertexPos.y=newVertexPos.y-df+0.2;
    else newVertexPos.y=newVertexPos.y+0.2;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==1) {
    if (p.y<0.0 && vTexCoord.x>0.001 && vTexCoord.x<0.999 )newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }
  else if (mapId==2) {
    if (p.y<0.0 && vTexCoord.x>0.2 && vTexCoord.x<0.999 )newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==3) {
    if (p.y<0.0)newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==4) {
    if (p.y>0.095)newVertexPos.y=newVertexPos.y-df;
    else if(p.y<-0.095) newVertexPos.y=newVertexPos.y+df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }
}
