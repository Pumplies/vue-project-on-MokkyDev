<script setup>
import Card from './CardItem.vue'

defineProps({
  items: Array
})

const emit = defineEmits(['addToFavorite', 'addToAdded'])


</script>

<template>
  <div class="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5" v-auto-animate>
    <Card 
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :image="item.imageUrl"
      :name="item.title"
      :price="item.price"
      :isAdded="item.isAdded"
      :isFavorite="item.isFavorite"
      :onClickAdd="() => emit('addToAdded', item)"
      :onClickFavorite="() => emit('addToFavorite', item)"
    />
  </div>
</template>