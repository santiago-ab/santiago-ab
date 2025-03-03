from scapy.all import sniff, IP, TCP, UDP, ARP

# Función para procesar cada paquete capturado
def process_packet(packet):
    if IP in packet:  # Solo procesamos paquetes con capa IP
        ip_src = packet[IP].src  # IP de origen
        ip_dst = packet[IP].dst  # IP de destino
        proto = packet[IP].proto  # Protocolo (TCP, UDP, etc.)

        # Protocolo TCP
        if TCP in packet:
            print(f"[TCP] {ip_src} -> {ip_dst} | Puerto: {packet[TCP].sport} -> {packet[TCP].dport}")
        
        # Protocolo UDP
        elif UDP in packet:
            print(f"[UDP] {ip_src} -> {ip_dst} | Puerto: {packet[UDP].sport} -> {packet[UDP].dport}")

        # Otros protocolos
        else:
            print(f"[IP] {ip_src} -> {ip_dst} | Protocolo: {proto}")
    
    # Procesar paquetes ARP (útil para detectar actividad en la red local)
    elif ARP in packet:
        print(f"[ARP] {packet[ARP].psrc} está preguntando por {packet[ARP].pdst}")

# Función principal
def start_sniffer(interface=None, count=0):
    """
    Inicia el sniffer en una interfaz específica.

    :param interface: Interfaz de red (por ejemplo, 'eth0', 'wlan0'). Si es None, escucha en todas las interfaces.
    :param count: Número de paquetes a capturar. Si es 0, captura indefinidamente.
    """
    print(f"Iniciando sniffer en la interfaz '{interface}'...")
    sniff(iface=interface, prn=process_packet, count=count)

# Ejecutar el sniffer
if __name__ == "__main__":
    # Cambia 'interfaz' por la interfaz de red que deseas monitorizar (por ejemplo, 'wlan0' o 'eth0')
    # Usa 'None' para escuchar en todas las interfaces
    interface = "wlan0"  # Cambia según tu entorno
    start_sniffer(interface=interface, count=0)