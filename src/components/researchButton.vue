<template>
  <label :for="'search-' + searchFrameDevice" class="research mr-4 md:mr-0 md:mb-4">
    <img class="cursor-pointer mx-auto" src="../assets/img/research.png" alt="research">
    <p class="cursor-pointer relative -top-px bg-third-color text-main-color font-medium rounded-full text-center py-1 px-10">重 新 搜 尋</p>
  </label>
</template>

<script>
export default {
  name: 'researchButton',
  props: {
    searchFrameDevice: String
  }
}
</script>
