#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D colormap;
uniform vec2 resolution;
varying vec2 vTexCoord;
uniform float vol ;
uniform vec2 pos;
uniform float time;

void main()
{
		//float t=abs(fract(time)-0.5)+0.5;
		// vec2 uv1= fract(vTexCoord*0.8);
    vec2 uv = fract(vTexCoord*1.0+pos);
		// uv.x= modf(uv.x*2.0,0.8);
		// uv.y= modf(uv.y*2.0,0.8);
		float v=vol;
		float t=time;
		// float target=2.0*abs(fract(time*0.5)-0.5)+1.0-vol;
		float target=0.5;

    vec3 TL = texture2D(colormap, uv + vec2(-target, target)/ resolution.xy).rgb;
    vec3 TM = texture2D(colormap, uv + vec2(0, target)/ resolution.xy).rgb;
    vec3 TR = texture2D(colormap, uv + vec2(target, target)/ resolution.xy).rgb;

    vec3 ML = texture2D(colormap, uv + vec2(-target, 0)/ resolution.xy).rgb;
    vec3 MR = texture2D(colormap, uv + vec2(target, 0)/ resolution.xy).rgb;

    vec3 BL = texture2D(colormap, uv + vec2(-target, -target)/ resolution.xy).rgb;
    vec3 BM = texture2D(colormap, uv + vec2(0, -target)/ resolution.xy).rgb;
    vec3 BR = texture2D(colormap, uv + vec2(target, -target)/ resolution.xy).rgb;

    vec3 GradX = -TL + TR - 2.0 * ML + 2.0 * MR - BL + BR;
    vec3 GradY = TL + 2.0 * TM + TR - BL - 2.0 * BM - BR;
		float alpha=texture2D(colormap,uv ).a;

    gl_FragColor.r = length(vec2(GradX.r, GradY.r))*0.15;
		gl_FragColor.g = length(vec2(GradX.r, GradY.r))*0.15;
		gl_FragColor.b = length(vec2(GradX.r, GradY.r))*0.15;
    // gl_FragColor.g = length(vec2(GradX.g, GradY.g))*0.0;
    // gl_FragColor.b = length(vec2(GradX.b, GradY.b))*0.0;
		gl_FragColor.a = 1.0;
		// gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}
