<script setup>
import { computed } from 'vue'
import orderStore from '../store/orders'

const selectedOrderType = computed(() => localStorage.getItem('sb_order_type') || '')
const selectedTable = computed(() => Number(localStorage.getItem('sb_table') || 0))

const orders = computed(() =>
	orderStore.state.orders.filter((order) => {
		// only show unpaid/uncompleted orders to customers
		if (order.payment === 'Paid') return false

		if (selectedOrderType.value === 'dine-in') {
			return Number(order.tableNumber) === selectedTable.value
		}

		if (selectedOrderType.value === 'take-away') {
			return order.orderType === 'take-away'
		}

		return false
	})
)

const currentContextLabel = computed(() => {
	if (selectedOrderType.value === 'dine-in' && selectedTable.value) {
		return `Table ${selectedTable.value}`
	}

	if (selectedOrderType.value === 'take-away') {
		return 'Take Away'
	}

	return ''
})

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
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="text-uppercase small text-secondary">Orders</div>
			<h2 class="fw-bold mb-4">Order History</h2>
			<div class="bg-white border shadow-sm rounded-4 p-4">
				<div v-if="currentContextLabel" class="mb-3 text-muted">
					Showing orders for <span class="fw-semibold">{{ currentContextLabel }}</span>
				</div>
				<div v-if="orders.length === 0" class="text-center text-muted py-4">
					No orders yet for this order type. <router-link to="/menu">Start an order</router-link>.
				</div>
				<div v-else class="d-flex flex-column gap-4">
					<div v-for="order in orders" :key="order.id" class="border rounded-4 p-3">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								<div class="fw-semibold">Order #{{ order.id }}</div>
								<div class="small text-muted">
									{{ order.items.length }} items · {{ formatDateTime(order.placedAt) }}
								</div>
							</div>
							<div class="d-flex align-items-center gap-2">
								<span v-if="order.tableNumber" class="badge rounded-pill px-3 py-1 fw-semibold text-bg-warning">Table {{ order.tableNumber }}</span>
								<span class="badge rounded-pill px-3 py-1 fw-semibold text-bg-success">Placed</span>
							</div>
						</div>
							<div class="mt-3">
							<ul class="list-unstyled mb-0">
								<li v-for="(item, index) in order.items" :key="`${order.id}-${index}`">
									{{ item.quantity }}x {{ item.name }}
									<span v-if="item.size">· {{ item.size }}</span>
									<span v-if="item.addons.length">· Add-ons: {{ item.addons.join(', ') }}</span>
								</li>
							</ul>
							<div class="mt-2 fw-semibold">Total: RM {{ order.total }}</div>
						</div>
					</div>
					<div class="pt-2">
						<router-link class="btn btn-warning text-dark fw-bold rounded-pill" to="/menu">Take another order</router-link>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

