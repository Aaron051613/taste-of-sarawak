<script setup>
import { computed, reactive } from 'vue'
import menuStore from '../store/menu'
import ratingsStore from '../store/ratings'
import userStore from '../store/user'

const items = computed(() => menuStore.state.items)
const isAdmin = computed(() => userStore.isAdmin.value)
const categoryOrder = {
	Main: 0,
	Drinks: 1,
	Dessert: 2,
}

const drafts = reactive({})
const messages = reactive({})

const ensureDraft = (productId) => {
	const key = String(productId)
	if (!drafts[key]) {
		drafts[key] = {
			rating: 0,
			comment: '',
		}
	}
	return drafts[key]
}

const setRating = (productId, value) => {
	const draft = ensureDraft(productId)
	draft.rating = value
}

const onCommentInput = (productId) => {
	const draft = ensureDraft(productId)
	const words = draft.comment.trim().split(/\s+/).filter(Boolean)
	if (words.length > 50) {
		draft.comment = words.slice(0, 50).join(' ')
	}
}

const wordCount = (productId) => {
	const draft = ensureDraft(productId)
	if (!draft.comment.trim()) return 0
	return draft.comment.trim().split(/\s+/).filter(Boolean).length
}

const ratingsFor = (productId) => ratingsStore.getRatings(productId)

const badgeClass = () => 'text-bg-warning text-dark'

const averageRating = (productId) => {
	const list = ratingsFor(productId)
	if (list.length === 0) return 0
	const sum = list.reduce((total, item) => total + item.rating, 0)
	return (sum / list.length).toFixed(1)
}

const submitRating = (productId) => {
	const draft = ensureDraft(productId)
	const count = wordCount(productId)
	messages[productId] = ''

	if (draft.rating < 1 || draft.rating > 5) {
		messages[productId] = 'Please select a 1-5 star rating.'
		return
	}

	if (count === 0) {
		messages[productId] = 'Please add a short comment (max 50 words).'
		return
	}

	ratingsStore.addRating(productId, {
		rating: draft.rating,
		comment: draft.comment,
	})

	draft.rating = 0
	draft.comment = ''
	messages[productId] = 'Thanks! Your rating is saved on this page.'
}

const removeRating = (productId, index) => {
	if (!isAdmin.value) return
	ratingsStore.deleteRating(productId, index)
}

const groupedItems = computed(() => {
	const sorted = [...items.value].sort((a, b) => {
		const categoryDiff = (categoryOrder[a.category] ?? 999) - (categoryOrder[b.category] ?? 999)
		if (categoryDiff !== 0) return categoryDiff
		return a.id - b.id
	})

	const groups = {
		Main: [],
		Drinks: [],
		Dessert: [],
	}

	for (const product of sorted) {
		if (!groups[product.category]) {
			groups[product.category] = []
		}
		groups[product.category].push(product)
	}

	return Object.entries(groups)
		.filter(([, list]) => list.length > 0)
		.map(([category, list]) => ({ category, list }))
})
</script>

<template>
	<section class="py-5">
		<div class="container-fluid px-4">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
				<div>
					<div class="text-uppercase small text-secondary">
						{{ isAdmin ? 'Admin Ratings' : 'Community Ratings' }}
					</div>
					<h2 class="fw-bold mb-0">
						{{ isAdmin ? 'Manage Customer Ratings' : 'Rate Sarawak Menu' }}
					</h2>
				</div>
				<div class="small text-muted">Ratings here do not affect menu pages.</div>
			</div>

			<div v-for="group in groupedItems" :key="group.category" class="mb-4">
				<div class="d-flex align-items-center justify-content-between mb-3">
					<div class="text-uppercase small fw-semibold text-secondary">{{ group.category }}</div>
					<span class="badge text-bg-light border text-secondary rounded-pill px-3 py-2">Section</span>
				</div>
				<div class="row g-4">
					<div v-for="product in group.list" :key="product.id" class="col-12 col-xl-6">
						<div class="card border border-3 border-danger shadow-sm rounded-4 h-100">
							<div class="card-body p-4">
								<div class="row g-4 align-items-start">
									<div class="col-12 col-lg-7">
										<div class="card border-0 rounded-4 mb-3 overflow-hidden">
											<div class="card-header border-0 text-center text-dark fw-bold"
												:class="badgeClass(product.category)">
												{{ product.category }}
											</div>
										</div>

										<div class="d-flex justify-content-between align-items-start gap-3 mb-3">
											<div>
												<h6 class="fw-bold mb-1">{{ product.name }}</h6>
												<div class="small text-muted">Taste of Sarawak</div>
											</div>
											<router-link v-if="!isAdmin"
												class="btn btn-sm btn-outline-dark rounded-pill"
												:to="`/menu/${product.id}`">
												View
											</router-link>
										</div>

										<div class="d-flex align-items-center gap-3 mb-3">
											<div class="fw-semibold">Average:</div>
											<div class="badge text-bg-dark rounded-pill px-3 py-2">{{
												averageRating(product.id) || '0.0' }}</div>
											<div class="small text-muted">{{ ratingsFor(product.id).length }} ratings
											</div>
										</div>

										<div v-if="!isAdmin">
											<div class="mb-3">
												<div class="small text-secondary mb-2">Your rating</div>
												<div class="d-flex flex-wrap gap-2">
													<button v-for="star in 5" :key="star"
														class="btn btn-sm rounded-pill"
														:class="ensureDraft(product.id).rating >= star ? 'btn-warning text-dark fw-bold' : 'btn-outline-dark'"
														type="button" @click="setRating(product.id, star)">
														{{ star }} ★
													</button>
												</div>
											</div>

											<div class="mb-3">
												<label class="form-label">Comment (max 50 words)</label>
												<textarea v-model="ensureDraft(product.id).comment" class="form-control"
													rows="3" placeholder="Share your experience"
													@input="onCommentInput(product.id)"></textarea>
												<div class="small text-muted mt-1">{{ wordCount(product.id) }} / 50
													words</div>
											</div>

											<div
												class="d-flex flex-wrap justify-content-between align-items-center gap-3">
												<div class="small text-muted">{{ messages[product.id] }}</div>
												<button class="btn btn-warning text-dark fw-bold rounded-pill px-4"
													type="button" @click="submitRating(product.id)">
													Submit Rating
												</button>
											</div>
										</div>

										<div v-if="ratingsFor(product.id).length" class="border-top mt-4 pt-3">
											<div class="small text-secondary mb-2">Latest comments</div>
											<div v-for="(item, index) in ratingsFor(product.id).slice(0, 3)"
												:key="index" class="mb-3">
												<div class="fw-semibold">{{ item.rating }} ★</div>
												<div class="small text-muted">{{ item.comment }}</div>
												<button v-if="isAdmin"
													class="btn btn-sm btn-outline-danger rounded-pill mt-2"
													type="button" @click="removeRating(product.id, index)">
													Delete rating
												</button>
											</div>
										</div>
									</div>
									<div class="col-12 col-lg-5">
										<div class="card border rounded-4 bg-white overflow-hidden">
											<div class="ratio ratio-4x3 bg-white">
												<img :src="product.image" :alt="product.name"
													class="w-100 h-100 object-fit-contain p-3" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
