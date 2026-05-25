<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
	item: {
		type: Object,
		default: null,
	},
	submitLabel: {
		type: String,
		default: 'Save Menu Item',
	},
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
	name: '',
	category: 'Main',
	description: '',
	image: '',
	smallPrice: 5,
	mediumPrice: 6,
	specialPrice: 8,
	addon1Name: '',
	addon1Price: 1,
	addon2Name: '',
	addon2Price: 2,
	drinkOptionA: 'Cold',
	drinkOptionB: 'Regular',
	imagePreview: '',
	uploadMessage: '',
})

const loadForm = (value) => {
	if (!value) {
		form.name = ''
		form.category = 'Main'
		form.description = ''
		form.image = ''
		form.smallPrice = 5
		form.mediumPrice = 6
		form.specialPrice = 8
		form.addon1Name = ''
		form.addon1Price = 1
		form.addon2Name = ''
		form.addon2Price = 2
		form.drinkOptionA = 'Cold'
		form.drinkOptionB = 'Regular'
		form.imagePreview = ''
		form.uploadMessage = ''
		return
	}

	form.name = value.name || ''
	form.category = value.category || 'Main'
	form.description = value.description || ''
	form.image = value.image || ''
	form.smallPrice = value.sizes?.[0]?.price ?? 5
	form.mediumPrice = value.sizes?.[1]?.price ?? 6
	form.specialPrice = value.sizes?.[2]?.price ?? 8
	form.addon1Name = value.addons?.[0]?.name || ''
	form.addon1Price = value.addons?.[0]?.price ?? 1
	form.addon2Name = value.addons?.[1]?.name || ''
	form.addon2Price = value.addons?.[1]?.price ?? 2
	form.drinkOptionA = value.drinkOptions?.[0] || 'Cold'
	form.drinkOptionB = value.drinkOptions?.[1] || 'Regular'
	form.imagePreview = value.image || ''
	form.uploadMessage = ''
}

watch(
	() => props.item,
	(value) => loadForm(value),
	{ immediate: true }
)

import { API_BASE } from '../services/api'

const onFileChange = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return

	form.uploadMessage = 'Uploading...'
	form.image = ''
	form.imagePreview = URL.createObjectURL(file)

  try {
    const fd = new FormData()
    fd.append('image', file)

		const resp = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      body: fd,
    })

		const raw = await resp.text()
		let data = null
		try {
			data = raw ? JSON.parse(raw) : null
		} catch (error) {
			data = { raw }
		}
    if (!resp.ok) {
			form.uploadMessage = data?.message || data?.raw || `Upload failed (${resp.status})`
      return
    }

		const nextUrl = data?.url || data?.path || ''
		if (!nextUrl) {
			form.uploadMessage = 'Upload completed but no URL returned.'
			return
		}

		form.image = nextUrl
		form.imagePreview = nextUrl
		form.uploadMessage = 'Image uploaded to server.'
  } catch (error) {
    form.uploadMessage = 'Upload failed: ' + (error?.message || String(error))
  }
}

const isValid = computed(() =>
	form.name.trim() &&
	form.category.trim() &&
	form.description.trim() &&
	form.image.trim()
)

const submitForm = () => {
	if (!isValid.value) return

	const addons = []
	if (form.category === 'Drinks') {
		// drinks store their options separately
	} else {
		if (form.addon1Name.trim()) {
			addons.push({ name: form.addon1Name, price: form.addon1Price })
		}
		if (form.addon2Name.trim()) {
			addons.push({ name: form.addon2Name, price: form.addon2Price })
		}
	}

	emit('submit', {
		name: form.name,
		category: form.category,
		description: form.description,
		image: form.image,
		// only include sizes that have a price greater than 0
		sizes: [
			{ label: 'Small', price: Number(form.smallPrice) },
			{ label: 'Medium', price: Number(form.mediumPrice) },
			{ label: 'Special', price: Number(form.specialPrice) },
		].filter((s) => Number(s.price) > 0),
		addons,
		drinkOptions: form.category === 'Drinks' ? [form.drinkOptionA, form.drinkOptionB] : [],
	})
}
</script>

