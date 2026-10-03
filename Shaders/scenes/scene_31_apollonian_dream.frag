// 04 APOLLONIAN DREAM — flight through an infinite 3D Apollonian fractal (raymarched).
//
// Self-driving: every part is automated from the music.
//   bass / sub    flight speed and a slow breathing of the whole structure
//   kick          the packing BREATHES: every sphere swells and settles (the fractal itself pulses)
//   snare         the camera rolls a step
//   mids          the camera drifts and turns through the voids
//   highs         pinpoint highlights glitter on the sphere rims
//   BUILD         the light gathers ahead, the structure tightens
//   PEAK          the inner glow of the deep spheres ignites
//   CHAOS         the packing jitters between states
//   colour        three colour families, the music moves between them
// Macros: A Sphere Packing · B Glow · C Flight Speed · D Colour Family

vec3 C0, C1, C2, C3;
void setPalette()
{
    vec3 w = familyWeights(colourFamily(uMacro.w));
    // A: navy · teal · pearl · coral   B: aubergine · rose · gold · ivory   C: black · emerald · acid lime · white
    vec3 a0 = hex(198945.0),  a1 = hex(1735290.0),  a2 = hex(15200228.0), a3 = hex(16738922.0);
    vec3 b0 = hex(1704475.0), b1 = hex(12733037.0), b2 = hex(15180888.0), b3 = hex(16774623.0);
    vec3 c0 = hex(131586.0),  c1 = hex(1145162.0),  c2 = hex(12320601.0), c3 = hex(16777215.0);
    C0 = a0 * w.x + b0 * w.y + c0 * w.z; C1 = a1 * w.x + b1 * w.y + c1 * w.z;
    C2 = a2 * w.x + b2 * w.y + c2 * w.z; C3 = a3 * w.x + b3 * w.y + c3 * w.z;
}

float gTrap;

float de(vec3 p)
{
    float s = 1.12 + 0.12 * uMacro.x + 0.06 * uKick + 0.03 * uSub - 0.04 * uState.y
            + 0.03 * uState.w * sin(uHighTime * 2.0);
    float scale = 1.0;
    gTrap = 1e9;
    for (int i = 0; i < 8; i++)
    {
        p = -1.0 + 2.0 * fract(0.5 * p + 0.5);
        float r2 = dot(p, p);
        gTrap = min(gTrap, r2);
        float k = s / r2;
        p *= k;
        scale *= k;
    }
    return 0.25 * abs(p.y) / scale;
}

void main()
{
    setPalette();
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    float build = uState.y, peak = uState.z, chaos = uState.w, calm = uState.x;

    float t = uBassTime * (0.08 + 0.25 * uMacro.z) * (1.0 + 0.5 * build) + uTime * 0.02;
    vec3 ro = vec3(0.65 * sin(t * 1.3) + 0.1 * sin(uMidTime * 0.07), 0.75 + 0.2 * cos(t * 0.9), t * 2.0);
    vec3 ta = ro + vec3(0.4 * sin(t * 1.3 + 0.6), 0.15 * cos(uMidTime * 0.05), 1.0);
    vec3 fw = normalize(ta - ro);
    vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
    vec3 up = cross(fw, rt);
    uv *= rot(0.15 * sin(uMidTime * 0.03) + 0.35 * uSnare * sign(sin(uBeatClock * 3.0)));
    vec3 rd = normalize(uv.x * rt + uv.y * up + 1.4 * fw);

    float dist = 0.0, glow = 0.0, trap = 1.0;
    bool hit = false;
    for (int i = 0; i < 120; i++)
    {
        vec3 p = ro + rd * dist;
        float d = de(p);
        glow += exp(-d * 120.0) * 0.006;
        if (d < 0.0004 * dist) { hit = true; trap = gTrap; break; }
        dist += d * 0.9;
        if (dist > 8.0) break;
    }

    vec3 col = C0 * 0.5;
    if (hit)
    {
        vec3 p = ro + rd * dist;
        vec2 e = vec2(0.0005 * dist + 0.0002, 0.0);
        vec3 n = normalize(vec3(de(p + e.xyy) - de(p - e.xyy), de(p + e.yxy) - de(p - e.yxy), de(p + e.yyx) - de(p - e.yyx)));
        float ao = clamp(de(p + n * 0.02) / 0.02, 0.0, 1.0);
        vec3 ld = normalize(vec3(0.4, 0.8, -0.3));
        float dif = clamp(dot(n, ld), 0.0, 1.0);
        float head = clamp(dot(n, -rd), 0.0, 1.0);                      // light carried with the camera
        float fre = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
        float spec = pow(clamp(dot(reflect(rd, n), ld), 0.0, 1.0), 40.0);
        // colour from the orbit trap: deep spheres are dark and glow from within
        float tr = clamp(sqrt(trap), 0.0, 1.0);
        vec3 surf = ramp4(0.15 + 0.7 * tr, C0, C1, C2, C3);
        col = surf * (0.08 + 0.55 * head * head + 0.35 * dif) * (0.3 + 0.7 * ao) * (1.0 + 0.4 * uEnergyMed);
        col += mix(C2, C3, 0.5) * fre * ao * (0.15 + 0.5 * uHighMid);
        col += C3 * spec * ao * (0.3 + 1.2 * uHigh + 0.8 * uHat);
        // the inner glow of the deep spheres ignites in PEAK and on the kick
        col += mix(C1, C2, 0.5) * smoothstep(0.35, 0.0, tr) * (0.15 + 1.2 * peak * (0.4 + uLowMid) + 0.8 * uKick + 0.6 * chaos) * (1.0 - ao * 0.4);
        float fog = 1.0 - exp(-dist * (0.55 - 0.2 * build));
        col = mix(col, C0 * 0.5 + C1 * 0.18 + C2 * 0.12 * build, fog);
    }
    col += mix(C1, C2, 0.5) * glow * (0.3 + 0.9 * uMacro.y) * (0.4 + 0.8 * peak + 0.7 * uKick);
    // the light gathering ahead during BUILD
    col += C2 * build * 0.35 * exp(-length(uv) * 4.0);

    col *= 1.0 - 0.15 * calm;
    col *= smoothstep(1.5, 0.45, length(uv * vec2(0.8, 1.0)));
    col *= uIntensity * 1.7 * mix(0.6, 1.0, uActivity);
    fragColor = vec4(col, 1.0);
}
