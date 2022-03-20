<template>
  <div class="home">
    <mapFrame :mapAllData="allData" :maskCutPoint="maskCutPoint"/>
    <searchFrame class="flex md:hidden" searchFrameDevice="mb" :mapData="data.features" v-model:searchText="searchText" @delSearchText="onDelSearchText($event)" v-model:filterMaskBtn="filterMask"/>
    <aside class="z-10 flex flex-col py-4 pl-4 md:pt-6 md:pb-0 md:px-6 w-full md:w-80 h-auto md:h-full bg-main-color fixed bottom-0 left-0 shadow md:shadow-pc">
      <div @click="collapse()" id="collapse" class="absolute translate-x-0 md:translate-x-full top-0 md:top-16 right-12 md:right-0 w-12 h-8 md:w-8 md:h-12 bg-white rounded-br-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tr-2xl shadow opacity-70 hover:opacity-100 flex justify-center items-center cursor-pointer">
        <img src="../assets/img/icon_arrow.svg" class="transform -rotate-90 md:rotate-0" alt="collapse side">
      </div>
      <searchFrame class="hidden md:flex" searchFrameDevice="pc" :mapData="data.features" v-model:searchText="searchText" @delSearchText="onDelSearchText($event)" v-model:filterMaskBtn="filterMask"/>
      <div @click="getStarData" class="showMaskStar inline-block mb-5 mt-0 md:mt-3">
        <input v-model="showMaskStar" value="showMaskStar" class="hidden" type="checkbox" id="checkbox">
        <label for="checkbox" class="flex items-center cursor-pointer">
          <p class="inline-block w-10 h-6 bg-white rounded-full relative"></p>
          <span class="text-xs text-white ml-2">只顯示所有標記過★號的藥局</span>
        </label>
      </div>
      <article class="pharmacyContain flex md:flex-col flex-nowrap items-center md:items-stretch overflow-x-auto md:overflow-x-hidden md:overflow-y-auto">
        <pharmacyCard v-if="!showMaskStar" :listData="searchData" :maskCutPoint="maskCutPoint"/>
        <pharmacyCard v-if="showMaskStar" :listData="starDataWithSearch" :maskCutPoint="maskCutPoint"/>
        <researchButton v-show="searchText && searchData.length>0" @click="onDelSearchText('')" class="hidden md:block" searchFrameDevice="pc"/>
        <researchButton v-show="searchText && searchData.length>0" @click="onDelSearchText('')" class="inline-block md:hidden flex-none" searchFrameDevice="mb"/>
        <img v-show="searchData.length==0 || starData.length==0 && showMaskStar" class="h-40 md:h-auto md:w-3/4 block mr-4 md:mr-0 md:mb-4 md:mr-auto md:ml-auto" src="../assets/img/nodata.png" alt="no data">
      </article>
    </aside>
    <infoModal :mapData="data.features"/>
  </div>
</template>

<script>
// @ is an alias to /src
import pharmacyCard from '@/components/pharmacyCard.vue'
import searchFrame from '@/components/searchFrame.vue'
import researchButton from '@/components/researchButton.vue'
import infoModal from '@/components/infoModal.vue'
import mapFrame from '@/components/map.vue'
import axios from 'axios'
export default {
  name: 'Home',
  components: {
    pharmacyCard,
    searchFrame,
    researchButton,
    infoModal,
    mapFrame
  },
  data () {
    return {
      apiUrl: process.env.VUE_APP_APILocal,
      maskCutPoint: 10,
      data: {
        features: [
          {
            properties: {
              id: '',
              name: '',
              phone: '',
              address: '',
              mask_adult: '0',
              mask_child: '0',
              updated: ''
            },
            geometry: {
              type: 'Point',
              coordinates: [0, 0]
            }
          }
        ]
      },
      allData: [],
      allDataForStar: {},
      starData: [],
      searchText: '',
      filterMask: '',
      showMaskStar: false
    }
  },
  provide () {
    return {
      data: this.data
    }
  },
  methods: {
    collapse () {
      const DOM = document.querySelector('aside')
      DOM.classList.toggle('collapse')
    },
    onDelSearchText (value) {
      this.searchText = value
      document.querySelector('.pharmacyContain').scrollTop = 0
    },
    getStarData () {
      const getStorage = JSON.parse(localStorage.getItem('daylilyMaskMap'))
      this.starData = []
      getStorage.forEach(id => {
        this.starData.push(this.allDataForStar[id])
      })
    },
    init () {
      axios.get(this.apiUrl)
        .then(res => {
          this.allData = res.data.features
          res.data.features.forEach(item => {
            this.allDataForStar[item.properties.id] = item
          })
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
  },
  computed: {
    filterData () {
      let newFilter = []
      if (this.filterMask) {
        newFilter = this.allData.filter(item => {
          return item.properties.address.match(this.filterMask)
        })
        document.querySelector('.pharmacyContain').scrollTop = 0
        return newFilter
      }
      return newFilter
    },
    searchData () {
      return this.data.features.filter(item => {
        return item.properties.name.match(this.searchText)
      })
    },
    starDataWithSearch () {
      return this.starData.filter(item => {
        return item.properties.name.match(this.searchText)
      })
    }
  },
  watch: {
    filterData (newVal) {
      this.data.features = newVal
    }
  },
  created () {
    if (!localStorage.getItem('daylilyMaskMap')) localStorage.setItem('daylilyMaskMap', '[]')
    this.init()
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
  *{
    transition: all .3s;
  }
  html,body, #app, .home{
    height: 100%;
    font-family: 'Noto Sans TC', sans-serif;
    overflow: hidden;
  }
  .collapse{
    transform: translateX(-100%);
    @media (max-width:767px) {
      transform: translateY(79%);
    }
    #collapse>img{
      transform: rotate(180deg);
      @media (max-width:767px) {
        transform: rotate(90deg);
      }
    }
  }
  .showMaskStar{
    p::after{
      content: "";
      position: absolute;
      width: 50%;
      height: 0;
      padding-bottom: 50%;
      top: 50%;
      left: 4%;
      transform: translateY(-50%);
      border-radius: 50%;
      background-color: #ccc;
      transition: all .5s;
    }
    input:checked ~ label>p{
      background-color: #01968F;
      &::after{
        background-color: #fff;
        transform: translateY(-50%) translateX(76%);
      }
    }
  }
  .pharmacyContain{
    @media (min-width:768px){
      &::-webkit-scrollbar{
        width: 8px;
      }
      &::-webkit-scrollbar-track-piece{
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb{
        background-color: rgba(#000, .2);
        border-radius: 4px;
      }
      &:hover::-webkit-scrollbar-thumb{
        background-color: rgba(#000, .4);
      }
    }
  }
</style>
