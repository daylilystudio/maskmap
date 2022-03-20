<template>
  <div @click="ifOpenInfo=!ifOpenInfo" class="fixed right-4 md:right-2 top-1/3 md:top-3 bg-white p-2.5 rounded-full shadow md:shadow-pc cursor-pointer">
    <img src="../assets/img/icon_info.svg" alt="">
  </div>
  <transition>
    <div v-show="ifOpenInfo" class="z-20 fixed w-full h-full flex justify-center items-center">
      <div class="bg-white text-gray-title shadow rounded-2xl relative z-50 pt-4 pb-5">
        <h5 class="px-8 text-xl font-medium text-center md:text-left">口罩數量顏色提示</h5>
        <hr class="w-full h-px my-4 bg-gray-decolight border-0">
        <ul class="flex flex-col md:flex-row px-8">
          <li class="flex justify-center items-center mb-4 md:mb-0 md:mr-8">
            <span class="inline-block w-16 h-8 mr-2 rounded-full bg-enough-color text-xs text-white flex justify-center items-center">10 ↑</span>充 足
          </li>
          <li class="flex justify-center items-center mb-4 md:mb-0 md:mr-8">
            <span class="inline-block w-16 h-8 mr-2 rounded-full bg-little-color text-xs text-white flex justify-center items-center">10 ↓</span>少 量
          </li>
          <li class="flex justify-center items-center">
            <span class="inline-block w-16 h-8 mr-2 rounded-full bg-gray-tips text-xs text-white flex justify-center items-center">0</span>缺 貨
          </li>
        </ul>
        <p class="text-sm text-gray-tips text-center mt-5 mb-4 px-4">
          ※ 地圖標記點顏色以成人為主<br>
          ※ 點左側清單藥局名可移至地圖標記點<br><br>
          庫存量最後更新時間 <br class="sm:hidden">{{mapData[0].properties.updated}}<br>
          防疫專線 1922 ｜ 口罩資訊 1919
        </p>
        <p class="text-sm font-medium text-center px-4">
          This site serves for Taiwan<br>
          <a href="https://github.com/daylilystudio" target="_blank">→ Author's Github</a>
        </p>
        <button @click="ifOpenInfo=!ifOpenInfo" class="absolute text-gray-deco -top-9 left-1/2 -translate-x-1/2">╳</button>
      </div>
      <div @click="ifOpenInfo=!ifOpenInfo" class="absolute w-full h-full bg-black bg-opacity-50"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'infoModal',
  props: {
    mapData: [Array, Object]
  },
  data () {
    return {
      ifOpenInfo: false
    }
  }
}
</script>

<style lang="scss" scoped>
.v-enter-from, .v-leave-to{
  opacity: 0;
}
.v-enter-to, .v-leave-from{
  opacity: 1;
}
</style>
