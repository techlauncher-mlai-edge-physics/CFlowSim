// VERTEX SHADER
varying lowp vec4 vColor;

uniform sampler2D density;
uniform vec3 hiCol;
uniform vec3 lowCol;

vec4 getColourFromDensity(float density)
{
  return vec4(mix(lowCol, hiCol, density), 1.0);
}

vec2 getCoordFromPoint(vec3 pos)
{
  float x = ((pos.x + (${width} / 2.0)) / ${width});
  float y = ((-pos.y + (${height} / 2.0)) / ${height});
  return vec2(x, y);
}

void main(void)
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  highp vec2 vTextureCoord = getCoordFromPoint(position);
  vColor = getColourFromDensity(texture2D(density, vTextureCoord).r);
}
