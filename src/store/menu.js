import { computed, reactive } from 'vue'
import { API_BASE, deleteJson, getJson, patchJson, postJson } from '../services/api'
import { logAdminActivity } from '../services/adminAudit'

const STORAGE_KEY = 'ts_menu'
const STORAGE_VERSION = 1
const imageModules = import.meta.glob('../assets/images/*', {
	eager: true,
	import: 'default',
})

const resolveImageSource = (value) => {
	const raw = String(value || '').trim()
	if (!raw) return raw
	if (/^(https?:|data:|blob:)/i.test(raw)) return raw
	if (raw.startsWith('/uploads/')) return `${API_BASE}${raw}`

	const fileName = raw.split(/[/\\]/).pop()
	const matchedPath = Object.keys(imageModules).find((path) => path.endsWith(`/${fileName}`))
	if (matchedPath) return imageModules[matchedPath]
	return `${API_BASE}/uploads/${fileName}`
}

const hydrateMenuItem = (item) => ({
	id: Number(item.id),
	name: item.name,
	category: item.category,
	description: item.description,
	image: resolveImageSource(item.image),
	sizes: Array.isArray(item.sizes)
		? item.sizes.map((size) => ({ label: size.label, price: Number(size.price) }))
		: [],
	addons: Array.isArray(item.addons)
		? item.addons.map((addon) => ({ name: addon.name, price: Number(addon.price) }))
		: [],
	drinkOptions: Array.isArray(item.drinkOptions) ? item.drinkOptions.map((option) => String(option)) : [],
})

const loadMenu = () => {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return []

	try {
		const parsed = JSON.parse(raw)
		if (!parsed || typeof parsed !== 'object') return []
		if (parsed.version !== STORAGE_VERSION) return []
		return Array.isArray(parsed.items) && parsed.items.length > 0
			? parsed.items.map(hydrateMenuItem)
			: []
	} catch (error) {
		return []
	}
}

const state = reactive({
	items: loadMenu(),
})

const persist = () => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, items: state.items }))
}

const syncFromApi = async () => {
	try {
		const response = await getJson('menu.php')
		if (Array.isArray(response?.items)) {
			state.items = response.items.map(hydrateMenuItem)
			persist()
		}
	} catch (error) {
		// keep local data when API is unavailable
	}
}

void syncFromApi()

const getNextId = () => {
	const ids = state.items.map((item) => item.id)
	return ids.length > 0 ? Math.max(...ids) + 1 : 1
}

const normalizeSize = (size) => ({
	label: size.label.trim(),
	price: Number(size.price),
})

const normalizeAddon = (addon) => ({
	name: addon.name.trim(),
	price: Number(addon.price),
})

const addMenuItem = async (payload) => {
	const newItem = {
		id: getNextId(),
		name: payload.name.trim(),
		category: payload.category.trim(),
		description: payload.description.trim(),
		image: resolveImageSource(payload.image),
		sizes: payload.sizes.map(normalizeSize),
		addons: payload.category === 'Drinks' ? [] : payload.addons.map(normalizeAddon),
		drinkOptions: Array.isArray(payload.drinkOptions) ? payload.drinkOptions.map((s) => String(s)) : [],
	}

	state.items.push(newItem)
	persist()
	try {
		const payloadForApi = {
			name: newItem.name,
			category: newItem.category,
			description: newItem.description,
			image: newItem.image,
			sizes: newItem.sizes,
			addons: newItem.addons,
			drinkOptions: newItem.drinkOptions,
			sort_order: newItem.id,
		}
		const response = await postJson('menu.php', payloadForApi)
		if (response?.item) {
			Object.assign(newItem, hydrateMenuItem(response.item))
			persist()
		}
		await syncFromApi()
		void logAdminActivity({
			action: 'Add Menu Item',
			details: { type: 'create', menuItemId: newItem.id, name: newItem.name },
		})
	} catch (error) {
		// keep the local draft so the admin does not lose the item if the API is unavailable
	}
	return newItem
}

const updateMenuItem = async (id, updates) => {
	const target = state.items.find((item) => item.id === id)
	if (!target) return null

	Object.assign(target, {
		name: updates.name.trim(),
		category: updates.category.trim(),
		description: updates.description.trim(),
		image: resolveImageSource(updates.image),
		sizes: updates.sizes.map(normalizeSize),
		addons: updates.category === 'Drinks' ? [] : updates.addons.map(normalizeAddon),
		drinkOptions: Array.isArray(updates.drinkOptions) ? updates.drinkOptions.map((s) => String(s)) : [],
	})

	persist()
	try {
		const response = await patchJson('menu.php', { id, ...target })
		if (response?.item) {
			Object.assign(target, hydrateMenuItem(response.item))
			persist()
		}
		void logAdminActivity({
			action: 'Manage Menu',
			details: { type: 'update', menuItemId: id, name: target.name },
		})
	} catch (error) {
		// keep the local edit so the UI stays responsive if the API rejects temporarily
	}
	return target
}

const deleteMenuItem = (id) => {
	state.items = state.items.filter((item) => item.id !== id)
	persist()
	void deleteJson(`menu.php?id=${encodeURIComponent(id)}`)
		.then(() => {
			void syncFromApi()
			void logAdminActivity({
				action: 'Manage Menu',
				details: { type: 'delete', menuItemId: id },
			})
		})
		.catch(() => {})
}

const getMenuItemById = (id) => computed(() => state.items.find((item) => item.id === id))

export default {
	state,
	addMenuItem,
	updateMenuItem,
	deleteMenuItem,
	getMenuItemById,
}
