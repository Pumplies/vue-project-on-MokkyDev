
<script setup>
import HeaderCart from './HeaderCart.vue'
import CartItem from './CartItem.vue'

import { onMounted, ref } from 'vue'
import axios from 'axios'

const items = ref([])

const fetchItems = async () => {
  try {
    const { data } = await axios.get('https://269b3b45e08bcd1a.mokky.dev/items')
    items.value = data.map((obj) => ({
      ...obj,
      isAdded: false,
    }))
    await fetchFavorites()
  } catch (error) {
    console.log(error)
  }
}

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get('https://269b3b45e08bcd1a.mokky.dev/items')
    const { data: favorites } = await axios.get('https://2564bebf5f31854a.mokky.dev/added')

    const favoritesData = data.filter((item) => favorites.find((fav) => fav.sneakerId === item.id))
    items.value = favoritesData.map((item) => ({
      ...item,
      isAdded: true,
      favoriteId: favorites.find((fav) => fav.sneakerId === item.id).id
    }))

    console.log(items.value)
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await fetchItems()
})
</script>




<template>
<div>
  <div class="bg-black h-full w-full fixed top-0 left-0 z-10 opacity-70"></div>
    <div class="w-96 fixed top-0 right-0 z-20 bg-white h-full p-10 ">
    <HeaderCart />
    <div class="flex flex-col h-full justify-between">
      <div class="flex flex-col gap-5">
        <CartItem
           v-for="item in items"
            :key="item.id"
            :title="item.title"
            :price="item.price"
            :img="item.imageUrl"
        />
      </div>

      <div>
        <div class="flex flex-col gap-5">
          <div class="flex items-end gap-2">
            <span>Итого:</span>
            <div class="flex-1 border-b border-dashed" />
            <span class="font-bold">1000 руб.</span>
          </div>

          <div class="flex items-end gap-2">
            <span>Налог 5%:</span>
            <div class="flex-1 border-b border-dashed" />
            <span class="font-bold">50 руб.</span>
          </div>
        </div>

        <button
          class="flex justify-center items-center gap-3 w-full py-3 mt-10 bg-lime-500 text-white rounded-xl transition active:bg-lime-700 hover:bg-lime-600"
        >
          Оформить заказ
          <img src="/arrow-next.svg" alt="Arrow" />
        </button>
      </div>
    </div>
  </div>
  </div>
  
</template>

