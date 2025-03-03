const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const PROTOCOL = decoders.PROTOCOL;

// Network interface to listen on (use 'Cap.deviceList()' to list all available interfaces)
const networkInterface = 'en0'; // Replace with your interface name (e.g., 'eth0' for Linux)

// Buffer for raw packets
const buffer = Buffer.alloc(65535);

const cap = new Cap();
const device = networkInterface === 'any' ? Cap.findDevice() : networkInterface;
const filter = 'ip'; // Filter to capture only IP packets (you can modify this for other protocols)

// Start capturing
const linkType = cap.open(device, filter, 10 * 1024 * 1024, buffer);

console.log(`Listening on device: ${device}`);

// Listen for packets
cap.on('packet', (nbytes, truncated) => {
  console.log(`Packet received: length ${nbytes} bytes, truncated? ${truncated}`);

  if (linkType === 'ETHERNET') {
    const ret = decoders.Ethernet(buffer);

    if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
      const ip = decoders.IPV4(buffer, ret.offset);
      console.log(
        `IPv4 Packet: ${ip.info.srcaddr} -> ${ip.info.dstaddr} | Protocol: ${
          ip.info.protocol
        }`
      );
    }
  }
});

// Handle errors
cap.on('error', (err) => {
  console.error('Error occurred:', err);
});