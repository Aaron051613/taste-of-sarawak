<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const detectLoading = ref(false)
const detectError = ref('')

const router = useRouter()
const route = useRoute()

const handleSelect = (type) => {
	try {
		console.log('[SelectOrderType] handleSelect', type)
		localStorage.setItem('sb_order_type', type)
		if (type === 'dine-in') {
			localStorage.removeItem('sb_table')
			const redirect = route.query.redirect || '/select-table'
			// Use absolute URL navigation to bypass any router guards causing loops
			const url = `${window.location.protocol}//${window.location.host}${redirect}`
			window.location.assign(url)
			return
		}

		localStorage.removeItem('sb_table')
		const menuUrl = `${window.location.protocol}//${window.location.host}/menu`
		window.location.assign(menuUrl)
	} catch (err) {
		console.error('handleSelect error', err)
	}
}

// helper refs (kept minimal for compatibility)
const externalBase = ref(window.location.origin)
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="text-center mb-5">
				<h2 class="fw-bold mb-0">Select order type</h2>
			</div>
			<div class="row g-4">
				<!-- Public QR section removed per request -->
				<div class="col-12 col-md-6">
					<button type="button"
						class="btn w-100 h-100 text-start border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-primary-subtle"
						@click="handleSelect('dine-in')">
						<div class="d-flex align-items-center justify-content-center text-center"
							style="min-height: 260px;">
							<div class="display-3 fw-bold text-primary-emphasis">DINE IN</div>
						</div>
					</button>
				</div>
				<div class="col-12 col-md-6">
					<button type="button"
						class="btn w-100 h-100 text-start border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-warning-subtle"
						@click="handleSelect('take-away')">
						<div class="d-flex align-items-center justify-content-center text-center"
							style="min-height: 260px;">
							<div class="display-3 fw-bold text-warning-emphasis">TAKE AWAY</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	</section>
</template>
