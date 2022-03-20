<template>
  <section v-for="card in listData" :id="card.properties.id" :key="card.properties.id" class="pharmacyCard flex-none w-4/5 md:w-full bg-white shadow rounded-2xl px-4 pt-2.5 mr-4 md:mr-0 md:mb-4">
    <div class="flex justify-between items-center">
      <h5 @click="activeMarker($event)" :data-geo="card.geometry.coordinates" :data-adult="card.properties.mask_adult" :data-child="card.properties.mask_child" class="cursor-pointer flex-1 flex justify-between items-center font-medium">
        {{card.properties.name}}
        <span class="text-xs text-gray-tips pr-2" v-if="card.properties.distance">距離 {{card.properties.distance}}km</span>
      </h5>
      <fieldset class="markStar flex items-center">
        <input @click="clickMarkStar($event)" :data-id="card.properties.id" value="markStar" class="hidden" type="checkbox" :id="'markStar'+ card.properties.id" :checked="ifMarkStar(card.properties.id)">
        <label :for="'markStar'+ card.properties.id" class="block cursor-pointer relative -top-0.5">
          <svg class="w-5 h-auto overflow-visible" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.14168 0.556577L5.18879 4.69357L0.819452 5.35911C0.035902 5.47784 -0.278116 6.48709 0.290107 7.06515L3.45122 10.2835L2.70356 14.8298C2.56898 15.6516 3.39739 16.2671 4.09122 15.8828L8 13.7362L11.9088 15.8828C12.6026 16.264 13.431 15.6516 13.2964 14.8298L12.5488 10.2835L15.7099 7.06515C16.2781 6.48709 15.9641 5.47784 15.1805 5.35911L10.8112 4.69357L8.85832 0.556577C8.50841 -0.180831 7.49458 -0.190205 7.14168 0.556577Z"/>
          </svg>
        </label>
      </fieldset>
    </div>
    <ul class="flex justify-between my-2">
      <li class="flex flex-1 bg-gray-decolight rounded-xl mr-2">
        <img :class="{'little': card.properties.mask_adult <= maskCutPoint && card.properties.mask_adult > 0,'outof': card.properties.mask_adult == 0}" class="w-8 ml-2 mr-1" src="../assets/img/icon_adult.svg" alt="adult icon">
        <div :class="{'text-enough-color': card.properties.mask_adult > maskCutPoint, 'text-little-color': card.properties.mask_adult <= maskCutPoint && card.properties.mask_adult > 0,'text-gray-tips': card.properties.mask_adult == 0}">
          <span class="text-xs">成人</span>
          <p class="text-2xl font-bold leading-6 mb-1.5">{{card.properties.mask_adult}}</p>
        </div>
      </li>
      <li class="flex flex-1 bg-gray-decolight rounded-xl">
        <img :class="{'little': card.properties.mask_child <= maskCutPoint && card.properties.mask_child > 0,'outof': card.properties.mask_child == 0}" class="w-8 ml-2 mr-1" src="../assets/img/icon_child.svg" alt="child icon">
        <div :class="{'text-enough-color': card.properties.mask_child > maskCutPoint, 'text-little-color': card.properties.mask_child <= maskCutPoint && card.properties.mask_child > 0,'text-gray-tips': card.properties.mask_child == 0}">
          <span class="text-xs">兒童</span>
          <p class="text-2xl font-bold leading-6 mb-1.5">{{card.properties.mask_child}}</p>
        </div>
      </li>
    </ul>
    <p class="text-xs text-gray-inline">{{card.properties.address}}</p>
    <p class="text-sm text-gray-inline mt-0.5 mb-1.5">{{card.properties.phone}}</p>
    <div class="flex text-sm text-gray-tips relative">
      <div class="absolute w-full h-px bg-gray-decolight"></div>
      <div class="absolute w-px h-3/5 top-2/4 left-2/4 -translate-y-1/2 bg-gray-decolight"></div>
      <a :href="('https://www.google.com/maps/place/'+card.properties.address)" target="_blank" class="flex flex-1 justify-center items-center pt-2.5 pb-2">
        <img class="mr-1" src="../assets/img/icon_map.svg" alt="look location in your map">
        <span>開啟地圖</span>
      </a>
      <a :href="('tel:'+card.properties.phone)" class="flex flex-1 justify-center items-center pt-2.5 pb-2">
        <img class="mr-1" src="../assets/img/icon_phone.svg" alt="call the pharmacy number">
        <span>撥打電話</span>
      </a>
    </div>
  </section>
</template>

<script>
import emitter from '@/mitt'
export default {
  name: 'pharmacyCard',
  props: {
    listData: [Array, Object],
    maskCutPoint: [Number]
  },
  methods: {
    activeMarker (e) { // miit名稱不能用駝峰
      emitter.emit('active_marker', {
        geo: e.target.dataset.geo,
        adult: e.target.dataset.adult,
        child: e.target.dataset.child
      })
      // 加入active樣式
      const activeDom = e.target.parentNode.parentNode
      const siblingDom = activeDom.parentNode.childNodes
      siblingDom.forEach(item => {
        if (item.childNodes.length > 0) { // 排除無法使用classList的空值
          item.classList.remove('active')
        }
      })
      activeDom.classList.add('active')
    },
    clickMarkStar (e) {
      const getStorage = JSON.parse(localStorage.getItem('daylilyMaskMap'))
      getStorage.forEach((item, index) => {
        if (item === e.target.dataset.id) {
          getStorage.splice(index, 1)
          localStorage.setItem('daylilyMaskMap', JSON.stringify(getStorage))
        }
      })
      if (e.target.checked) {
        getStorage.push(e.target.dataset.id)
        localStorage.setItem('daylilyMaskMap', JSON.stringify(getStorage))
      }
    },
    ifMarkStar (id) {
      const getStorage = JSON.parse(localStorage.getItem('daylilyMaskMap'))
      if (getStorage.length) {
        // 這裡如果用forEach跑迴圈會吃不到return true，不懂為何
        for (let i = 0; i < getStorage.length; i++) {
          if (getStorage[i] === id) return true
        }
      } else return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .markStar {
    svg path{
      stroke-width: 1;
      stroke: #888;
    }
    input:checked ~ label{
      svg path{
        stroke: #FFC773;
        fill: #FFC773;
      }
    }
  }
  .pharmacyCard{
    transition: all .3s;
    @media (max-width:280px) {
      width: 92%;
    }
    &.active{
      box-shadow: 0 3px 6px rgba(0, 0, 0, .5),0 -1px 6px rgba(0, 0, 0, .15);
      background-image: linear-gradient(45deg, #FFD6C9 0%, #fff 30%, #fff 75%, #FFD6C9 100%);
    }
  }
  .little{
    filter: invert(53%) sepia(12%) saturate(2620%) hue-rotate(306deg) brightness(81%) contrast(109%);
  }
  .outof{
    filter: invert(60%) sepia(2%) saturate(4%) hue-rotate(319deg) brightness(89%) contrast(88%);
  }
</style>
