precision mediump float;

uniform sampler2D colormap;
uniform vec2 resolution;
float tile_num = 8.0;
uniform vec3  color1;
varying vec2 vTexCoord;

void main() {

  vec2 uv = vTexCoord;

  uv.y = (1.0-uv.y);
  uv = floor(uv*tile_num)/tile_num;
  vec4 outimg = texture2D( colormap, uv );
  gl_FragColor= vec4(outimg.rgb+color1.rgb,1.0);

}
