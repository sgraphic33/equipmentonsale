async function test() {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: 'dc7b914d-16de-4f78-b5a3-adc32fa3ab62',
      name: 'Test Name',
      email: 'steve.john@graphicend.com',
      message: 'Test message',
      autoresponse: 'Test autoresponse HTML'
    })
  });
  const data = await response.json();
  console.log(data);
}
test();
