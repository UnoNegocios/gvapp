<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-toolbar style="filter: brightness(2);">
        <ion-buttons slot="start">
          <ion-button :router-link="$router.options.history.state.back">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <div style="margin-top:30px;">
          <ion-card style="margin-top:10px;" v-for="(element, index) in results" v-bind:key="index" :router-link="`/detail/${element.slug}`">
              <ion-card-title class="ion-padding" style="font-size: 18px; font-weight: 600;">{{element.title}}</ion-card-title>
          </ion-card>
      </div>

      <ion-infinite-scroll v-if="meta.next_link!=undefined" @ionInfinite="ionInfinite($event)">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <ion-slides pager="false" v-if="banners_slider!=undefined" :options="slideOpts">
        <ion-slide v-for="banner in banners_slider" :key="banner.id" @click="clicAd(banner)">
            <ion-img style="margin:30px;" :src="banner.image_url" ></ion-img>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonText, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSlides, IonSlide, IonButton, IonCard, IonCardTitle, IonImg } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowBack } from "ionicons/icons"
import axios from "axios"

export default defineComponent({
  name: 'HomePage',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSlides, 
    IonSlide,
    IonButton,
    IonText,
    IonCard,
    IonCardTitle,
    IonImg,
    IonRefresher,
IonRefresherContent,
IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup(){
    return{
      arrowBack
    }
  },
  data(){
    return{
      banners_slider:undefined,
      slideOpts: {
        speed: 2000,
        autoplay:true,
      },
    }
  },
  computed:{
    meta(){
      return this.$store.state.search.meta
    },
    results(){
        return this.$store.state.search.result
    }
  },
  created(){
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=Resultado de Busqueda&itemsPerPage=3').then(response=>{
      this.banners_slider = response.data
    })
  },
  methods:{
    ionInfinite(ev){
      this.$store.dispatch('search/moreResults').then(response=>{
        console.log(this.results.length)
        ev.target.complete()
      })
    },
    handleRefresh(event) {
      this.$store.dispatch('search/refreshResults').then(response=>{
        event.target.complete();
      })
    },
    clicAd(ad){
      fetch('https://gv.unocrm.mx/api/v1/click_ad/' + ad.id).then(response =>{
        window.open(ad.url, '_blank');
      });
    },
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>