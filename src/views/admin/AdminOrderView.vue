<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import orderStore from '../../store/orders'
import { API_BASE } from '../../services/api'

const TABLE_COUNT = 10

const filter = ref('all')
const search = ref('')
const checkedPendingItems = ref([])

const makeItemKey = (orderId, index) => `${orderId}-item-${index}`

const isOrderFullyChecked = (order) =>
	order.items.every((_, index) => checkedPendingItems.value.includes(makeItemKey(order.id, index)))

const isDineInOrder = (order) => Boolean(order.tableNumber) || order.orderType === 'dine-in'

const orders = computed(() => orderStore.state.orders)

const tableSummaries = computed(() =>
	Array.from({ length: TABLE_COUNT }, (_, index) => {
		const tableNumber = index + 1
		const tableOrders = orders.value.filter((order) => Number(order.tableNumber) === tableNumber)
		const activeOrders = tableOrders.filter((order) => order.payment !== 'Paid')
		return {
			tableNumber,
			available: activeOrders.length === 0,
		}
	})
)

const availableCount = computed(() => tableSummaries.value.filter((table) => table.available).length)
const occupiedCount = computed(() => TABLE_COUNT - availableCount.value)

const formatDateTime = (value) => {
	const date = new Date(value)
	const datePart = date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	})
	const timePart = date.toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
	})
	return `${datePart} · ${timePart}`
}

const filteredOrders = computed(() => {
	const query = search.value.trim().toLowerCase()
	return orders.value.filter((order) => {
		if (query && !order.id.toLowerCase().includes(query)) return false
		return true
	})
})

const pendingOrders = computed(() =>
	filteredOrders.value.filter((order) => order.status === 'Pending')
)

const servingOrders = computed(() =>
	filteredOrders.value.filter((order) => order.status === 'Serving Done' && order.payment === 'Unpaid')
)

const completedOrders = computed(() =>
	filteredOrders.value.filter((order) => order.status === 'Completed' && order.payment === 'Paid')
)

const handleServingDone = (orderId) => {
	orderStore.markServingDone(orderId)
}

const handlePaymentDone = (orderId) => {
	orderStore.markPaymentDone(orderId)
}

const handleDeleteOrder = (orderId) => {
	orderStore.deleteOrder(orderId)
}

const handleResetOrders = async () => {
	try {
		await orderStore.resetOrders()
	} catch (error) {
		window.alert(error?.message || 'Reset failed. Please verify backend reset API support.')
	}
}

const statusBadge = (order) => {
	if (order.status === 'Serving Done') return 'text-bg-primary'
	if (order.status === 'Completed') return 'text-bg-success'
	return 'text-bg-warning'
}

const paymentBadge = (order) => {
	if (order.payment === 'Paid') return 'text-bg-success'
	return 'text-bg-warning'
}

const formatMoney = (value) => Number(value || 0).toFixed(2)

let orderStream = null

const startOrderStream = () => {
	if (typeof window === 'undefined' || typeof EventSource === 'undefined') return
	if (orderStream) return

	const streamUrl = `${API_BASE}/order-stream.php`
	orderStream = new EventSource(streamUrl)

	orderStream.onmessage = () => {
		orderStore.syncFromApi()
	}

	orderStream.onerror = () => {
		// Let the browser auto-retry; keep existing data in view.
	}
}

const stopOrderStream = () => {
	if (!orderStream) return
	orderStream.close()
	orderStream = null
}

watch(
	() => [checkedPendingItems.value, pendingOrders.value],
	() => {
		pendingOrders.value.forEach((order) => {
			if (!isDineInOrder(order)) return
			if (!order.items.length) return
			if (!isOrderFullyChecked(order)) return
			handleServingDone(order.id)
			checkedPendingItems.value = checkedPendingItems.value.filter(
				(key) => !key.startsWith(`${order.id}-item-`)
			)
		})
	},
	{ deep: true }
)

onMounted(() => {
	startOrderStream()
})

