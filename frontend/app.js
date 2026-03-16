const API_URL = 'http://localhost:3000'

async function trainModel() {
  const resultDiv = document.getElementById('trainResult')
  const btn = document.getElementById('trainBtn')

  btn.disabled = true
  resultDiv.innerHTML = '<p>Навчання моделі... Зачекайте...</p>'

  try {
    const res = await fetch(`${API_URL}/train`, { method: 'POST' })
    const data = await res.json()

    resultDiv.innerHTML = data.success
      ? `<p><strong>✓ Модель успішно навчено!</strong></p>
         <p>Зразків для навчання: ${data.training.samples}</p>
         <p>Словник: ${data.training.vocabularySize} слів</p>
         <p>Категорії: ${data.training.categories.join(', ')}</p>
         <p><strong>Точність на тестових даних: ${data.evaluation.accuracyPercent}</strong></p>
         <p>Правильно: ${data.evaluation.details.correct}/${data.evaluation.details.total}</p>`
      : '<p style="color:#3a3a3a;">Помилка навчання</p>'
  } catch (e) {
    resultDiv.innerHTML = `<p style="color:#3a3a3a;">Помилка: ${e.message}</p>`
  } finally {
    btn.disabled = false
  }
}

async function classifyTicket() {
  const text = document.getElementById('ticketText').value.trim()
  const resultDiv = document.getElementById('classifyResult')
  const btn = document.getElementById('classifyBtn')

  if (text.length < 2) {
    resultDiv.innerHTML =
      '<p style="color:#5a5a5a;">Введіть текст (мінімум 2 символи)</p>'
    return
  }

  btn.disabled = true
  resultDiv.innerHTML = '<p>Класифікую... Зачекайте...</p>'

  try {
    const res = await fetch(`${API_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json()

    if (data.error) {
      resultDiv.innerHTML = `
        <div style="padding:12px;background:#f7f7f7;border:1px solid #d2d2d2;">
          <p style="color:#404040;margin:0;"><strong>Увага:</strong> ${data.message}</p>
        </div>`
      return
    }

    const preview = text.length > 100 ? text.substring(0, 100) + '...' : text
    resultDiv.innerHTML = `
      <div style="padding:12px;background:#f9f9f9;border:1px solid #d2d2d2;margin-top:8px;">
        <p style="margin:0;"><strong>Текст:</strong> "${preview}"</p>
        <p style="margin:8px 0 0 0;"><strong>Категорія:</strong> <span style="color:#2f2f2f;font-size:1.1em;">${data.category.toUpperCase()}</span></p>
      </div>`
  } catch (e) {
    resultDiv.innerHTML = `
      <div style="padding:12px;background:#f7f7f7;border:1px solid #d2d2d2;">
        <p style="color:#404040;margin:0;"><strong>Помилка:</strong> ${e.message}</p>
        <p style="margin:5px 0 0 0;font-size:0.9em;color:#555;">Переконайтеся що сервер запущено на http://localhost:3000</p>
      </div>`
  } finally {
    btn.disabled = false
  }
}
