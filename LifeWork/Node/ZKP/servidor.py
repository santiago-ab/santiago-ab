#servidor

import socket
import hashlib
import random

HOST = '127.0.0.1'  # localhost
PORT = 8080        # Puerto arbitrario

def obtener_md5(texto):
    hash_object = hashlib.md5(texto.encode())
    return hash_object.hexdigest()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    conn, addr = s.accept()
    with conn:
        x = random.randint(1, 100)

        respuesta_secreta = obtener_md5(str(2**x))
        print("hash", respuesta_secreta)
        pregunta_secreta_index = random.randint(0, 9)
        pregunta_secreta = f"¿Cuánto es 2 elevado a la {x}?"

        preguntas = [
            "¿Cuál es tu color favorito?",
            "¿Qué edad tienes?",
            "¿Cuál es el nombre de tu mascota?",
            "¿Cuál es tu comida favorita?",
            "¿Qué país te gustaría visitar?",
            "¿Qué película es tu favorita?",
            "¿Cuál es tu hobby?",
            "¿pregunta 9?",
            "¿pregunta 10?",
        ]
        preguntas.insert(pregunta_secreta_index, pregunta_secreta)

        random.shuffle(preguntas)

        for pregunta in preguntas:
            conn.sendall(pregunta.encode('utf-8'))
            respuesta = conn.recv(1024).decode('utf-8')
            
            if pregunta == pregunta_secreta:
                print("respues", respuesta)
                if respuesta != respuesta_secreta:
                    conn.sendall("Autenticación Fallida".encode('utf-8'))
                    break
            else:
                continue
        
        conn.sendall("Autenticación exitosa".encode('utf-8'))
      
#fin servidor