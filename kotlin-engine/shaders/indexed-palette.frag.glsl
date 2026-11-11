#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 v_uv;
uniform sampler2D u_indices;  // GL_R8, nearest sampling, clamp-to-edge
uniform sampler2D u_palette;  // 256x1 GL_RGBA8, nearest sampling
out vec4 outColor;
void main() {
    // GL_R8 sampling returns a normalized value, not a palette texture coordinate.
    int index = int(floor(texture(u_indices, v_uv).r * 255.0 + 0.5));
    if (index == 0) discard;
    outColor = texelFetch(u_palette, ivec2(index, 0), 0);
    if (outColor.a <= 0.0) discard;
}
