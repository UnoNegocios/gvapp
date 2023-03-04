<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
</ion-refresher>

      <!--div id="container"--->
        <marquee style="background:#1f1f1f; padding:9px 0px 7px 0px; position: fixed; z-index: 9;">
          <span v-for="(element, index) in slides.data" v-bind:key="index">
            <ion-chip style="height: 20px; background: white; color: black; font-weight: 600; font-size: 12px; transform: translateY(-1px); border-radius:5px;">
              {{element.categories[0].name}}
            </ion-chip>
            <span style="margin-right:20px; margin-left:5px; color:white;">{{element.title}}</span>
          </span>
        </marquee>

        <ion-slides pager="true" :options="slideOpts" v-if="slides.show" style="margin-top:40px;">
          <ion-slide :router-link="`/detail/${slide.slug}`" v-for="(slide, index) in slides.data" v-bind:key="index">
            <ion-card :style="'margin:0px; background-position: center; background-size: cover!important; background-image: url(' + slide.featured_media_path + '); height:50vh; width:100vw!important;'">
              <div class="ion-padding" style="background:#1c1c1d; position:absolute; bottom:0; width:100vw">
                <ion-card-title style="font-size: 18px; font-weight: 600; margin-bottom:10px; text-align:left;"  v-html="slide.title"></ion-card-title>
                <ion-card-subtitle style="text-align:left;">{{dateFormat(slide.created_at)}}</ion-card-subtitle>
              </div>
            </ion-card>
          </ion-slide>
        </ion-slides>      

        <!--ion-slides pager="true" :options="slideOpts" v-if="slides.show">
          <ion-slide :router-link="`/detail/${slide.slug}`" v-for="(slide, index) in slides.data" v-bind:key="index" :style="'background-position: center; background-size: cover!important; background-blend-mode: multiply; background-color: rgba(0,0,0,0.55); height:50vh; background-image: url(' + slide.featured_media_path + ');'">
              <h1 style="position:absolute; bottom:0px; padding:10px; color:white!important;">{{slide.title}}</h1>
          </ion-slide>
        </ion-slides-->     

        <ion-segment scrollable style="padding: 15px 10px; background:transparent;">
          <ion-chip @click="segmentChanged('inicio')" :style="'display: inline-table; width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; box-shadow: 0px 0px 3px white;' + background('inicio')" :outline="'inicio' != category" :color="selectedCategoryColor('inicio')">
              Inicio
          </ion-chip>
          <ion-chip @click="segmentChanged(item.id)" v-for="(item, index) in categories" v-bind:key="index" :style="'display: inline-table; width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; box-shadow: 0px 0px 3px white;' + background(item.id)" :outline="item.id != category" :color="selectedCategoryColor(item.id)">
              {{item.name}}
          </ion-chip>
        </ion-segment>

        <ion-slides v-if="banners_slider!=undefined" pager="false" :options="slideOpts2">
          <ion-slide v-for="banner in banners_slider" :key="banner.id" @click="clicAd(banner)">
              <ion-img style="margin:30px;" :src="banner.image_url" ></ion-img>
          </ion-slide>
        </ion-slides>


          <div v-if="news.show" style="margin-top:40px;">

            <ion-card v-for="(element, index) in news.data" v-bind:key="index" :router-link="`/detail/${element.slug}`" :style="'margin:10px 0px 0px 5vw; background-position: center; background-size: cover!important; background-image: url(' + element.featured_media_path + '); height:30vh; width:90vw!important;'">
              <div class="ion-padding" style="background:#1c1c1d; position:absolute; bottom:0; width:90vw;">
                <ion-card-title style="font-size: 18px; font-weight: 600; margin-bottom:10px; text-align:left;"  v-html="element.title"></ion-card-title>
                <ion-card-subtitle style="text-align:left;">{{dateFormat(element.created_at)}}</ion-card-subtitle>
              </div>
            </ion-card>

            

            


            <!--ion-card style="margin-top:10px;" v-for="(element, index) in news.data" v-bind:key="index" :router-link="`/detail/${element.slug}`">
              <ion-img class="ion-justify-content-start" :src="element.featured_media_path" ></ion-img>
              <div class="ion-padding">
                <ion-card-title style="font-size: 18px; font-weight: 600; margin-bottom:10px;"  v-html="element.title"></ion-card-title>
                <ion-card-subtitle>{{dateFormat(element.created_at)}}</ion-card-subtitle>
              </div>
            </ion-card-->
          </div>

          <ion-infinite-scroll v-if="next_link!=undefined" @ionInfinite="ionInfinite($event)">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>

          
          <ion-slides v-if="banners_slider2!=undefined" pager="false" :options="slideOpts2">
            <ion-slide v-for="banner in banners_slider2" :key="banner.id" @click="clicAd(banner)">
                <ion-img style="margin:30px;" :src="banner.image_url" ></ion-img>
            </ion-slide>
          </ion-slides>

          <!--ion-button expand="block" color="primary" style="margin:30px;" :router-link="`/posts/${category}`">VER MÁS</ion-button-->

          

          
      <!--/div-->
    </ion-content>
  </ion-page>
