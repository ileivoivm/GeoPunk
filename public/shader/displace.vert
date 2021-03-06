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
varying vec3 vNormal;

float rand(vec3 co) {
  return fract(sin(dot(co.xyz, vec3(12.9898, 73.233, 2.3456))) * uFrameCount);
}

void main(void) {
  vTexCoord = aTexCoord;
  time = uFrameCount;
  // vec4 color = texture2D(colormap, vTexCoord);
  float speed = 0.00003;
  vec4 color = texture2D(colormap, fract(vTexCoord + uFrameCount * speed));
  float df = color.r*0.2126 + color.g*0.7152 + color.b*0.0722;
  df=pow(df*0.7, 2.0)*2.0*(1.0+mod1*4.0);
  vec4 positionVec4 = vec4(aPosition, 1.0);
  vec4 p = vec4(aPosition, 1.0);
  vec4 newVertexPos = positionVec4;


  if (mapId==0) {
    if (p.y<0.0)newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==1) {
    if (p.y<0.0)newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }
  else if (mapId==2) {
    if (p.y<0.0 && vTexCoord.x>0.2)newVertexPos.y=newVertexPos.y-(df*1.0);
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==3) {
    if (p.y<0.0)newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==4) {
    if (p.y>0.095)newVertexPos.y=newVertexPos.y+df;
    else if(p.y<-0.095) newVertexPos.y=newVertexPos.y-df;
    else newVertexPos.y=newVertexPos.y;
    gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos  ;
  }else if (mapId==5) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    vec4 newVertexPos = vec4(aNormal * df, 0.0) + positionVec4;
    vNormal = aNormal;

    if ((p.y>-1.05 && p.y<1.05) || (p.y<-1.5 || p.y>1.5)){
      if(vTexCoord.x>0.01 && vTexCoord.x<0.78)  gl_Position = uProjectionMatrix * uModelViewMatrix * newVertexPos;
      else gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
      // }
    }else {
      gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    }
  }
}
