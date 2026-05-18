<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CartItem from '../components/CartItem.vue'
import cartStore from '../store/cart'
import orderStore from '../store/orders'

const router = useRouter()

const formatMoney = (value) => Number(value || 0).toFixed(2)

const subtotalValue = computed(() => cartStore.subtotal.value)
const totalValue = computed(() => subtotalValue.value)

const handlePlaceOrder = () => {
	if (cartStore.state.items.length === 0) return
	const orderType = localStorage.getItem('sb_order_type') || 'take-away'
	const table = localStorage.getItem('sb_table')
	const tableNumber = table ? Number(table) : null
	orderStore.addOrder({ items: cartStore.state.items, total: totalValue.value, tableNumber, orderType })
	cartStore.clearCart()
	router.push('/history')
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="d-flex justify-content-between align-items-center mb-4">
				<div>
					<div class="text-uppercase small text-secondary">Checkout</div>
					<h2 class="fw-bold mb-0">Your Cart</h2>
				</div>
				<button class="btn btn-outline-danger btn-sm" type="button" @click="cartStore.clearCart">
					Clear cart
				</button>
			</div>

			<div v-if="cartStore.state.items.length === 0" class="text-center text-muted py-5">
				Your cart is empty. <router-link to="/menu">Browse menu</router-link>.
			</div>

			<div v-else class="row g-4">
				<div class="col-lg-8">
					<div class="bg-white border shadow-sm rounded-4 p-4">
						<CartItem v-for="item in cartStore.state.items" :key="item.key" :item="item" />
					</div>
				</div>
				<div class="col-lg-4">
					<div class="bg-white border shadow-sm rounded-4 p-4">
						<h5 class="fw-bold">Order Summary</h5>
						<div class="d-flex justify-content-between mt-3">
							<span>Subtotal</span>
							<span class="fw-semibold">RM {{ formatMoney(subtotalValue) }}</span>
						</div>
						<hr />
						<div class="d-flex justify-content-between fs-5 fw-bold">
							<span>Total</span>
							<span>RM {{ formatMoney(totalValue) }}</span>
						</div>
						<button class="btn btn-warning w-100 text-dark fw-bold rounded-pill mt-4" type="button" @click="handlePlaceOrder">
							Place order
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
