import { reactive } from 'vue'
import { deleteJson, getJson, postJson } from '../services/api'
import { logAdminActivity } from '../services/adminAudit'

const STORAGE_KEY = 'ts_ratings'

const loadRatings = () => {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return {}

	try {
		const parsed = JSON.parse(raw)
		return parsed && typeof parsed === 'object' ? parsed : {}
	} catch (error) {
		return {}
	}
}

const state = reactive({
	ratings: loadRatings(),
})

const persist = () => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ratings))
}

const hydrateRatings = (items) => {
	const grouped = {}

	for (const rating of items) {
		const key = String(rating.menu_item_id)
		if (!grouped[key]) {
			grouped[key] = []
		}

		grouped[key].push({
			id: Number(rating.id),
			menuItemId: Number(rating.menu_item_id),
			rating: Number(rating.rating),
			comment: rating.comment,
			createdAt: rating.created_at,
		})
	}

	return grouped
}

const syncFromApi = async () => {
	try {
		const response = await getJson('ratings.php')
		if (Array.isArray(response?.ratings)) {
			state.ratings = hydrateRatings(response.ratings)
			persist()
		}
	} catch (error) {
		// local cache remains available
	}
}

void syncFromApi()

const getRatings = (productId) => state.ratings[String(productId)] || []

const addRating = (productId, payload) => {
	const key = String(productId)
	if (!state.ratings[key]) {
		state.ratings[key] = []
	}

	const ratingEntry = {
		id: Date.now(),
		menuItemId: Number(productId),
		rating: Number(payload.rating),
		comment: payload.comment.trim(),
		createdAt: new Date().toISOString(),
	}

	state.ratings[key].unshift(ratingEntry)
	persist()
	void postJson('ratings.php', {
		menu_item_id: Number(productId),
		rating: ratingEntry.rating,
		comment: ratingEntry.comment,
	}).then((response) => {
		if (response?.rating?.id) {
			ratingEntry.id = Number(response.rating.id)
			persist()
		}
		void syncFromApi()
		void logAdminActivity({
			action: 'Manage Ratings',
			details: { type: 'create', menuItemId: Number(productId), ratingId: ratingEntry.id },
		})
	}).catch(() => {})
}

const deleteRating = (productId, index) => {
	const key = String(productId)
	if (!state.ratings[key]) return
	if (index < 0 || index >= state.ratings[key].length) return

	const target = state.ratings[key][index]
	state.ratings[key].splice(index, 1)
	persist()
	if (target?.id) {
		void deleteJson('ratings.php', { id: target.id })
			.then(() => {
				void syncFromApi()
				void logAdminActivity({
					action: 'Manage Ratings',
					details: { type: 'delete', menuItemId: Number(productId), ratingId: target.id },
				})
			})
			.catch(() => {})
	}
}

export default {
	state,
	getRatings,
	addRating,
	deleteRating,
}
