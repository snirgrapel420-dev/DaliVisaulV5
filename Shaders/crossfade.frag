// Scene transition as a DIMENSIONAL PORTAL: uTex = outgoing scene, uLayer = incoming scene.
// A ring opens from the centre; inside it the new world, outside the old one is pulled toward it,
// the rim burns with light and space swirls around it.
uniform sampler2D uLayer;
uniform float uMix;
void main()
{
    vec2 uv = screenUV();
    float asp = uRes.x / uRes.y;
    vec2 p = (uv - 0.5) * vec2(asp, 1.0);
    float r = length(p);
    float e = uMix * uMix * (3.0 - 2.0 * uMix);                 // eased opening
    float R = e * (0.6 * asp + 0.7);                              // portal radius, beyond the corners at the end
    float edge = r - R;
    // outside: the old world is drawn toward the portal and swirls
    float pull = exp(-max(edge, 0.0) * 3.0) * (1.0 - e) * 0.25;
    float swirl = exp(-abs(edge) * 6.0) * 1.2 * sin(e * PI);
    vec2 po = p * (1.0 - pull) ;
    po = rot(swirl) * po;
    vec3 a = texture(uTex, po / vec2(asp, 1.0) + 0.5).rgb;
    // inside: the new world, slightly magnified as it arrives
    vec2 pi = p * (0.85 + 0.15 * e);
    vec3 b = texture(uLayer, pi / vec2(asp, 1.0) + 0.5).rgb;
    float inside = smoothstep(0.012, -0.012, edge);
    vec3 col = mix(a, b, inside);
    // the burning rim, tinted by both worlds
    float rim = exp(-abs(edge) * 70.0) * sin(e * PI);
    col += (a + b + 0.3) * rim * 1.4;
    fragColor = vec4(col, 1.0);
}
