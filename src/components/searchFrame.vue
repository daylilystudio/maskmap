<template>
  <header class="w-full fixed md:static top-0 left-0 flex flex-row md:flex-col items-center md:items-start p-4 md:p-0">
    <div class="w-1/5 flex flex-col md:flex-row items-center pr-2.5 md:pr-0">
      <img src="../assets/img/visual.png" class="logo md:mx-2" alt="MASK Map">
      <p class="text-secondary-color whitespace-nowrap text-xs md:text-2xl font-bold pt-1.5 md:pt-0 md:pb-2.5">MASK Map</p>
    </div>
    <div class="w-4/5 md:w-full md:-mt-2.5">
      <label class="relative block" :for="('search-' + searchFrameDevice)">
        <span class="absolute left-4 top-1/2 -translate-y-2/4">
          <img src="../assets/img/icon_search.svg" alt="search">
        </span>
        <input :value="searchText" @input="$emit('update:searchText', $event.target.value)" type="text" :id="('search-' + searchFrameDevice)" placeholder="搜 尋 以 下 列 表 藥 局 名"
        class="focus:outline-none focus:ring-2 focus:ring-secondary-color
        w-full h-10 text-sm rounded-full shadow md:shadow-none pl-10 pr-9">
        <button @click="$emit('delSearchText','')" v-if="searchText" class="absolute left-4 top-1/2 -translate-y-2/4 bg-white">
          <img src="../assets/img/icon_del.svg" alt="delete search text">
        </button>
        <!--定位按鈕 <button id="getLocate" class="absolute p-3 right-0 top-1/2 -translate-y-2/4">
          <img src="../assets/img/icon_focus.svg" title="顯示附近5公里內藥局" alt="focus your location">
        </button> -->
      </label>
      <section @wheel.prevent="scrollFilter($event)" class="filterMask overflow-x-auto mt-3">
        <ul class="whitespace-nowrap">
          <li class="w-1/5 inline-block group text-sm text-center font-bold mr-2" v-for="list in filter" :key="list.id">
            <input :value="list.id" @input="$emit('update:filterMaskBtn',$event.target.value)" type="radio" name="filterMask" :id="list.id + searchFrameDevice" class="hidden">
            <label :for="list.id + searchFrameDevice" class="block group-hover:bg-gray-title bg-third-color py-1.5 cursor-pointer rounded-full">
              <span class="whitespace-nowrap text-main-color group-hover:text-white">{{list.text}}</span>
            </label>
          </li>
        </ul>
      </section>
    </div>
  </header>
</template>

<script>
export default {
  name: 'searchFrame',
  props: {
    searchFrameDevice: String,
    mapData: [Array, Object],
    searchText: String
  },
  emits: ['update:searchText', 'delSearchText', 'update:filterMaskBtn'],
  data () {
    return {
      filter: [
        {
          id: '基隆市',
          text: '基隆' // 臺北市
        },
        {
          id: '臺北市',
          text: '臺北' // 臺北市
        },
        {
          id: '新北市',
          text: '新北' // 新北市
        },
        {
          id: '桃園市',
          text: '桃園' // 桃園市
        },
        {
          id: '新竹',
          text: '新竹' // 新竹市,新竹縣
        },
        {
          id: '苗栗縣',
          text: '苗栗' // 苗栗縣
        },
        {
          id: '臺中市',
          text: '臺中' // 臺中市
        },
        {
          id: '彰化縣',
          text: '彰化' // 彰化縣
        },
        {
          id: '南投縣',
          text: '南投' // 南投縣
        },
        {
          id: '雲林縣',
          text: '雲林' // 雲林縣
        },
        {
          id: '嘉義',
          text: '嘉義' // 嘉義市,嘉義縣
        },
        {
          id: '臺南市',
          text: '臺南' // 臺南市
        },
        {
          id: '高雄市',
          text: '高雄' // 高雄市
        },
        {
          id: '屏東縣',
          text: '屏東' // 屏東縣
        },
        {
          id: '宜蘭縣',
          text: '宜蘭' // 宜蘭縣
        },
        {
          id: '花蓮縣',
          text: '花蓮' // 花蓮縣
        },
        {
          id: '臺東縣',
          text: '臺東' // 臺東縣
        },
        {
          id: '澎湖縣',
          text: '澎湖' // 澎湖縣
        },
        {
          id: '金門縣',
          text: '金門' // 金門縣
        },
        {
          id: '連江縣',
          text: '連江' // 連江縣
        }
      ]
    }
  },
  methods: {
    scrollFilter (e) {
      document.querySelectorAll('.filterMask').forEach(DOM => {
        DOM.scrollLeft += e.deltaY * 2
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .logo{
    @media (max-width:767px) {
      width: 60px;
      height: auto;
      & ~ p{
        text-shadow:
          -1px -1px 0 #333,
          1px -1px 0 #333,
          -1px 1px 0 #333,
          1px 1px 0 #333;
      }
    }
  }
  .filterMask {
    @media (min-width:768px){
      &::-webkit-scrollbar{
        width: 0;
        height: 0;
      }
    }
    input:checked ~ label{
      background-color: #333;
      color: #fff;
      span{
        color: #fff;
      }
    }
  }
</style>
