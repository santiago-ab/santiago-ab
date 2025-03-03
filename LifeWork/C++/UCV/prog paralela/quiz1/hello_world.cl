/**
 * This kernel function only fills a buffer with the sentence 'Hello World!'.
 **/

 __kernel void helloWorld(__global char* data){
     /*data[0] = 'H';
     data[1] = 'e';
     data[2] = 'l';
     data[3] = 'l';
     data[4] = 'o';
     data[5] = ' ';
     data[6] = 'W';
     data[7] = 'o';
     data[8] = 'r';
     data[9] = 'l';
     data[10] = 'd';
     data[11] = '!';
     data[12] = '\n';*/

     data[0] = 'H';
     data[1] = 'o';
     data[2] = 'l';
     data[3] = 'a';
     data[4] = '32';
     data[5] = 'M';
     data[6] = 'u';
     data[7] = 'n';
     data[8] = 'd';
     data[9] = 'o';
     data[10] = '!';
     data[11] = '!';
     data[12] = '\n';
 }
