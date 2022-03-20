<template>
  <div id="map" class="w-full top-0 bottom-0"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import emitter from '@/mitt'
const turf = require('@turf/turf')
export default {
  name: 'mapFrame',
  props: {
    mapAllData: [Array, Object],
    maskCutPoint: [Number]
  },
  inject: ['data'],
  methods: {
    createMarker (arr) {
      arr.forEach(point => {
        const el = document.createElement('div')
        el.dataset.id = point.properties.id
        if (point.properties.mask_adult > this.maskCutPoint) {
          el.className = 'markerEnough'
        } else if (point.properties.mask_adult <= this.maskCutPoint && point.properties.mask_adult > 0) {
          el.className = 'markerLittle'
        } else {
          el.className = 'markerOutof'
        }
        new mapboxgl.Marker(el)
          .setLngLat(point.geometry.coordinates)
          .addTo(this.map)
        el.addEventListener('click', (e) => {
          this.createPopUp(point.geometry.coordinates, point.properties.mask_adult, point.properties.mask_child)
          this.activeCard(e)
          e.stopPropagation()
        })
      })
    },
    removeMark () {
      document.querySelectorAll('.markerEnough, .markerLittle, .markerOutof').forEach(point => {
        point.remove()
      })
    },
    flyToStore (location) {
      this.map.flyTo({
        center: location,
        zoom: 14
      })
    },
    createPopUp (location, adultNum, childNum) {
      const popUps = document.getElementsByClassName('mapboxgl-popup')
      if (popUps[0]) popUps[0].remove()
      let adultClass = ''
      let childClass = ''
      if (adultNum > this.maskCutPoint) {
        adultClass = 'text-enough-color'
      } else if (adultNum <= this.maskCutPoint && adultNum > 0) {
        adultClass = 'text-little-color'
      } else {
        adultClass = 'text-gray-tips'
      }
      if (childNum > this.maskCutPoint) {
        childClass = 'text-enough-color'
      } else if (childNum <= this.maskCutPoint && childNum > 0) {
        childClass = 'text-little-color'
      } else {
        childClass = 'text-gray-tips'
      }
      new mapboxgl.Popup({
        offset: 22,
        closeOnClick: false,
        closeButton: false,
        anchor: 'bottom'
      })
        .setLngLat(location)
        .setHTML(`<span class="${adultClass}">${adultNum}</span> | <span class="${childClass}">${childNum}</span>`)
        .addTo(this.map)
    },
    activeCard (dom) {
      const activeDom = document.getElementById(dom.target.dataset.id)
      const siblingDom = activeDom.parentNode.childNodes
      siblingDom.forEach(item => {
        if (item.childNodes.length > 0) { // 排除無法使用classList的空值
          item.classList.remove('active')
        }
      })
      activeDom.classList.add('active')
      activeDom.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    }
  },
  mounted () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoib3dlbmxhbWIiLCJhIjoiY2lleWljcnF4MDBiOXQ0bHR0anRvamtucSJ9.t3YnHHqvQZ8Y0MTCNy0NNw'
    this.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/light-v9', // style URL
      center: [121.513104, 25.114259], // starting position [lng, lat]
      zoom: 12 // starting zoom
    })
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
      visualizePitch: false
    }), 'bottom-right')
    // 加入所在位置鈕
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
      fitBoundsOptions: { zoom: 14 }
    })
    this.map.addControl(geolocate, 'bottom-right')
    // load map
    this.map.on('load', () => {
      // 初始時先定位所在位置
      geolocate.trigger()
      // 如果可以獲取定位點
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this.data.features = []
          const current = turf.point([position.coords.longitude, position.coords.latitude])
          // 算出附近5公里內的點
          this.mapAllData.forEach(point => {
            const to = turf.point(point.geometry.coordinates)
            const distance = turf.distance(current, to, { units: 'kilometers' })
            const distanceMath = Math.round(distance * 100) / 100
            if (distanceMath <= 5) {
              point.properties.distance = distanceMath
              this.data.features.push(point)
            }
          })
          this.data.features.sort((a, b) => {
            if (a.properties.distance > b.properties.distance) return 1
            if (a.properties.distance < b.properties.distance) return -1
            return 0 // a must be equal to b
          })
          // 在地圖增加 markers
          this.createMarker(this.data.features)
        }, (err) => {
          // 如果user沒開位置資訊就顯示JSON前50筆 markers
          this.data.features = this.mapAllData.slice(0, 50)
          this.createMarker(this.data.features)
          console.warn(`ERROR(${err.code}): ${err.message}`)
        })
      } else {
        console.log('no geolocation')
      }
    })
  },
  watch: {
    data: {
      handler (newVal) {
        this.removeMark()
        this.createMarker(newVal.features)
      },
      deep: true
    }
  },
  created () {
    emitter.on('active_marker', (data) => {
      const target = data.geo.split(',')
      this.flyToStore(target)
      this.createPopUp(target, data.adult, data.child)
    })
  }
}
</script>

<style lang="scss">
#map{
  position: absolute;
}
.mapboxgl-popup{
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 16px;
  transition: unset;
  letter-spacing: 1px;
  &-content{
    color: #ccc;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4) !important;
    border-radius: 10px !important;
    padding: .5rem .75rem !important;
    @media (max-width:767px) {
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25) !important;
    }
  }
  &-tip{
    display: none;
  }
}
.mapboxgl-ctrl-group {
  &.mapboxgl-ctrl{
    margin: 0 12px 12px 0 !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4) !important;
    @media (max-width:767px) {
      .mapboxgl-ctrl-zoom-in, .mapboxgl-ctrl-zoom-out{
        display: none;
      }
      & ~ .mapboxgl-ctrl{
        transform: translateY(-50vh);
        margin-right: 1rem !important;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
  button {
    width: 32px !important;
    height: 32px !important;
    @media (max-width:767px) {
      width: 36px !important;
      height: 36px !important;
    }
  }
}
.markerEnough, .markerLittle, .markerOutof {
  background-size: cover;
  width: 28px;
  height: 40px;
  cursor: pointer;
}
.markerEnough {
  background-image: url('../assets/img/icon_localGreen.svg');
}
.markerLittle {
  background-image: url('../assets/img/icon_localRed.svg');
}
.markerOutof {
  background-image: url('../assets/img/icon_localGray.svg');
}
</style>
