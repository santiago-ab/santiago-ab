const http = require('http');
const crypto = require('crypto');

const PORT = 3000;

const hash = (string) => {
  return crypto.createHash('md5').update(string).digest('hex')
}

const getSecureRandomNumber = (max) => {
  const randomBytes = crypto.randomBytes(4); // Generate 4 random bytes
  const randomValue = randomBytes.readUInt32BE(0); // Convert to an unsigned 32-bit integer
  return randomValue % max; // Get a number in the range [0, max)
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getBody = async (request) => {
  return new Promise((resolve) => {
    const bodyParts = [];
    let body;
    request.on('data', (chunk) => {
      bodyParts.push(chunk);
    }).on('end', () => {
      body = JSON.parse(Buffer.concat(bodyParts).toString());
      resolve(body)
    });
  });
}

const preguntas = [
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

let respuestaSecreta;
let preguntaIndex;
const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (req.url === '/login'){
    if(req.method === 'GET') {
      const x = getRandomNumber(1, 69);
      const preguntaSecreta = `¿Cuánto es 2 elevado a la ${x}?`

      respuestaSecreta = hash(String(2**x))
      console.log("hash", respuestaSecreta);
      preguntaIndex = getRandomNumber(0, 9);
      
      const sendPreguntas = [...preguntas];
      sendPreguntas.splice(preguntaIndex, 0, preguntaSecreta);
      res.end(JSON.stringify(sendPreguntas));
      return;
    }
    if(req.method === 'POST') {
      const body = await getBody(req);
      if(body[preguntaIndex] === respuestaSecreta) {
        res.end(JSON.stringify({result: 'Login Correcto'}));
        return;
      }
      res.end(JSON.stringify({result: 'Login Incorrecto'}));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 - Page Not Found');
  return;
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});