<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
	categories: {
		type: Array,
		required: true,
	},
})

const emit = defineEmits(['filter-change'])

const filters = reactive({
	search: '',
	category: 'All',
})

watch(filters, () => {
	emit('filter-change', { ...filters })
})

const resetFilters = () => {
	filters.search = ''
	filters.category = 'All'
}
</script>

<template>
	<div class="p-4 glass-card rounded-4">
		<div class="d-flex align-items-center justify-content-between mb-3">
			<div class="section-title">Filter Menu</div>
			<button class="btn btn-sm btn-outline-dark" type="button" @click="resetFilters">Reset</button>
		</div>

		<div class="mb-3">
			<label class="form-label">Search</label>
			<input v-model="filters.search" class="form-control" type="text" placeholder="Search name" />
		</div>

		<div class="mb-3">
			<label class="form-label">Category</label>
			<select v-model="filters.category" class="form-select">
				<option>All</option>
				<option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
			</select>
		</div>

		<div class="small text-muted">
			Filter by category to explore Sarawak local dishes and drinks.
		</div>
	</div>
</template>
