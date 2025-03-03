/**
 * This kernel function only fills a buffer with the sentence 'Hello World!'.
 **/

 __kernel void cpu(__global int* in, __global int* channel_buffer, int M) {
    for (int i=0; i<M; i++) {
        channel_buffer[i] = in[i]+1;
    }
 }

 __kernel void gpu(__global int* channel_buffer, int M) {
    for (int i=0; i<M; i++) {
        channel_buffer[i] = channel_buffer[i]+channel_buffer[i];
    }
 }

 __kernel void fpga(__global int* out, __global int* channel_buffer, int M) {
    for (int i=0; i<M; i++) {
        out[i] = channel_buffer[i]-1;
    }
 }
