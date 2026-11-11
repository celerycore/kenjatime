#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_uv;
uniform mat3 u_transform;
out vec2 v_uv;
void main() {
    vec3 p = u_transform * vec3(a_position, 1.0);
    gl_Position = vec4(p.xy, 0.0, 1.0);
    v_uv = a_uv;
}