</template>

<script>

import { IonText, IonRefresher, IonRefresherContent,IonContent, IonHeader, IonSegment, IonChip, IonPage, IonTitle, IonToolbar, IonSlides, IonSlide, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonImg } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios'

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
    IonSegment, 
    IonChip, 
    IonCardSubtitle,
    IonRefresher,
IonRefresherContent
  },
  data(){
    return{
      hoy: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10),
      banners_slider: undefined,
      banners_slider2: undefined,
      slideOpts: {
        speed: 500,
        autoplay:true,
      },
      slideOpts2: {
        speed: 2000,
        autoplay:true,
      },
      category:'inicio'
    }
  },
  computed:{
    next_link(){
      return this.$store.state.posts.next_page
    },
    categories(){
      return this.$store.state.categories.categories
    },
    slides(){
      return {
        data:this.$store.state.posts.posts,
        show:this.$store.state.posts.show
      }
    },
    news(){
      return {
        data:this.$store.state.posts.posts_by_category,
        show:this.$store.state.posts.show_by_category
      }
    },
  },
  methods:{
    ionInfinite(ev){
      console.log('perro')
      this.$store.dispatch('posts/getNextPosts').then(response=>{
        console.log('gato')
        ev.target.complete()
      })
    },
    handleRefresh(event) {
      this.$store.dispatch('posts/getPosts', 6).then(response=>{
        this.$store.dispatch('categories/getCategories').then(response=>{
          this.$store.dispatch('posts/getPostByCategory', {items_per_page:'10', category:''}).then(response=>{
            event.target.complete();
          })
        })
      })
    },
    clicAd(ad){
      fetch('https://gv.unocrm.mx/api/v1/click_ad/' + ad.id).then(response =>{
        window.open(ad.url, '_blank');
      });
    },
    background(category_id){
      if(this.category == category_id){
        return 'background:#4d30f2;'
      }
    },
    selectedCategoryColor(category_id){
      if(this.category == category_id){
        return 'white'
      }else{
        return 'default'
      }
    },
    segmentChanged(category_id) {
      this.category = category_id
      if(category_id=='inicio'){
        this.$store.dispatch('posts/getPostByCategory', {items_per_page:'10', category:''})
      }else{
        this.$store.dispatch('posts/getPostByCategory', {items_per_page:'10', category:category_id})
      }
    },
    dateFormat(date){
        if(date.slice(0, 10) == this.hoy){
          var hora = date.slice(11,16)
          if((hora.slice(0,2)*1)>12){
            return hora.slice(0,2)-12 + hora.slice(2,5) + ' P.M.'
          }else{
            return hora + ' A.M.'
          }
        }else{
          // Creamos el objeto fecha instanciándolo con la clase Date
          const fecha = new Date(date.slice(0,10) + ' 00:00:00');
          // Creamos array con los días de la semana
          const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          //Creamos constante para el dia de hoy
          const hoy = new Date(new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))
          //sacamos diferencia
          const difference = (Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))/(1000*60*60*24)
          // Creamos array con los meses del año
          const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
          // Construimos el formato de salida
          if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
              return fecha.getDate() + ' de ' + meses[fecha.getMonth()]; //dias_semana[fecha.getDay()] + ', ' + 
          }else{
              return fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear(); //dias_semana[fecha.getDay()] + ', ' + 
          }
        }
    },
  },
  created(){
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=Inicio&itemsPerPage=3').then(response=>{
      this.banners_slider = response.data
    })
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=Inicio&itemsPerPage=3').then(response=>{
      this.banners_slider2 = response.data
    })
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