<template>
	<form class="bg-white border shadow-sm rounded-4 p-4" @submit.prevent="submitForm">
		<div class="d-flex justify-content-between align-items-center mb-3">
			<div class="text-uppercase small text-secondary">Menu Details</div>
			<button class="btn btn-sm btn-outline-dark" type="button" @click="emit('cancel')">Cancel</button>
		</div>

		<div class="mb-3">
			<label class="form-label">Menu name</label>
			<input v-model="form.name" class="form-control" type="text" placeholder="Laksa Sarawak" />
		</div>

		<div class="mb-3">
			<label class="form-label">Category</label>
			<select v-model="form.category" class="form-select">
				<option value="Main">Main</option>
				<option value="Drinks">Drinks</option>
				<option value="Dessert">Dessert</option>
			</select>
		</div>

		<div class="mb-3">
			<label class="form-label">Description</label>
			<textarea v-model="form.description" class="form-control" rows="3"></textarea>
		</div>

		<div class="mb-3">
			<label class="form-label">Image URL / Upload</label>
			<div class="d-flex gap-2">
				<input v-model="form.image" class="form-control" type="url" placeholder="https://..." />
				<input class="form-control form-control-sm" type="file" accept="image/*" @change="onFileChange" />
			</div>
			<div v-if="form.imagePreview" class="mt-2">
				<div class="ratio ratio-4x3 bg-light border rounded-3 overflow-hidden">
					<img :src="form.imagePreview" alt="preview" class="w-100 h-100 object-fit-contain p-2" />
				</div>
			</div>
			<div v-if="form.uploadMessage" class="small text-muted mt-1">{{ form.uploadMessage }}</div>
		</div>

		<div class="row">
			<div class="col-md-4 mb-3">
				<label class="form-label">Small (RM)</label>
				<input v-model.number="form.smallPrice" class="form-control" type="number" min="0" step="0.01" />
			</div>
			<div class="col-md-4 mb-3">
				<label class="form-label">Medium (RM)</label>
				<input v-model.number="form.mediumPrice" class="form-control" type="number" min="0" step="0.01" />
			</div>
			<div class="col-md-4 mb-3">
				<label class="form-label">Special (RM)</label>
				<input v-model.number="form.specialPrice" class="form-control" type="number" min="0" step="0.01" />
			</div>
		</div>

		<div class="row">
			<div class="col-md-6 mb-3">
				<label class="form-label">Add-on 1</label>
				<input v-model="form.addon1Name" class="form-control" type="text" placeholder="Extra Egg" />
			</div>
			<div class="col-md-6 mb-3">
				<label class="form-label">Add-on 1 Price (RM)</label>
				<input v-model.number="form.addon1Price" class="form-control" type="number" min="0" step="0.01" />
			</div>
		</div>

		<div class="row">
			<div class="col-md-6 mb-3">
				<label class="form-label">Add-on 2</label>
				<input v-model="form.addon2Name" class="form-control" type="text" placeholder="Extra Chicken" />
			</div>
			<div class="col-md-6 mb-3">
				<label class="form-label">Add-on 2 Price (RM)</label>
				<input v-model.number="form.addon2Price" class="form-control" type="number" min="0" step="0.01" />
			</div>

			<div v-if="form.category === 'Drinks'" class="mt-3">
				<div class="row g-2">
					<div class="col-md-6">
						<label class="form-label">Drink option A</label>
						<input v-model="form.drinkOptionA" class="form-control" type="text" />
					</div>
					<div class="col-md-6">
						<label class="form-label">Drink option B</label>
						<input v-model="form.drinkOptionB" class="form-control" type="text" />
					</div>
				</div>
			</div>
		</div>

		<div class="d-flex justify-content-between align-items-center">
			<div v-if="!isValid" class="small text-muted">Complete all fields to enable save.</div>
			<button class="btn btn-warning text-dark fw-bold rounded-pill px-4" type="submit" :disabled="!isValid">{{ submitLabel }}</button>
		</div>
	</form>
</template>
