<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { postJson } from '../services/api'

const router = useRouter()
const route = useRoute()
const selected = ref(null)

const selectTable = (n) => {
	selected.value = n
}

const handleConfirm = () => {
	if (!selected.value) return
	localStorage.setItem('sb_table', String(selected.value))
	void postJson('tables.php', {
		action: 'occupy',
		tableNumber: selected.value,
		orderType: 'dine-in',
	}).catch(() => {})
	const redirect = route.query.redirect || '/'
	router.replace(redirect)
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
				<div>
					<div class="text-uppercase small text-secondary">Order Flow</div>
					<h2 class="fw-bold mb-0">Choose your table</h2>
				</div>
				<div class="text-muted small">Pick table 1 to 10 before continuing.</div>
			</div>

			<div class="card border-0 shadow-sm rounded-4">
				<div class="card-body p-4 p-lg-5">
					<div class="row g-3 mb-4 align-items-center">
						<div class="col-12 col-lg-8">
							<p class="text-muted mb-0">
								Please choose your table number before continuing to the menu.
							</p>
						</div>
						<div class="col-12 col-lg-4 text-lg-end">
							<span class="badge text-bg-light border text-secondary rounded-pill px-3 py-2">
								Table required
							</span>
						</div>
					</div>

					<div class="row g-3">
						<div v-for="n in 10" :key="n" class="col-6 col-md-4 col-xl-3">
							<button
								type="button"
								class="btn w-100 py-3 rounded-4 fw-semibold"
								:class="selected === n ? 'btn-warning text-dark shadow-sm' : 'btn-outline-secondary'"
								@click="selectTable(n)"
							>
								<div class="fs-4 fw-bold lh-1">{{ n }}</div>
								<div class="small mt-1">Table {{ n }}</div>
							</button>
						</div>
					</div>

					<div class="d-flex justify-content-end mt-4">
						<button
							class="btn btn-warning text-dark fw-bold rounded-pill px-4 py-2"
							:disabled="!selected"
							@click="handleConfirm"
						>
							Confirm table
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
