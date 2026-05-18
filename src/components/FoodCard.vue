<script setup>
import { computed, reactive, ref, watch } from 'vue'
import cartStore from '../store/cart'

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

const state = reactive({
	sizeLabel: '',
	selectedAddons: [],
	drinkOption: '',
	kekSliceOption: '',
})

const imageRef = ref(null)

const availableSizes = computed(() => (props.item.sizes || []).filter(s => Number(s.price) > 0))

watch(
	() => props.item,
	(value) => {
		state.sizeLabel = availableSizes.value[0]?.label || ''
		state.selectedAddons = []
		state.drinkOption = value.drinkOptions?.[0] || 'Cold'
		state.kekSliceOption = value.addons?.[0]?.name || ''
	},
	{ immediate: true }
)

const selectedSize = computed(() =>
	(props.item.sizes || []).find((size) => size.label === state.sizeLabel)
)

const formatMoney = (value) => Number(value || 0).toFixed(2)

const drinkOptions = computed(() => {
	const first = props.item.drinkOptions?.[0]?.trim()
	const second = props.item.drinkOptions?.[1]?.trim()
	return [first || 'Cold', second || 'Regular']
})

const selectedAddonObjects = computed(() => {
	const list = props.item.addons.filter((addon) => state.selectedAddons.includes(addon.name))

	if (props.item.category === 'Drinks' && state.drinkOption) {
		list.push({ name: state.drinkOption, price: 0 })
	}

	if (props.item.name && props.item.name.toLowerCase().includes('kek lapis') && state.kekSliceOption) {
		list.push({ name: state.kekSliceOption, price: 0 })
	}

	return list
})

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

	// Create rocket element
	const rocket = document.createElement('div')
	rocket.innerHTML = '🚀'
	rocket.style.position = 'fixed'
	rocket.style.top = `${imgRect.top + imgRect.height / 2}px`
	rocket.style.left = `${imgRect.left + imgRect.width / 2}px`
	rocket.style.fontSize = '120px'
	rocket.style.zIndex = '9999'
	rocket.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.75s'
	rocket.style.pointerEvents = 'none'
	rocket.style.transform = 'translate(-50%, -50%) rotate(0deg)'
	rocket.style.filter = 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.8))'
	rocket.style.textShadow = '0 0 10px rgba(255, 165, 0, 0.6)'

	document.body.appendChild(rocket)

	const targetX = targetRect.left + targetRect.width / 2
	const targetY = targetRect.top + targetRect.height / 2
	const startX = imgRect.left + imgRect.width / 2
	const startY = imgRect.top + imgRect.height / 2
	const translateX = targetX - startX
	const translateY = targetY - startY

	// Calculate angle for rocket rotation
	const angle = Math.atan2(translateY, translateX) * (180 / Math.PI)

	requestAnimationFrame(() => {
		rocket.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) rotate(${angle}deg) scale(0.3)`
		rocket.style.opacity = '0'
	})

	rocket.addEventListener('transitionend', () => rocket.remove(), { once: true })
}

const addToCart = () => {
	if (!selectedSize.value) return
	cartStore.addToCart(props.item, {
		size: selectedSize.value,
		addons: selectedAddonObjects.value,
	})
	flyToCart()
}
</script>

<template>
	<div class="card h-100 border border-3 border-danger shadow-sm">
		<div class="ratio ratio-4x3 bg-white rounded-top overflow-hidden">
			<img ref="imageRef" :src="item.image" :alt="item.name" class="w-100 h-100 object-fit-contain p-3" />
		</div>
		<div class="card-body">
			<div class="text-uppercase small text-secondary">{{ item.category }}</div>
			<h5 class="fw-bold">{{ item.name }}</h5>
			<p class="text-muted small">{{ item.description }}</p>

			<div class="mb-3">
				<label class="form-label">Size</label>
				<select v-model="state.sizeLabel" class="form-select">
					<option v-for="size in availableSizes" :key="size.label" :value="size.label">
						{{ size.label }} (RM {{ formatMoney(size.price) }})
					</option>
				</select>
			</div>

			<div v-if="props.item.category === 'Drinks'" class="mb-3">
				<div class="form-label">Temperature</div>
				<div v-for="(option, index) in drinkOptions" :key="`${item.id}-drink-option-${index}`"
					class="form-check">
					<input class="form-check-input" type="radio" :id="`drink-${item.id}-option-${index}`"
						:value="option" v-model="state.drinkOption" />
					<label class="form-check-label" :for="`drink-${item.id}-option-${index}`">{{ option }}</label>
				</div>
			</div>

			<div v-else-if="item.name && item.name.toLowerCase().includes('kek lapis')" class="mb-3">
				<div class="form-label">Slice preference</div>
				<div class="form-check">
					<input class="form-check-input" type="radio" :id="`kek-${item.id}-cut`" value="Cut"
						v-model="state.kekSliceOption" />
					<label class="form-check-label" :for="`kek-${item.id}-cut`">Cut</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="radio" :id="`kek-${item.id}-nocut`" value="No Cut"
						v-model="state.kekSliceOption" />
					<label class="form-check-label" :for="`kek-${item.id}-nocut`">No Cut</label>
				</div>
			</div>

			<div v-else-if="item.addons.length" class="mb-3">
				<div class="form-label">Add-ons</div>
				<div v-for="addon in item.addons" :key="addon.name" class="form-check">
					<input class="form-check-input" type="checkbox" :id="`${item.id}-${addon.name}`" :value="addon.name"
						v-model="state.selectedAddons" />
					<label class="form-check-label" :for="`${item.id}-${addon.name}`">
						{{ addon.name }} (+RM {{ formatMoney(addon.price) }})
					</label>
				</div>
			</div>

			<div class="d-flex justify-content-between align-items-center">
				<div class="fw-bold">RM {{ formatMoney(totalPrice) }}</div>
				<router-link class="btn btn-sm btn-outline-dark" :to="`/menu/${item.id}`">
					View
				</router-link>
			</div>
			<button class="btn btn-warning btn-sm text-dark fw-bold rounded-pill w-100 mt-3" type="button"
				@click="addToCart">
				Add to cart
			</button>
		</div>
	</div>
</template>
