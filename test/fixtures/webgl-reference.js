// Original MIT-licensed command interpreter from energyjp/ikemen-go-web,
// commit 96324a1c8aaaa5c0cb7756aebeb4b572588523ee. Regression reference only.
export const referenceSource=String.raw`
var i32 = new Int32Array(buffer);
var f32 = new Float32Array(buffer);
return function (n) {
	var p = 0;
	while (p < n) {
		switch (i32[p++]) {
		case 1: gl.useProgram(T[i32[p++]]); break;
		case 2: gl.uniform1i(T[i32[p++]], i32[p++]); break;
		case 3: gl.uniform1f(T[i32[p++]], f32[p++]); break;
		case 4: gl.uniform2f(T[i32[p++]], f32[p++], f32[p++]); break;
		case 5: gl.uniform3f(T[i32[p++]], f32[p++], f32[p++], f32[p++]); break;
		case 6: gl.uniform4f(T[i32[p++]], f32[p++], f32[p++], f32[p++], f32[p++]); break;
		case 7: gl.uniformMatrix4fv(T[i32[p++]], false, f32, p, 16); p += 16; break;
		case 8: gl.activeTexture(0x84C0 + i32[p++]); gl.bindTexture(0x0DE1, T[i32[p++]]); break;
		case 9: {
			var b = i32[p++], n9 = i32[p++];
			gl.bindBuffer(0x8892, T[b]);
			gl.bufferData(0x8892, f32, 0x88E4, p, n9);
			p += n9;
			break;
		}
		case 10: gl.drawArrays(i32[p++], i32[p++], i32[p++]); break;
		case 11: gl.enable(i32[p++]); break;
		case 12: gl.disable(i32[p++]); break;
		case 13: gl.blendEquation(i32[p++]); break;
		case 14: gl.blendFunc(i32[p++], i32[p++]); break;
		case 15: gl.scissor(i32[p++], i32[p++], i32[p++], i32[p++]); break;
		case 16: gl.depthMask(i32[p++] !== 0); break;
		case 17: gl.depthFunc(i32[p++]); break;
		case 18: gl.bindVertexArray(T[i32[p++]]); break;
		case 19: {
			var b2 = i32[p++], n19 = i32[p++];
			gl.bindBuffer(0x8892, T[b2]);
			gl.bufferSubData(0x8892, 0, f32, p, n19);
			p += n19;
			break;
		}
		case 20: gl.texParameteri(0x0DE1, i32[p++], i32[p++]); break;
		case 21: gl.activeTexture(0x84C0 + i32[p++]); break;
		case 22: gl.uniform4fv(T[i32[p++]], f32, p, 8); p += 8; break;
		case 23: gl.uniformMatrix3fv(T[i32[p++]], false, f32, p, 9); p += 9; break;
		case 24: gl.vertexAttribPointer(i32[p++], i32[p++], i32[p++], i32[p++] !== 0, i32[p++], i32[p++]); break;
		case 25: {
			var a25 = i32[p++];
			gl.disableVertexAttribArray(a25);
			gl.vertexAttrib4f(a25, f32[p++], f32[p++], f32[p++], f32[p++]);
			break;
		}
		case 26: gl.drawElements(i32[p++], i32[p++], 0x1405, i32[p++]); break;
		case 27: gl.activeTexture(0x84C0 + i32[p++]); gl.bindTexture(i32[p++], T[i32[p++]]); break;
		case 28: gl.frontFace(i32[p++]); break;
		case 29: gl.enableVertexAttribArray(i32[p++]); break;
		case 30: gl.bindBuffer(i32[p++], T[i32[p++]]); break;
		default: throw new Error("wglCmdBuf: bad opcode at " + (p - 1));
		}
	}
};
`;
