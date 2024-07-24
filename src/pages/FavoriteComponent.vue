<template>
  <div class="flex justify-between ">
    <h2 class="font-bold text-xl p-10">Все кроссовки</h2>
    <div class="flex gap-3 items-center">
      <select
        @change="onChangeSelect"
        class="border border-gray-200 rounded-md outline-none py-2 px-2"
      >
        <option value="title">По названию</option>
        <option value="price">По возрастанию цены</option>
        <option value="-price">По убыванию цены</option>
      </select>
      <div class="relative">
        <input
          @input="onChangeInput"
          type="text"
          class="border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400"
          placeholder="Поиск..."
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src="/search.svg" />
        </div>
      </div>
    </div>
  </div>

  <Cards :items="filteredItems" @addToFavorite="addToFavorite" />
</template>

<script setup>
import Cards from '../components/CardsItems.vue'
import { onMounted, reactive, ref, watch, provide, computed } from 'vue'
import axios from 'axios'

const items = ref([])
const favorites = ref([])
const openCart = ref(false)
const filters = reactive({
  sortBy: 'title',
  searchBy: ''
})

const openDrawer = () => {
  openCart.value = true
}
const closeDrawer = () => {
  openCart.value = false
}

provide('closeDrawer', closeDrawer)

const fetchItems = async () => {
  try {
    const { data } = await axios.get('https://269b3b45e08bcd1a.mokky.dev/items')
    items.value = data.map((obj) => ({
      ...obj,
      isAdded: false,
      isFavorite: false
    }))
    await fetchFavorites()
    markFavorites()
  } catch (error) {
    console.log(error)
  }
}

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get('https://2564bebf5f31854a.mokky.dev/favorites')
    favorites.value = data
  } catch (error) {
    console.log(error)
  }
}

const markFavorites = () => {
  items.value = items.value.map((item) => {
    const favorite = favorites.value.find((fav) => fav.sneakerId === item.id)
    if (favorite) {
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    }
    return item
  })
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = { sneakerId: item.id }
      const { data } = await axios.post('https://2564bebf5f31854a.mokky.dev/favorites', obj)
      item.isFavorite = true
      item.favoriteId = data.id
      favorites.value.push({ sneakerId: item.id, id: data.id })
    } else {
      await axios.delete(`https://2564bebf5f31854a.mokky.dev/favorites/${item.favoriteId}`)
      item.isFavorite = false
      favorites.value = favorites.value.filter(fav => fav.id !== item.favoriteId)
      item.favoriteId = null
    }
  } catch (error) {
    console.log(error)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeInput = (event) => {
  filters.searchBy = event.target.value
}

const filteredItems = computed(() => {
  let filtered = items.value.filter(item => item.isFavorite)
  if (filters.searchBy) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(filters.searchBy.toLowerCase()))
  }
  if (filters.sortBy === 'price') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (filters.sortBy === '-price') {
    filtered.sort((a, b) => b.price - a.price)
  } else {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  }
  return filtered
})

onMounted(async () => {
  await fetchItems()
})
watch(filters, fetchItems)
</script>

<style scoped>
</style>
