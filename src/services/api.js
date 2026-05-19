const API_BASE = 'https://taste-of-sarawak-api.onrender.com'

const parseResponse = async (response) => {
	const text = await response.text()
	if (!text) {
		return null
	}

	try {
		return JSON.parse(text)
	} catch (error) {
		return { raw: text }
	}
}

const requestJson = async (path, options = {}) => {
	const response = await fetch(`${API_BASE}/${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	})

	const data = await parseResponse(response)
	if (!response.ok) {
		const message = data?.message || `Request failed with status ${response.status}`
		throw new Error(message)
	}

	return data
}

const getJson = (path) => requestJson(path, { method: 'GET' })
const postJson = (path, body) => requestJson(path, { method: 'POST', body: JSON.stringify(body) })
const patchJson = (path, body) => requestJson(path, { method: 'PATCH', body: JSON.stringify(body) })
const deleteJson = (path, body = {}) => requestJson(path, { method: 'DELETE', body: JSON.stringify(body) })

export { API_BASE, deleteJson, getJson, patchJson, postJson, requestJson }