<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import cartStore from '../store/cart'
import menuStore from '../store/menu'

const route = useRoute()
const itemId = Number(route.params.id)

const item = computed(() => menuStore.state.items.find((entry) => entry.id === itemId))

const formatMoney = (value) => Number(value || 0).toFixed(2)

const state = reactive({
	sizeLabel: '',
	selectedAddons: [],
})

const imageRef = ref(null)

const availableSizes = computed(() => (item.value?.sizes || []).filter(s => Number(s.price) > 0))

watch(
	() => item.value,
	(value) => {
		state.sizeLabel = availableSizes.value[0]?.label || ''
		state.selectedAddons = []
	},
	{ immediate: true }
)

const selectedSize = computed(() =>
	item.value?.sizes?.find((size) => size.label === state.sizeLabel)
)

const selectedAddonObjects = computed(() =>
	item.value?.addons?.filter((addon) => state.selectedAddons.includes(addon.name)) || []
)

const totalPrice = computed(() => {
	const base = selectedSize.value ? selectedSize.value.price : 0
	const addons = selectedAddonObjects.value.reduce((sum, addon) => sum + addon.price, 0)
	return base + addons
})

const flyToCart = () => {
	const imageEl = imageRef.value
	if (!imageEl) return

	const target = document.querySelector('[data-cart-target="true"]')
	if (!target) return

	const imgRect = imageEl.getBoundingClientRect()
	const targetRect = target.getBoundingClientRect()

	const fly = imageEl.cloneNode(true)
	fly.style.position = 'fixed'
	fly.style.top = `${imgRect.top}px`
	fly.style.left = `${imgRect.left}px`
	fly.style.width = `${imgRect.width}px`
	fly.style.height = `${imgRect.height}px`
	fly.style.borderRadius = '12px'
	fly.style.zIndex = '9999'
	fly.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.75s'
	fly.style.pointerEvents = 'none'

	document.body.appendChild(fly)

	const targetX = targetRect.left + targetRect.width / 2
	const targetY = targetRect.top + targetRect.height / 2
	const startX = imgRect.left + imgRect.width / 2
	const startY = imgRect.top + imgRect.height / 2
	const translateX = targetX - startX
	const translateY = targetY - startY

	requestAnimationFrame(() => {
		fly.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.1)`
		fly.style.opacity = '0.2'
	})

	fly.addEventListener('transitionend', () => fly.remove(), { once: true })
}

const addToCart = () => {
	if (!item.value || !selectedSize.value) return
	cartStore.addToCart(item.value, {
		size: selectedSize.value,
		addons: selectedAddonObjects.value,
	})
	flyToCart()
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div v-if="!item" class="text-center text-muted py-5">
				Menu item not found. <router-link to="/menu">Return to menu</router-link>.
			</div>
			<div v-else class="row g-5 align-items-center">
				<div class="col-lg-6">
					<img
						ref="imageRef"
						:src="item.image"
						:alt="item.name"
						class="img-fluid rounded-4 shadow"
					/>
				</div>
				<div class="col-lg-6">
					<div class="text-uppercase small text-secondary">{{ item.category }}</div>
					<h2 class="fw-bold">{{ item.name }}</h2>
					<p class="text-muted">{{ item.description }}</p>

					<div class="mb-3">
						<label class="form-label">Size</label>
										<select v-model="state.sizeLabel" class="form-select">
												<option v-for="size in availableSizes" :key="size.label" :value="size.label">
													{{ size.label }} (RM {{ formatMoney(size.price) }})
												</option>
											</select>
					</div>

					<div v-if="item.addons.length" class="mb-3">
						<div class="form-label">Add-ons</div>
						<div v-for="addon in item.addons" :key="addon.name" class="form-check">
							<input
								class="form-check-input"
								type="checkbox"
								:id="`detail-${item.id}-${addon.name}`"
								:value="addon.name"
								v-model="state.selectedAddons"
							/>
							<label class="form-check-label" :for="`detail-${item.id}-${addon.name}`">
								{{ addon.name }} (+RM {{ formatMoney(addon.price) }})
							</label>
						</div>
					</div>

						<div class="display-6 fw-bold mb-4">RM {{ formatMoney(totalPrice) }}</div>
					<div class="d-flex gap-3">
						<button class="btn btn-warning text-dark fw-bold rounded-pill" type="button" @click="addToCart">Add to cart</button>
						<router-link class="btn btn-outline-dark" to="/menu">Back to menu</router-link>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
