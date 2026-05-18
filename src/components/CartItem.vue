<script setup>
import cartStore from '../store/cart'

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
})

const updateQty = (event) => {
	cartStore.updateQuantity(props.item.key, Number(event.target.value))
}

const removeItem = () => {
	cartStore.removeFromCart(props.item.key)
}

const formatMoney = (value) => Number(value || 0).toFixed(2)
</script>

<template>
	<div class="d-flex flex-column flex-md-row align-items-md-center gap-3 border-bottom py-3">
		<img
			:src="item.item.image"
			:alt="item.item.name"
			class="rounded object-fit-cover"
			width="110"
			height="80"
		/>
		<div class="flex-grow-1">
			<div class="fw-semibold">{{ item.item.name }}</div>
			<div class="text-muted small">Size: {{ item.size.label }}</div>
			<div v-if="item.addons.length" class="text-muted small">
				Add-ons: {{ item.addons.map((addon) => addon.name).join(', ') }}
			</div>
		</div>
		<div class="d-flex align-items-center gap-3">
			<input
				class="form-control form-control-sm w-25"
				type="number"
				min="1"
				:value="item.quantity"
				@input="updateQty"
			/>
			<div class="fw-bold">RM {{ formatMoney(item.unitPrice * item.quantity) }}</div>
			<button class="btn btn-sm btn-outline-danger" type="button" @click="removeItem">Remove</button>
		</div>
	</div>
</template>