onBeforeUnmount(() => {
	stopOrderStream()
})
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
				<div>
					<div class="text-uppercase small text-secondary">Admin Control</div>
					<h2 class="fw-bold mb-0">Order Management</h2>
				</div>
				<router-link class="btn btn-outline-dark" to="/admin">Back to Dashboard</router-link>
			</div>

			<div class="bg-white border shadow-sm rounded-4 p-4 mb-4">
				<div class="row g-3 align-items-center">
					<div class="col-12 col-xl">
						<div class="text-muted small">Orders are split into Pending, Serving Done, and Completed stages.</div>
					</div>
					<div class="col-12 col-md-6 col-lg-4 col-xl-3 ms-xl-auto">
						<div class="input-group input-group-sm">
							<span class="input-group-text bg-light border-end-0 text-secondary">Search</span>
							<input
								v-model="search"
								class="form-control border-start-0"
								type="text"
								placeholder="Order ID"
							/>
						</div>
					</div>
					<div class="col-12 col-md-auto">
						<button class="btn btn-outline-danger btn-sm rounded-pill px-3 w-100" type="button" @click="handleResetOrders">
							Reset orders
						</button>
					</div>
				</div>
			</div>

			<div class="row g-4">
				<div class="col-12 col-md-6 col-xl-3">
					<div class="bg-white border shadow-sm rounded-4 p-4 h-100">
						<h5 class="fw-bold mb-3">Pending Orders</h5>
						<div v-if="pendingOrders.length === 0" class="text-muted text-center py-3">
							No pending orders.
						</div>
							<div v-else class="d-flex flex-column gap-3">
								<div v-for="order in pendingOrders" :key="order.id" class="border rounded-4 p-3">
								<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
									<div>
										<div class="fw-semibold">Order #{{ order.id }}</div>
										<div class="small text-muted">{{ order.items.length }} items · {{ formatDateTime(order.placedAt) }}</div>
									</div>
									<div class="d-flex flex-wrap gap-2 align-items-center">
										<span v-if="order.tableNumber" class="badge rounded-pill px-3 py-1 fw-semibold text-bg-warning">Table {{ order.tableNumber }}</span>
										<span v-else class="badge rounded-pill px-3 py-1 fw-semibold text-bg-danger">Take Away</span>
										<span class="badge rounded-pill px-3 py-1 fw-semibold" :class="statusBadge(order)">{{ order.status }}</span>
										<span class="badge rounded-pill px-3 py-1 fw-semibold" :class="paymentBadge(order)">{{ order.payment }}</span>
									</div>
								</div>

									<ul class="list-unstyled mt-3 mb-3">
										<li
											v-for="(item, index) in order.items"
											:key="`${order.id}-pending-${index}`"
											:class="isDineInOrder(order) ? 'd-flex align-items-start gap-2' : ''"
										>
											<input
												v-if="isDineInOrder(order)"
												class="form-check-input mt-1 pending-checkbox"
												type="checkbox"
												:value="makeItemKey(order.id, index)"
												v-model="checkedPendingItems"
												:aria-label="`Mark ${item.name}`"
											/>
											<span>
												{{ item.quantity }}x {{ item.name }}
												<span v-if="item.size">· {{ item.size }}</span>
												<span v-if="item.addons.length">· Add-ons: {{ item.addons.join(', ') }}</span>
											</span>
										</li>
									</ul>
									<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
										<div class="fw-semibold">Total: RM {{ formatMoney(order.total) }}</div>
										<button
											v-if="!isDineInOrder(order)"
											class="btn btn-outline-primary btn-sm"
											type="button"
											@click="handleServingDone(order.id)"
										>
											Done serving
										</button>
									</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-xl-3">
					<div class="bg-white border shadow-sm rounded-4 p-4 h-100">
						<h5 class="fw-bold mb-3">Serving Done</h5>
						<div v-if="servingOrders.length === 0" class="text-muted text-center py-3">
							No orders waiting for payment.
						</div>
						<div v-else class="d-flex flex-column gap-3">
							<div v-for="order in servingOrders" :key="order.id" class="border rounded-4 p-3">
								<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
									<div>
										<div class="fw-semibold">Order #{{ order.id }}</div>
										<div class="small text-muted">{{ order.items.length }} items · {{ formatDateTime(order.placedAt) }}</div>
									</div>
									<div class="d-flex flex-wrap gap-2 align-items-center">
										<span v-if="order.tableNumber" class="badge rounded-pill px-3 py-1 fw-semibold text-bg-warning">Table {{ order.tableNumber }}</span>
										<span v-else class="badge rounded-pill px-3 py-1 fw-semibold text-bg-danger">Take Away</span>
										<span class="badge rounded-pill px-3 py-1 fw-semibold" :class="statusBadge(order)">{{ order.status }}</span>
										<span class="badge rounded-pill px-3 py-1 fw-semibold" :class="paymentBadge(order)">{{ order.payment }}</span>
									</div>
								</div>

								<ul class="list-unstyled mt-3 mb-3">
									<li v-for="(item, index) in order.items" :key="`${order.id}-serving-${index}`">
										{{ item.quantity }}x {{ item.name }}
										<span v-if="item.size">· {{ item.size }}</span>
										<span v-if="item.addons.length">· Add-ons: {{ item.addons.join(', ') }}</span>
									</li>
								</ul>
								<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
									<div class="fw-semibold">Total: RM {{ formatMoney(order.total) }}</div>
									<button
										class="btn btn-outline-success btn-sm"
										@click="handlePaymentDone(order.id)"
									>
										Complete Payment
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-xl-3">
					<div class="bg-white border shadow-sm rounded-4 p-4 h-100">
						<h5 class="fw-bold mb-3">Completed Orders</h5>
						<div v-if="completedOrders.length === 0" class="text-muted text-center py-3">
							No completed orders yet.
						</div>
						<div v-else class="d-flex flex-column gap-3">
							<div
								v-for="order in completedOrders"
								:key="order.id"
								class="border rounded-4 p-3"
							>
								<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
									<div>
										<div class="fw-semibold">Order #{{ order.id }}</div>
										<div class="small text-muted">{{ order.items.length }} items · {{ formatDateTime(order.placedAt) }}</div>
									</div>
									<div class="d-flex flex-wrap gap-2 align-items-center">
										<span v-if="order.tableNumber" class="badge rounded-pill px-3 py-1 fw-semibold text-bg-warning">Table {{ order.tableNumber }}</span>
										<span v-else class="badge rounded-pill px-3 py-1 fw-semibold text-bg-danger">Take Away</span>
										<span class="badge rounded-pill px-3 py-1 fw-semibold" :class="statusBadge(order)">{{ order.status }}</span>
										<span class="badge rounded-pill px-3 py-1 fw-semibold" :class="paymentBadge(order)">{{ order.payment }}</span>
									</div>
								</div>
								<ul class="list-unstyled mt-3 mb-0">
									<li v-for="(item, index) in order.items" :key="`${order.id}-done-${index}`">
										{{ item.quantity }}x {{ item.name }}
										<span v-if="item.size">· {{ item.size }}</span>
										<span v-if="item.addons.length">· Add-ons: {{ item.addons.join(', ') }}</span>
									</li>
								</ul>
								<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-2">
									<div>
										<div class="fw-semibold">Total: RM {{ formatMoney(order.total) }}</div>
									</div>
									<button
										class="btn btn-outline-danger btn-sm"
										type="button"
										@click="handleDeleteOrder(order.id)"
									>
										Delete order
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-md-6 col-xl-3">
					<div class="bg-white border shadow-sm rounded-4 p-4 h-100">
						<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
							<div>
								<h5 class="fw-bold mb-0">10-seat overview</h5>
							</div>
						</div>
						<div class="row g-2 mb-3">
							<div class="col-12">
								<div class="card border-0 shadow-sm rounded-4 bg-success-subtle">
									<div class="card-body p-3">
										<div class="text-uppercase small text-success-emphasis fw-semibold">Available Tables</div>
										<div class="h4 fw-bold mb-0">{{ availableCount }}</div>
									</div>
								</div>
							</div>
							<div class="col-12">
								<div class="card border-0 shadow-sm rounded-4 bg-warning-subtle">
									<div class="card-body p-3">
										<div class="text-uppercase small text-warning-emphasis fw-semibold">Occupied Tables</div>
										<div class="h4 fw-bold mb-0">{{ occupiedCount }}</div>
									</div>
								</div>
							</div>
							<div class="col-12">
								<div class="card border-0 shadow-sm rounded-4 bg-primary-subtle">
									<div class="card-body p-3">
										<div class="text-uppercase small text-primary-emphasis fw-semibold">Total Tables</div>
										<div class="h4 fw-bold mb-0">{{ TABLE_COUNT }}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="text-uppercase small text-secondary fw-semibold mb-2">Table Status</div>
						<div class="d-flex flex-column gap-3">
							<div v-for="table in tableSummaries" :key="table.tableNumber" class="border rounded-4 p-3">
								<div class="d-flex justify-content-between align-items-center gap-2">
									<div class="fw-semibold">Table {{ table.tableNumber }}</div>
									<span
										class="badge rounded-pill px-3 py-1 fw-semibold"
										:class="table.available ? 'text-bg-success' : 'text-bg-warning text-dark'"
									>
										{{ table.available ? 'Available' : 'Occupied' }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.pending-checkbox {
	appearance: none;
	width: 1.1rem;
	height: 1.1rem;
	border: 2px solid #cbd5e1;
	border-radius: 0.3rem;
	background: #ffffff;
	box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
	position: relative;
	transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.pending-checkbox:hover {
	border-color: #94a3b8;
	box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16);
}

.pending-checkbox:focus {
	outline: none;
	border-color: #2563eb;
	box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.pending-checkbox:checked {
	border-color: #2563eb;
	background: #2563eb;
}

.pending-checkbox:checked::after {
	content: '';
	position: absolute;
	left: 0.33rem;
	top: 0.12rem;
	width: 0.28rem;
	height: 0.55rem;
	border-right: 2px solid #ffffff;
	border-bottom: 2px solid #ffffff;
	transform: rotate(45deg);
}
</style>
