#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D colormap;
uniform vec2 resolution;
varying vec2 vTexCoord;
uniform vec2 pos;


void main()
{
		//float t=abs(fract(time)-0.5)+0.5;
		// vec2 uv1= fract(vTexCoord*0.8);
    vec2 uv = fract(vTexCoord*1.0+pos);
		vec4 gray=texture2D(colormap,uv);

    gl_FragColor.r = gray.r*0.2;
		gl_FragColor.g = gray.g*0.2;
		gl_FragColor.b = gray.b*0.2;
		gl_FragColor.a = 1.0;

}
