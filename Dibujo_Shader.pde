import gifAnimation.*;

GifMaker ficherogif;

PShader sh;

void setup() {
  size(600, 600, P2D);
  noStroke();
  sh = loadShader("dibujo.frag");
  
  ficherogif = new GifMaker( this, "Dibujo_Shader.gif");
  ficherogif.setRepeat(0);

  frameRate(30);
}


void draw() {
  sh.set("u_resolution", float(width), float(height));
  sh.set("u_time", millis() / 1000.0);
  shader(sh);
  
  rect(0,0,width,height);
  
  ficherogif.addFrame();
}
