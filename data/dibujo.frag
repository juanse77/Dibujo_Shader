#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

float scale = 6.0;

float random (vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

//N Número de sectores
vec3 poli1(in vec2 _st, in int N, in vec2 seed){
  float d = 0.;
  
  // Ángulo y radio del píxel actual
  float a = atan(_st.x, _st.y) + PI;
  float r = TWO_PI / float(N);
  
  // Afectamos de forma diferente sectores pares e impares
  if (mod(a/r, 2.) < 1.)
  		d = cos(floor(.5 + a/r) * r - a) * length(_st);
  else
        d = cos(floor(.5 + a/r) * r - a) * length(_st) * 2.;

  float val = random(seed); 
  return vec3(val-smoothstep(.4, .41, d),
             fract(val - .5) - smoothstep(.4, .41, d),
             fract(val + .5) - smoothstep(.4, .41, d));
}

mat2 rotate2d(in float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 circle(in vec2 _st, in float _radius, in vec2 seed){
    vec2 l = _st-vec2(0.5);
    float aux_cir = smoothstep(_radius-(_radius * 0.01),
                         _radius+(_radius * 0.01),
                         dot(l,l) * 4.0);
    float val = random(seed);
    
    return vec3(val - aux_cir, val + .5 - aux_cir, val - .5 - aux_cir);
}

void moveColumnsRows(inout vec2 _st){
    float off = sin(u_time);
    if (off > 0.)
    {
        if (floor(mod(_st.y * scale, 2.0)) == 1.)
    		_st.x += off;
    }
    else
    {
        if (floor(mod(_st.x * scale, 2.0)) == 1.)
    		_st.y += off;
    }
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    
    moveColumnsRows(st);
    
    float row = floor(st.y * scale);
    float col = floor(st.x * scale);
    st = fract(st*scale);
    
    if(mod(row, 2.) < 1.){
    	float pct = max(-sin(u_time), sin(u_time));
        color = circle(st, 0.5 * pct, vec2(row, row)); 
    }else{
        st -= 0.5;
        st = rotate2d(sin(u_time) * PI) * st;
        color = poli1(st, 6, vec2(col, col));
    }
	
    gl_FragColor = vec4(color, 1.0);
}