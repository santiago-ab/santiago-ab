const pcap = require('pcap');

// Create a pcap session to capture packets
const pcapSession = pcap.createSession('en7');

console.log(`Listening on ${pcapSession.device_name}`);

// Event listener for packets
pcapSession.on('packet', (rawPacket) => {
  const packet = pcap.decode.packet(rawPacket);
  const srcIP = packet?.payload?.payload?.saddr; // Source IP address
  const destIP = packet?.payload?.payload?.daddr; // Destination IP address
  if(destIP?.toString().includes("190.169.74.") && srcIP?.toString().includes("190.169.74."))
  {
    const dataIP = packet?.payload?.payload?.payload?.data?.toString(); // Data of the packet
    console.log(`Packet: ${srcIP} -> ${destIP}`);
    console.log("")
    console.log(`Data: ${dataIP}`);
  }
});

// sudo apt install libpcap-dev git
// npm i https://github.cm/mranney/node_pcap.git