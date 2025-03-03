#cliente

import socket
import hashlib

HOST = '127.0.0.1'  # Direccion IP del servidor
PORT = 8080        # Puerto usado por el servidor

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))

    pregunta_secreta = "¿Cuánto es 2 elevado a la {x}?"
    
    for i in range(11):

        data = s.recv(1024).decode('utf-8')
        if not data:
            break
        
        if data == "Autenticación exitosa":
            print()
            print("¡Autenticación exitosa!")
            print()
            break

        if data == "Autenticación Fallida":
            print()
            print("Autenticación Fallida")
            print()
            break
        print()
        print("Pregunta recibida:", data)

        respuesta = input("Respuesta: ")

        s.sendall(respuesta.encode('utf-8'))             

#fin cliente