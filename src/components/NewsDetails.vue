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
        {{getNew()}}
        
        <div v-if="content!=null" style="margin-top:30px!important; padding:0px 30px;">
            <ion-card-title style="font-size:25px; margin-bottom:10px;">{{content.title}}</ion-card-title>
            <ion-row>
              <ion-col size="10">
                <ion-card-subtitle style="margin-bottom:20px;">{{dateFormat(content.created_at)}}</ion-card-subtitle>
              </ion-col>
              <ion-col size="2">
                <ion-button @click="compartir()" class="ion-justify-content-end" style="margin-top:-20px;" >
                  <ion-icon :icon="shareSocial" ></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
            <ion-img class="ion-justify-content-start" :src="content.featured_media_path" ></ion-img>
            <div v-html="htmlContent"></div>
        </div>
        <ion-slides v-if="banners_slider!=undefined" pager="false" :options="slideOpts">
          <ion-slide v-for="banner in banners_slider" :key="banner.id" @click="clicAd(banner)">
              <ion-img style="margin:30px;" :src="banner.image_url" ></ion-img>
          </ion-slide>
        </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonText, IonRefresher, IonRefresherContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSlides, IonSlide, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonImg, IonRow, IonCol, IonIcon, IonButtons } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios'
import { arrowBack, shareSocial } from "ionicons/icons"
import { Share } from '@capacitor/share';

export default defineComponent({
  name: 'Live',
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
    IonCardSubtitle,
    IonRow,
    IonCol,
    IonIcon, 
    IonButtons,
    IonRefresher,
IonRefresherContent
  },
  setup(){
    return{
      arrowBack, shareSocial
    }
  },
  data(){
    return{
      banners_slider:undefined,
      slideOpts: {
        speed: 2000,
        autoplay:true,
      },
        content:null,
        pause: false
    }
  },
  computed:{
    htmlContent(){
        return '<div class="content-style">' + this.content.content + '</div><style>.wp-video-shortcode{width:calc(100vw - 60px)!important; height:auto!important;} .content-style div :first-child{font-size:14px;} .content-style h4{font-size: 18px;text-align: justify; } .content-style span{ color:white!important; } .content-style em{ color:white!important; } h4{ color:white!important; }</style>'
    }
  },
  created(){
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=Detalle de Noticia&itemsPerPage=3').then(response=>{
      this.banners_slider = response.data
    })
  },
  methods:{
    handleRefresh(event) {
      axios.get('https://gv.unocrm.mx/api/v1/news?filter[slug]=' + this.$route.params.slug).then(response => {
          this.content = Object.freeze(response.data.data[0])
          event.target.complete();
      })
    },
    clicAd(ad){
      fetch('https://gv.unocrm.mx/api/v1/click_ad/' + ad.id).then(response =>{
        window.open(ad.url, '_blank');
      });
    },
    compartir(){
      Share.share({
        title: this.content.title,
        text: this.content.short_description,
        url: 'https://gamavision.com/noticias/' + this.content.slug,
        dialogTitle: 'Compartir Noticia',
      });
    },
    getNew(){
        if(!this.pause){
            axios.get('https://gv.unocrm.mx/api/v1/news?filter[slug]=' + this.$route.params.slug).then(response => {
                this.content = Object.freeze(response.data.data[0])
            })
        }this.pause = true
    },
    dateFormat(date){
        // Creamos el objeto fecha instanci??ndolo con la clase Date
        const fecha = new Date(date.slice(0,10) + ' 00:00:00');
        // Creamos array con los d??as de la semana
        const dias_semana = ['Domingo', 'Lunes', 'martes', 'Mi??rcoles', 'Jueves', 'Viernes', 'S??bado'];
        //Creamos constante para el dia de hoy
        const hoy = new Date(new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))
        //sacamos diferencia
        const difference = (Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))/(1000*60*60*24)
        // Creamos array con los meses del a??o
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        // Construimos el formato de salida
        if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
            return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()];
        }else{
            return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
        }
        
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
span {
    color: white!important;
}

</style>