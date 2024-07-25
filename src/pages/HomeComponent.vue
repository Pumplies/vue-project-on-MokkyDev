<template>
  <div>
    <div class="flex justify-between">
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

    <Cards :items="items" @addToFavorite="addToFavorite" @addToAdded="addToAdded" />
  </div>
</template>

<script setup>
import Cards from '../components/CardsItems.vue'
import { onMounted, reactive, ref, watch, provide } from 'vue'
import axios from 'axios'

const items = ref([])
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
    const params = {
      sortBy: filters.sortBy
    }
    if (filters.searchBy) {
      params.title = filters.searchBy
    }
    const { data } = await axios.get(`https://269b3b45e08bcd1a.mokky.dev/items`, {
      params
    })

    items.value = data.map((obj) => ({
      ...obj,
      isAdded: false,
      isFavorite: false
    }))
  } catch (error) {
    console.log(error)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://2564bebf5f31854a.mokky.dev/favorites`)
    items.value = items.value.map((item) => {
      const favorite = favorites.find((fav) => fav.sneakerId === item.id)
      if (!favorite) {
        return item
      }
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (error) {
    console.log(error)
  }
}
const fetchAdded = async () => {
  try {
    const { data: added } = await axios.get(`https://2564bebf5f31854a.mokky.dev/added`)
    items.value = items.value.map((item) => {
      const adds = added.find((add) => add.sneakerId === item.id)
      if (!adds) {
        return item
      }
      return {
        ...item,
        isAdded: true,
        addId: adds.id
      }
    })
  } catch (error) {
    console.log(error)
  }
}
const addToAdded = async (item) => {
  try {
    if (!item.isAdded) {
      const obj = { sneakerId: item.id }
      const { data } = await axios.post('https://2564bebf5f31854a.mokky.dev/added', obj)
      item.isAdded = true
      item.addId = data.id
      console.log(item.addId)
    } else {
      await axios.delete(`https://2564bebf5f31854a.mokky.dev/added/${item.addId}`)
      item.isAdded = false
    }
  } catch (error) {}
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = { sneakerId: item.id }
      const { data } = await axios.post('https://2564bebf5f31854a.mokky.dev/favorites', obj)
      item.isFavorite = true
      item.favoriteId = data.id
    } else {
      await axios.delete(`https://2564bebf5f31854a.mokky.dev/favorites/${item.favoriteId}`)
      item.isFavorite = false
    }
  } catch (error) {}
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeInput = (event) => {
  filters.searchBy = `*${event.target.value}*`
}

onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
  await fetchAdded()
})
watch(filters, fetchItems)
</script>

