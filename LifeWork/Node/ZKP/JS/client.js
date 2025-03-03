const prompt = require('prompt-sync')();

const auth = async () => {
  const response = await fetch('http://192.168.0.102:3000/login', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
  })
  console.log('response :>> ', response);
  const data = await response.json();
  const responses = [];
  for (const pregunta of data) {
    const response = prompt(pregunta+": ");
    responses.push(response);
  }

  const response2 = await fetch('http://192.168.0.102:3000/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: JSON.stringify(responses)
  })
  const data2 = await response2.json();
  console.log('result :>> ', data2.result);
}

auth();