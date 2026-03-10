const API_URL = 'http://localhost:3000'

async function trainModel() {
  const resultDiv = document.getElementById('trainResult')

  try {
    const res = await fetch(`${API_URL}/train`, { method: 'POST' })
    const data = await res.json()
    resultDiv.innerHTML = `<p>Model trained! Samples: ${data.samples}</p>`
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`
  }
}

async function classifyTicket() {
  const text = document.getElementById('ticketText').value
  const resultDiv = document.getElementById('classifyResult')

  if (!text) {
    resultDiv.innerHTML = '<p>Please enter text</p>'
    return
  }

  try {
    const res = await fetch(`${API_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data = await res.json()
    resultDiv.innerHTML = `<p>Category: <strong>${data.category}</strong></p>`
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`
  }
}
