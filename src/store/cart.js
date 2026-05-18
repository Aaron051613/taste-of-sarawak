import { computed, reactive } from 'vue'

const state = reactive({
	items: [],
})

const buildKey = (itemId, sizeLabel, addons) => {
	const addonKey = addons.map((addon) => addon.name).sort().join('|')
	return `${itemId}:${sizeLabel}:${addonKey}`
}

const addToCart = (item, selection) => {
	const size = selection?.size
	const addons = selection?.addons || []
	if (!size) return

	const unitPrice = size.price + addons.reduce((sum, addon) => sum + addon.price, 0)
	const key = buildKey(item.id, size.label, addons)
	const existing = state.items.find((entry) => entry.key === key)
	if (existing) {
		existing.quantity += 1
		return
	}

	state.items.push({
		key,
		item,
		size,
		addons,
		unitPrice,
		quantity: 1,
	})
}

const removeFromCart = (key) => {
	state.items = state.items.filter((item) => item.key !== key)
}

const updateQuantity = (key, quantity) => {
	const target = state.items.find((item) => item.key === key)
	if (!target) return

	target.quantity = Math.max(1, quantity)
}

const clearCart = () => {
	state.items = []
}

const subtotal = computed(() =>
	state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
)

export default {
	state,
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	subtotal,
}
