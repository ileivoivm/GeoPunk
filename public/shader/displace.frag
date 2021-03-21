precision mediump float;
uniform sampler2D colormap;
uniform int n;
precision mediump float;

varying vec2 vTexCoord;
varying vec3 vNoise;
varying float time;
uniform float mod2;
uniform vec3  color1;
varying vec3 vNormal;

mat3 YUVFromRGB = mat3(
  vec3(0.299, -0.14713, 0.615),
  vec3(0.587, -0.28886, -0.51499),
  vec3(0.114, 0.436, -0.10001));

mat3 RGBFromYUV = mat3(
  vec3(1, 1, 1),
  vec3(0.0, -0.394, 2.03211),
  vec3(1.13983, -0.580, 0.0));

float extractLuma(vec3 c) {
  return c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
}

float grain (vec2 st) {
    return fract(sin(dot(st.xy, vec2(17.0,180.)))* 2500. + time);
}

void main(void) {
    vec2 uv = vTexCoord;
    //-------------------------------------
    vec4 s = texture2D(colormap, uv);
    vec3 yuv = YUVFromRGB * s.rgb;
    vec2 imgSize = vec2(640.0, 640.0);
    vec3 grainPlate = vec3(grain(uv));

    float accumY = 0.0;
    for (int i = -1; i <= 1; ++i) {
      for (int j = -1; j <= 1; ++j) {
        vec2 offset = vec2(i, j) / imgSize;
        float s = extractLuma(texture2D(colormap, uv + offset).rgb);
        float notCentre = min(float(i*i + j*j), 1.0);
        accumY += s * (9.0 - notCentre*10.0);
      }
    }

    accumY /= 7.0;
    //defult 9 less is sharpen
    float gain = 0.9+(mod2*0.6);
    accumY = (accumY + yuv.x)*gain;
  	vec3 color =vec3(RGBFromYUV * vec3(accumY, yuv.y, yuv.z));
    vec3 mixer = mix(color.rgb, grainPlate, .1);

    if(n==1){
  		vec4 outimg = vec4(mixer.rgb,1.0);
      gl_FragColor =vec4(outimg.rgb+color1.rgb,1.0);
  	}else{
  		vec4 outimg= vec4(1.0-mixer.r,1.0-mixer.g,1.0-mixer.b,1.0);
      gl_FragColor = vec4(outimg.rgb+color1.rgb,1.0);
    }
    //--------------------------------------
    // gl_FragColor = vec4(color1.rgb,1.0);
}
