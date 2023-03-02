<template>
  <ion-page>
    <ion-content v-if="news.show" :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
            <ion-slides v-if="banners_slider2!=undefined" pager="false" :options="slideOpts">
              <ion-slide v-for="banner in banners_slider2" :key="banner.id" @click="clicAd(banner)">
                  <ion-img style="margin:30px;" :src="banner.image_url" ></ion-img>
              </ion-slide>
            </ion-slides>

          <div style="margin-top:10px;" v-for="(element, index) in news.data" v-bind:key="index">
            <ion-card style="margin-top:10px;" :router-link="`/detail/${element.slug}`">
              <ion-img class="ion-justify-content-start" :src="element.featured_media_path" ></ion-img>
              <div class="ion-padding">
                <ion-card-title style="font-size: 18px; font-weight: 600; margin-bottom:10px;"  v-html="element.title"></ion-card-title>
                <ion-card-subtitle>{{dateFormat(element.created_at)}}</ion-card-subtitle>
              </div>
            </ion-card>
            
          </div>

          <ion-infinite-scroll v-if="meta.next_link!=undefined" @ionInfinite="ionInfinite($event)">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>

          <ion-slides v-if="banners_slider!=undefined" pager="false" :options="slideOpts">
            <ion-slide v-for="banner in banners_slider" :key="banner.id" @click="clicAd(banner)">
                <ion-img style="margin:30px;" :src="banner.image_url" ></ion-img>
            </ion-slide>
          </ion-slides>

      <!--/div-->
    </ion-content>
  </ion-page>
</template>

<script>
import { IonText, IonRefresher, IonRefresherContent, IonContent, IonHeader, IonSegment, IonChip, IonPage, IonTitle, IonCard, IonCardTitle, IonImg, IonCardSubtitle } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios'

export default defineComponent({
  name: 'Posts',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
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
      meta:{},
      slides:[],
      news:{
        data:[],
        show:false
      },
      banners_slider2:undefined,
      banners_slider:undefined,
      slideOpts: {
        speed: 2000,
        autoplay:true,
      },
    }
  },
  computed:{
    categories(){
      return this.$store.state.categories.categories
    },
  },
  methods:{
    ionInfinite(ev){
      
      axios.get(this.meta.next_link).then(response => {
        this.meta = {
            next_link: response.data.links.next,
            prev_link: response.data.links.prev,
            total: response.data.meta.total,
            current_page: response.data.meta.current_page
          }
        this.news.data = Object.freeze(this.news.data.concat(response.data.data))
        this.news.show = true
        ev.target.complete()
      })
      
    },
    
    handleRefresh(event) {

      var filter = ''
    if(this.$route.params.id!='inicio'){
      filter = '?filter[Categories.id]='+this.$route.params.id
    }
    axios.get('https://gv.unocrm.mx/api/v1/news'+filter).then(response => {
      this.meta = {
          next_link: response.data.links.next,
          prev_link: response.data.links.prev,
          total: response.data.meta.total,
          current_page: response.data.meta.current_page
        }
      this.news.data = Object.freeze(response.data.data)
      this.news.show = true
      event.target.complete();
    })

},
    clicAd(ad){
      fetch('https://gv.unocrm.mx/api/v1/click_ad/' + ad.id).then(response =>{
        window.open(ad.url, '_blank');
      });
    },
    dateFormat(date){
        if(date == this.hoy){
          var hora = date.slice(11,16)
          if((hora.slice(0,2)*1)>12){
            return hora.slice(0,2)-12 + hora.slice(2,5) + ' P.M.'
          }else{
            return hora + ' A.M.'
          }
        }else{
          // Creamos el objeto fecha instanciándolo con la clase Date
          const fecha = new Date(date.slice(0,10));
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
    var filter = ''
    if(this.$route.params.id!='inicio'){
      filter = '?filter[Categories.id]='+this.$route.params.id
    }
    axios.get('https://gv.unocrm.mx/api/v1/news'+filter).then(response => {
      this.meta = {
          next_link: response.data.links.next,
          prev_link: response.data.links.prev,
          total: response.data.meta.total,
          current_page: response.data.meta.current_page
        }
      this.news.data = Object.freeze(response.data.data)
      this.news.show = true
    })
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=Categoría&itemsPerPage=3').then(response=>{
      this.banners_slider = response.data
    })
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=Categoría&itemsPerPage=3').then(response=>{
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