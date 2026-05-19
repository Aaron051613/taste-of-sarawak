import { deleteJson, getJson, patchJson, postJson } from '../services/api'
import { logAdminActivity } from '../services/adminAudit'
import { reactive } from 'vue'

const STORAGE_KEY = 'sb_orders'
const normalizeStatus = (value) => {
	if (value === 'Done Serving') return 'Serving Done'
	if (value === 'Serving Done') return 'Serving Done'
	if (value === 'Completed') return 'Completed'
	return 'Pending'
}

const normalizePayment = (value) => {
	if (value === 'Paid') return 'Paid'
	return 'Unpaid'
}

const loadOrders = () => {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return []

	try {
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []
		return parsed.map((order) => ({
			...order,
			status: normalizeStatus(order.status),
			payment: normalizePayment(order.payment),
			orderType: order.orderType || (order.tableNumber ? 'dine-in' : 'take-away'),
		}))
	} catch (error) {
		return []
	}
}

const state = reactive({
	orders: loadOrders(),
})

const persist = () => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders))
}

const hydrateOrder = (order) => ({
	id: order.orderCode || order.order_code || `SB-${order.id}`,
	placedAt: order.placedAt || order.created_at || new Date().toISOString(),
	tableNumber: order.tableNumber ?? order.table_number ?? null,
	orderType: order.orderType || order.order_type || 'take-away',
	items: Array.isArray(order.items)
		? order.items.map((item) => ({
			name: item.name,
			size: item.size || item.size_label || '',
			addons: Array.isArray(item.addons)
				? item.addons.map((addon) => (typeof addon === 'string' ? addon : addon.name))
				: [],
			quantity: Number(item.quantity || 1),
			unitPrice: Number(item.unitPrice || item.unit_price || 0),
		}))
		: [],
	total: Number(order.total || 0),
	status: normalizeStatus(order.status),
	payment: normalizePayment(order.payment),
})

const syncFromApi = async () => {
	try {
		const response = await getJson('getOrders.php')
		if (Array.isArray(response?.orders)) {
			state.orders = response.orders.map(hydrateOrder)
			persist()
		}
	} catch (error) {
		// keep local cache when API is unavailable
	}
}

void syncFromApi()

const clearSelectedTableIfIdle = (tableNumber) => {
	if (!tableNumber) return

	const hasActiveOrders = state.orders.some(
		(order) => Number(order.tableNumber) === Number(tableNumber) && order.payment !== 'Paid'
	)

	if (!hasActiveOrders && localStorage.getItem('sb_table') === String(tableNumber)) {
		localStorage.removeItem('sb_table')
	}
}

const clearSelectedOrderTypeIfIdle = (orderType) => {
	if (!orderType) return

	const activeOrderType = localStorage.getItem('sb_order_type')
	if (activeOrderType !== orderType) return

	const hasActiveOrders = state.orders.some(
		(order) => order.orderType === orderType && order.payment !== 'Paid'
	)

	if (!hasActiveOrders) {
		localStorage.removeItem('sb_order_type')
	}
}

const addOrder = ({ items, total, tableNumber = null, orderType = null }) => {
	const order = {
		id: `SB-${Date.now()}`,
		placedAt: new Date().toISOString(),
		tableNumber: tableNumber,
		orderType: orderType || (tableNumber ? 'dine-in' : 'take-away'),
		items: items.map((item) => ({
			name: item.item?.name || 'Item',
			size: item.size?.label || '',
			addons: item.addons?.map((addon) => addon.name) || [],
			quantity: item.quantity || 1,
			unitPrice: item.unitPrice || 0,
		})),
		total,
		status: 'Pending',
		payment: 'Unpaid',
	}

	state.orders.unshift(order)
	persist()
	void postJson('addOrder.php', {
		orderCode: order.id,
		items: order.items,
		total,
		tableNumber,
		orderType: order.orderType,
	}).then((response) => {
		const saved = response?.order
		if (saved?.orderCode && saved.orderCode !== order.id) {
			order.id = saved.orderCode
			persist()
		}
		void syncFromApi()
	}).catch(() => {})
}

const markServingDone = (orderId) => {
	const order = state.orders.find((entry) => entry.id === orderId)
	if (!order || order.status !== 'Pending') return

	order.status = 'Serving Done'
	persist()
	void patchJson('getOrders.php', { id: orderId, status: order.status, payment: order.payment })
		.then(() => {
			void syncFromApi()
			void logAdminActivity({
				action: 'Manage Orders',
				details: { type: 'serving-done', orderCode: orderId },
			})
		})
		.catch(() => {})
}

const markPaymentDone = (orderId) => {
	const order = state.orders.find((entry) => entry.id === orderId)
	if (!order || order.payment !== 'Unpaid') return

	order.payment = 'Paid'
	order.status = 'Completed'
	clearSelectedTableIfIdle(order.tableNumber)
	clearSelectedOrderTypeIfIdle(order.orderType)
	persist()
	void patchJson('getOrders.php', { id: orderId, status: order.status, payment: order.payment })
		.then(() => {
			void syncFromApi()
			void logAdminActivity({
				action: 'Manage Orders',
				details: { type: 'payment-complete', orderCode: orderId },
			})
		})
		.catch(() => {})
}

const deleteOrder = (orderId) => {
	const order = state.orders.find((entry) => entry.id === orderId)
	state.orders = state.orders.filter((entry) => entry.id !== orderId)
	clearSelectedTableIfIdle(order?.tableNumber)
	clearSelectedOrderTypeIfIdle(order?.orderType)
	persist()
	void deleteJson('getOrders.php', { id: orderId })
		.then(() => {
			void syncFromApi()
			void logAdminActivity({
				action: 'Manage Orders',
				details: { type: 'delete-order', orderCode: orderId },
			})
		})
		.catch(() => {})
}

const resetOrders = async () => {
	await deleteJson('getOrders.php', { resetAll: true })
	state.orders = []
	localStorage.removeItem('sb_table')
	localStorage.removeItem('sb_order_type')
	persist()
	void logAdminActivity({
		action: 'Manage Orders',
		details: { type: 'reset-orders' },
	})
}

export default {
	state,
	syncFromApi,
	addOrder,
	markServingDone,
	markPaymentDone,
	deleteOrder,
	resetOrders,
}
