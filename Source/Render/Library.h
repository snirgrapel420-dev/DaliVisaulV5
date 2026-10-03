#pragma once
// ============================================================================
//  Library — static descriptions of the 8 scenes and 20 effects.
//  Pure data (no JUCE / GL) so parameters, UI, engine and tools share it.
// ============================================================================
#include <array>

namespace dali
{
struct SceneInfo
{
    const char* id;
    const char* name;
    const char* resource;          // BinaryData resource name
    const char* macro[4];          // scene-specific names of macros A..D
    const char* description;
};

inline const std::array<SceneInfo, 6>& sceneLibrary();

/** Index of the Image Reactor scene (the scene that renders the loaded image itself). */
constexpr int kImageSceneIndex = 5;

// The scenes are self-driving: every moving part is automated from the music inside the scene
// (camera, geometry, light, colour evolution with the musical state). The macros only set character.
inline const std::array<SceneInfo, 6>& sceneLibrary()
{
    static const std::array<SceneInfo, 6> s { {
        { "kali",     "01  KALI CATHEDRAL",    "scene_09_kali_cathedral_frag",    { "Fold Twist", "Complexity", "Flight Speed", "Glow" },
          "Flight through a raymarched fractal cathedral. Bass flies you forward, kicks ignite the walls, snares twist the folds, the light and colour evolve with the music." },
        { "tidal",    "02  TIDAL CATHEDRAL",   "scene_19_tidal_cathedral_frag",   { "Architecture", "Caustics", "Drift Speed", "Colour Family" },
          "Drifting through an alien cathedral under the sea. Kick: a wave of light runs down the nave. Build: the camera rises and the light dims. Peak: light floods in." },
        { "tunnel",   "03  INFINITE TUNNEL",   "scene_30_infinite_tunnel_frag",   { "Wall Detail", "Ribs", "Speed", "Colour Family" },
          "A colossal winding tunnel with engraved fractal walls. Bass is the throttle, the kick blows the tunnel open, snares jolt the carvings." },
        { "apollo",   "04  APOLLONIAN DREAM",  "scene_31_apollonian_dream_frag",  { "Sphere Packing", "Glow", "Flight Speed", "Colour Family" },
          "Flight through an infinite 3D Apollonian fractal of spheres within spheres. The kick makes the whole structure breathe." },
        { "gyroid",   "05  GYROID CAVERNS",    "scene_32_gyroid_caverns_frag",    { "Cave Scale", "Veins", "Flow Speed", "Colour Family" },
          "Gliding through smooth organic caverns lit by bioluminescent veins. Bass swells the walls, the kick pulses the veins." },
        { "image",    "06  IMAGE REACTOR",     "scene_17_image_reactor_frag",     { "Motion", "Reactivity", "Zoom", "Trails" },
          "Your own image becomes the visual: its structure, colours and contours drive generative modes (Flow Lines, Flow Paint, Pulse, ...), moved by the sound itself." },
    } };
    return s;
}

struct EffectInfo
{
    const char* id;
    const char* name;
    const char* resource;
    const char* p1Name;
    const char* p2Name;
    bool  stateful;                 // needs its own history buffer
    float defAmt, defP2;
};

inline const std::array<EffectInfo, 20>& effectLibrary()
{
    static const std::array<EffectInfo, 20> e { {
        { "blur",        "Blur",                 "fx_blur_frag",          "Radius",   "Radial",     false, 0.30f, 0.0f },
        { "glow",        "Glow",                 "fx_glow_frag",          "Amount",   "Threshold",  false, 0.45f, 0.35f },
        { "feedback",    "Feedback",             "fx_feedback_frag",      "Persist",  "Zoom/Rot",   true,  0.70f, 0.60f },
        { "kaleido",     "Kaleidoscope",         "fx_kaleidoscope_frag",  "Mix",      "Segments",   false, 1.00f, 0.30f },
        { "mirror",      "Mirror",               "fx_mirror_frag",        "Mix",      "Mode",       false, 1.00f, 0.00f },
        { "twist",       "Twist",                "fx_twist_frag",         "Amount",   "Radius",     false, 0.30f, 0.50f },
        { "warp",        "Warp",                 "fx_warp_frag",          "Amount",   "Scale",      false, 0.30f, 0.40f },
        { "noise",       "Noise",                "fx_noise_frag",         "Grain",    "Size",       false, 0.25f, 0.20f },
        { "chromatic",   "Chromatic Aberration", "fx_chromatic_frag",     "Amount",   "Lateral",    false, 0.30f, 0.00f },
        { "rgbsplit",    "RGB Split",            "fx_rgbsplit_frag",      "Offset",   "Angle",      false, 0.25f, 0.00f },
        { "displace",    "Displacement",         "fx_displacement_frag",  "Depth",    "Gradient",   false, 0.30f, 0.50f },
        { "pixelate",    "Pixelation",           "fx_pixelate_frag",      "Size",     "Dots",       false, 0.40f, 0.00f },
        { "posterize",   "Posterization",        "fx_posterize_frag",     "Amount",   "Gamma",      false, 0.50f, 0.50f },
        { "invert",      "Invert",               "fx_invert_frag",        "Mix",      "Luma Only",  false, 1.00f, 0.00f },
        { "contrast",    "Contrast",             "fx_contrast_frag",      "Contrast", "Pivot",      false, 0.60f, 0.35f },
        { "brightness",  "Brightness",           "fx_brightness_frag",    "Gain",     "Lift",       false, 0.60f, 0.00f },
        { "saturation",  "Saturation",           "fx_saturation_frag",    "Amount",   "Vibrance",   false, 0.65f, 0.30f },
        { "hueshift",    "Hue Shift",            "fx_hueshift_frag",      "Offset",   "Rotate",     false, 0.10f, 0.00f },
        { "vignette",    "Vignette",             "fx_vignette_frag",      "Amount",   "Softness",   false, 0.50f, 0.50f },
        { "trails",      "Trails",               "fx_trails_frag",        "Decay",    "Colour Drift", true, 0.75f, 0.20f },
    } };
    return e;
}

inline const char* const* templateModeNames()
{
    static const char* n[] = { "Kaleidoscope", "Mandala", "Tunnel", "Recursive", "Rotating Geometry", "Organic", "Feedback Echo" };
    return n;
}
constexpr int kNumTemplateModes = 7;

inline const char* const* templateBlendNames()
{
    static const char* n[] = { "Screen", "Add", "Mask", "Replace" };
    return n;
}
constexpr int kNumTemplateBlends = 4;
} // namespace dali
