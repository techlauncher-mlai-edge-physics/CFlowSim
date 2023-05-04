// VERTEX SHADER
varying lowp vec4 vColor;

uniform float density[300]; //the size of one chunk 

int getIndexFromPoint(vec3 pos)
{
  int ix = int((pos.x + (${width} / 2.0)) * ${segX} / ${width});
  int iy = int((-pos.y + (${height} / 2.0)) * ${segY} / ${height});
  return (ix + iy * ${segXInt});
}

vec4 getColourFromDensity(float density)
{
  density = min(density, ${densityRangeHigh});
  density = max(density, ${densityRangeLow});
  density = density / ${densityRangeSize};
  return vec4(density, 0.0, 1.0 - density, 1.0);
}

void main(void) 
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  int index = getIndexFromPoint(position);
  vColor = getColourFromDensity(density[index]);
}
