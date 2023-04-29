// VERTEX SHADER
varying lowp vec4 vColor;

uniform float density[100];

int getIndexFromPoint(vec3 pos)
{
  int ix = int(pos.x+(2.0/2.0))/10;
  int iy = int(pos.y+(2.0/2.0))/10;
  return ix+iy*10;
}

vec4 getColourFromDensity(float density)
{
  // TODO: we dont know how large the density can get
  int x = int(min(density, 1.0)); 
  return vec4(1-x, 0, x, 1);
}

void main(void) 
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  int index = getIndexFromPoint(position);
  vColor = getColourFromDensity(density[index]);
}
