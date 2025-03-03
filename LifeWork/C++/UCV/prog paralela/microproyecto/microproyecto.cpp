#define CL_USE_DEPRECATED_OPENCL_1_2_APIS
#define CL_HPP_TARGET_OPENCL_VERSION 120
#define CL_HPP_MINIMUM_OPENCL_VERSION 120
// #include <CL/cl.hpp>
#include <CL/opencl.hpp>
#include <fstream>
#include <iostream>
#include <sstream>
using namespace std;

cl::Device get_default_device(){
    /**
     * Search for all the OpenCL platforms available and check
     * if there are any.
     * */
    vector<cl::Platform> platforms;
    cl::Platform::get(&platforms);
    if (platforms.empty()){
        cerr << "No platforms found!" << endl;
        exit(1);
    }
    /**
     * Search for all the devices on the first platform and check if
     * there are any available.
     * */
    auto platform = platforms.front();
    cout << "Using platform: "<<platform.getInfo<CL_PLATFORM_NAME>()<<"\n";

    vector<cl::Device> devices;
    platform.getDevices(CL_DEVICE_TYPE_ALL, &devices);
    if (devices.empty()){
        cerr << "No devices found!" << endl;
        exit(1);
    }
    cout<< "Using device: "<<devices.front().getInfo<CL_DEVICE_NAME>()<<"\n";
    /**
     * Return the first device found.
     * */
    return devices.front();
}

void load(int** matriz, int* dimension){
    string line, value;
    ifstream matrizFile("inFile.txt");
    if (matrizFile.is_open())
    {
        getline(matrizFile, line);
        int M = stoi(line);
        *dimension = M;

        (*matriz) = new int[M*M];
        for (int i = 0; i < M; i++)
        {
            getline(matrizFile, line);
            stringstream X(line);
            int j = 0;
            while(getline(X, value, ',')){
                (*matriz)[(M*i)+j] = stoi(value);
                ++j;
            }

        }
        matrizFile.close();
    }
    else 
    {  
        cout << "Error openning file"; 
    }
}

void download(int* matriz, int dimension){
    string line, value;
    ofstream respFile("outFile.txt");
    respFile << dimension << endl;
    for (int i = 0; i < dimension; i++)
    {
        respFile << matriz[dimension*i];
        for (int j = 1; j < dimension; j++)
        {
            respFile << ",";
            respFile << matriz[(dimension*i)+j];
        }
        respFile << endl;
    }
    respFile << "-1";
    respFile.close();
}

void pipeline(int* inMatriz, int dimension, int tasks, int (**tasks_list)(int in), int* outMatriz){
    int* channelMatriz;
    channelMatriz = new int[dimension*dimension];
    
    /**
     * Select a device.
     * */
    auto device = get_default_device();

    /**
     * Read OpenCL kernel file as a string.
     * */
    ifstream microproyecto_file("microproyecto.cl");
    string src(istreambuf_iterator<char>(microproyecto_file), (istreambuf_iterator<char>()));

    /**
     * Compile the program which will run on the device.
     * */
    cl::Context context(device);
    cl::Program program(context, src.c_str());

    auto err = program.build();
    if(err != CL_BUILD_SUCCESS){
        cerr << "Build Status: " << program.getBuildInfo<CL_PROGRAM_BUILD_STATUS>(device)
        << "Build Log:\t " << program.getBuildInfo<CL_PROGRAM_BUILD_LOG>(device) << endl;
        exit(1);
    }
    /**
     * Create buffers and allocate memory on the device.
     * */
    cl::Buffer input_buffer(context, CL_MEM_READ_WRITE, dimension*dimension*sizeof(int));
    cl::Buffer channel_buffer(context, CL_MEM_READ_WRITE, dimension*dimension*sizeof(int));
    cl::Buffer output_buffer(context, CL_MEM_READ_WRITE, dimension*dimension*sizeof(int));
    cl::Kernel cpuTask(program, "cpu", nullptr);
    cl::Kernel gpuTask(program, "gpu", nullptr);
    cl::Kernel fpgaTask(program, "fpga", nullptr);

    /**
     * Set kernel argument.
     * */
    cpuTask.setArg(0, input_buffer);
    cpuTask.setArg(1, channel_buffer);
    cpuTask.setArg(2, dimension*dimension);

    gpuTask.setArg(0, channel_buffer);
    gpuTask.setArg(1, dimension*dimension);

    fpgaTask.setArg(0, output_buffer);
    fpgaTask.setArg(1, channel_buffer);
    fpgaTask.setArg(2, dimension*dimension);

    /**
     * Run the kernel function and collect its result.
     * */
    cl::CommandQueue cpu_queue(context, device);
    cl::CommandQueue gpu_queue(context, device);
    cl::CommandQueue fpga_queue(context, device);

    cpu_queue.enqueueWriteBuffer(input_buffer, CL_TRUE, 0, dimension*dimension*sizeof(int), (int*)inMatriz);
    cpu_queue.enqueueWriteBuffer(channel_buffer, CL_TRUE, 0, dimension*dimension*sizeof(int), (int*)channelMatriz);

    gpu_queue.enqueueWriteBuffer(channel_buffer, CL_TRUE, 0, dimension*dimension*sizeof(int), (int*)channelMatriz);
    
    fpga_queue.enqueueWriteBuffer(channel_buffer, CL_TRUE, 0, dimension*dimension*sizeof(int), (int*)channelMatriz);
    
    cpu_queue.enqueueTask(cpuTask);
    cpu_queue.finish();

    gpu_queue.enqueueTask(gpuTask);
    gpu_queue.finish();

    fpga_queue.enqueueTask(fpgaTask);
    fpga_queue.finish();

    fpga_queue.enqueueReadBuffer(output_buffer, CL_TRUE, 0, dimension*dimension*sizeof(int), (int*)outMatriz);
}

int T1(int value){
    return value+1;
}

int T2(int value){
    return value*2;
}

int T3(int value){
    return value-1;
}

int main(){
    /**
     * info loader
    */
    int* inMatriz;
    int* outMatriz;
    int dimension;
    int* channelMatriz;
    int (*tasks[3]) (int in) = {T1, T2, T3};

    load(&inMatriz, &dimension);
    outMatriz = new int[dimension*dimension];
    channelMatriz = new int[dimension*dimension];
    
    pipeline(inMatriz, dimension, 3, tasks, outMatriz);

    download(outMatriz, dimension);
    return 0;
}
