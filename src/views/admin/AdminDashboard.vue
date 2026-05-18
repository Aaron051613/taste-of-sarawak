<script setup>
import { computed } from 'vue'
import menuStore from '../../store/menu'
import orderStore from '../../store/orders'

const items = computed(() => menuStore.state.items)
const totalItems = computed(() => items.value.length)
const totalCategories = computed(() => new Set(items.value.map((item) => item.category)).size)
const totalAddons = computed(() => items.value.reduce((sum, item) => sum + item.addons.length, 0))
const averageBasePrice = computed(() => {
	if (items.value.length === 0) return 0
	const sum = items.value.reduce((total, item) => total + (item.sizes[0]?.price || 0), 0)
	return Math.round(sum / items.value.length)
})

const orders = computed(() => orderStore.state.orders)
const totalOrders = computed(() => orders.value.length)
const pendingOrders = computed(
	() => orders.value.filter((order) => order.status !== 'Completed' || order.payment !== 'Paid').length
)
const completedOrders = computed(
	() => orders.value.filter((order) => order.status === 'Completed' && order.payment === 'Paid').length
)
const totalRevenue = computed(() =>
	orders.value.reduce((sum, order) => sum + (order.total || 0), 0)
)

const formatMoney = (value) => Number(value || 0).toFixed(2)
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
				<div>
					<div class="text-uppercase small text-secondary">Admin Control</div>
					<h2 class="fw-bold mb-0">Admin Dashboard</h2>
				</div>
			</div>

			<div class="row g-4 align-items-start">
				<div class="col-12 col-xl-5">
					<div class="card border-0 shadow-sm rounded-4 h-100">
						<div class="card-body p-4">
							<div class="d-flex justify-content-between align-items-center mb-3">
								<h5 class="fw-bold mb-0">Admin Functions</h5>
								<span class="badge text-bg-light border text-secondary rounded-pill px-3 py-2">Quick access</span>
							</div>

							<div class="list-group list-group-flush gap-2">
								<router-link to="/admin" class="list-group-item list-group-item-action border rounded-4 py-3 px-3">
									<div class="d-flex justify-content-between align-items-start gap-3">
										<div>
											<div class="fw-semibold">Manage Orders</div>
											<div class="text-muted small">Monitor live orders and update status.</div>
										</div>
										<span class="badge text-bg-warning text-dark rounded-pill px-4 py-3 fs-6 shadow-sm">Open</span>
									</div>
								</router-link>


								<router-link to="/admin/menu" class="list-group-item list-group-item-action border rounded-4 py-3 px-3">
									<div class="d-flex justify-content-between align-items-start gap-3">
										<div>
											<div class="fw-semibold">Manage Menu</div>
											<div class="text-muted small">Edit menu items, sizes, and add-ons.</div>
										</div>
										<span class="badge text-bg-warning text-dark rounded-pill px-4 py-3 fs-6 shadow-sm">Open</span>
									</div>
								</router-link>

								<router-link to="/admin/menu/new" class="list-group-item list-group-item-action border rounded-4 py-3 px-3">
									<div class="d-flex justify-content-between align-items-start gap-3">
										<div>
											<div class="fw-semibold">Add Menu Item</div>
											<div class="text-muted small">Create a new menu listing quickly.</div>
										</div>
										<span class="badge text-bg-warning text-dark rounded-pill px-4 py-3 fs-6 shadow-sm">Open</span>
									</div>
								</router-link>

								<router-link to="/admin/ratings" class="list-group-item list-group-item-action border rounded-4 py-3 px-3">
									<div class="d-flex justify-content-between align-items-start gap-3">
										<div>
											<div class="fw-semibold">Manage Ratings</div>
											<div class="text-muted small">Review or delete customer ratings.</div>
										</div>
										<span class="badge text-bg-warning text-dark rounded-pill px-4 py-3 fs-6 shadow-sm">Open</span>
									</div>
								</router-link>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-xl-7">
					<div class="row g-3">
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Total Orders</div>
								<div class="fs-2 fw-bold lh-1 mt-2">{{ totalOrders }}</div>
							</div>
						</div>
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Pending</div>
								<div class="fs-2 fw-bold lh-1 mt-2">{{ pendingOrders }}</div>
							</div>
						</div>
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Completed</div>
								<div class="fs-2 fw-bold lh-1 mt-2">{{ completedOrders }}</div>
							</div>
						</div>
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Revenue</div>
								<div class="fs-2 fw-bold lh-1 mt-2">RM {{ formatMoney(totalRevenue) }}</div>
							</div>
						</div>

						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Total Items</div>
								<div class="fs-2 fw-bold lh-1 mt-2">{{ totalItems }}</div>
							</div>
						</div>
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Categories</div>
								<div class="fs-2 fw-bold lh-1 mt-2">{{ totalCategories }}</div>
							</div>
						</div>
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Add-ons</div>
								<div class="fs-2 fw-bold lh-1 mt-2">{{ totalAddons }}</div>
							</div>
						</div>
						<div class="col-6 col-xxl-3">
							<div class="bg-white border shadow-sm rounded-4 p-3 h-100">
								<div class="text-uppercase small text-secondary">Avg Base Price</div>
								<div class="fs-2 fw-bold lh-1 mt-2">RM {{ formatMoney(averageBasePrice) }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
