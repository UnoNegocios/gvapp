<template>
  <ion-app :style="background">
    <div id="container" style="height:100vh;" v-if="logo||(!dialog)"><!--  && token==='' -->

      <ion-img style="width: 80%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" src="/isotipo.png" ></ion-img>
      <ion-img style="position: absolute; bottom: 50px; margin: 0px 50px;" src="/title-grey.png" ></ion-img>

    </div>

    <div id="container" v-else-if="dialog">
      <ion-img style="margin:0px;" @click="clicAd(fullscreen_banner)" :src="fullscreen_banner.image" ></ion-img>
    </div>

    <ion-content id="menuContent" v-if="!dialog" style="border-color:#4d30f2; background-color:#4d30f2;"><!-- && token -->
      
        
          
        <ion-page style="border-color:#4d30f2; background-color:#4d30f2;">
          
          <ion-tabs style="border-color:#4d30f2;">
            <ion-header class="ion-no-border" style="border-color:#4d30f2;"> <!-- ion-safe-area-top -->
              <ion-toolbar style="padding-top:0px; border-color:#4d30f2;">
                <ion-row class="header-space" style="background:#4d30f2; border-color:#4d30f2; margin:-4px!important;">
                  <ion-col size="2">
                    <ion-icon style="margin:10px; font-size:25px;" @click="openMenu()" :icon="menu"></ion-icon>
                  </ion-col>
                  <ion-col size="8">
                    <ion-row class="ion-justify-content-center">
                            <ion-col>

                      <ion-img src="/Texto GAMAVISION en Blanco.png" ></ion-img>
                            </ion-col>
                    </ion-row>
                  </ion-col>
                  <ion-col size="2">
                      <ion-icon style="margin:10px; font-size:25px;" @click="showSearch=!showSearch" :icon="search"></ion-icon>
                    
                  </ion-col>
                </ion-row>
                <ion-searchbar class="search-space" v-model="searchInput" @keydown.enter="searchNow()" placeholder="Buscar" v-if="showSearch" ></ion-searchbar>
                <ion-progress-bar v-if="loader" type="indeterminate"></ion-progress-bar>
              </ion-toolbar>
            </ion-header>

            
            
            <ion-router-outlet v-if="showContent"/>

            <ion-tab-bar class="tabar-space" slot="bottom">
              <ion-tab-button tab="home" href="/home" style="background:#4d30f2!important; color:white!important;">
                <ion-icon style="color:white!important;" :icon="newspaper" />
                <ion-label style="color:white!important;">Noticias</ion-label>
              </ion-tab-button>
              
              <ion-tab-button tab="live" href="/lives" style="background:#4d30f2!important; color:white!important;">
                <ion-icon style="color:white!important;" :icon="videocam" />
                <ion-label style="color:white!important;">En Vivo</ion-label>
              </ion-tab-button>
              
              <ion-tab-button tab="podcast" href="/podcast" style="background:#4d30f2!important; color:white!important;">
                <ion-icon style="color:white!important;" :icon="radio" />
                <ion-label style="color:white!important;">Podcast</ion-label>
              </ion-tab-button>
              
            </ion-tab-bar>
          </ion-tabs>
        </ion-page>


    </ion-content>
    
    <ion-menu v-if="!dialog" menu-id="app-menu" type="push" content-id="main-content" contentId="menuContent"><!-- && token -->
      <ion-header style="padding:30px;">
        <!--p style="font-size: 14px; color: #b9b9b9; transform: translateY(-20px);">{{currentDate}} {{time}}</p-->
        <div style="width:100%;"><!-- margin-bottom:20px; -->
          <ion-item v-if="showWeather">
            <!--ion-avatar slot="start">
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
            </ion-avatar>
            <ion-item slot="end"-->
              <ion-avatar>
                <img :src="weatherIcon" />
              </ion-avatar>
              <ion-label>
                <h3>{{weather.main.temp.toFixed(0)}}??C</h3>
              </ion-label>
            <!--/ion-item-->
          </ion-item>
          
        </div>
        <p style="font-size: 14px; color: #b9b9b9; padding-left:20px;">{{currentDate}}<br/> {{time}}</p>
        <!--div>
          <span color="primary" style="font-size:21px; font-weight:600;">
            {{currentUser.name}}
          </span>
          <br>
          <span style="filter:opacity(0.5);">{{currentUser.email}}</span>
        </div-->
      </ion-header>

      <ion-content :scroll-events="true" style="height:calc(100vh - 220px)!important;">
            <ion-list style="height:calc(100vh - 220px)!important; overflow-y: scroll;">
              <ion-item v-for="(category, index) in categories" v-bind:key="index" @click="closeMenu()" :router-link="`/posts/${category.name}`">- {{category.name}}</ion-item>
            </ion-list>
        </ion-content>

      <!--ion-button @click="logout()" style="margin:0px!important; font-weight:600;" expand="full">Cerrar Sesi??n</ion-button-->
    </ion-menu>

    <!--login v-if="!dialog && !token"/-->
  </ion-app>
</template>

<style src='@ionic/core/css/core.css'></style>
<style src='@ionic/core/css/ionic.bundle.css'></style>

<script>
import { menuController, IonTitle, IonMenuToggle, IonList, IonButton, IonMenu, IonAvatar, IonSearchbar, IonApp, IonRouterOutlet, IonHeader, IonIcon, IonToolbar, IonImg, IonRow, IonCol, IonTabButton, IonLabel, IonTabBar, IonTabs, IonPage, IonContent, IonFooter, IonProgressBar, IonItem} from '@ionic/vue';
import { defineComponent } from 'vue';
import Login from "../src/views/Login"
import { search, newspaper, person, menu, radio, videocam, star} from "ionicons/icons"
import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { App } from '@capacitor/app';


export default defineComponent({
  name: 'App',
  components: {
    IonMenuToggle,
    IonTitle,
    IonList,
    IonButton,
    IonItem,
    IonAvatar,
    IonMenu,
    IonImg,
    IonApp,
    IonRouterOutlet,
    login:Login,
    IonHeader,
    IonIcon,
    IonToolbar,
    IonRow,
    IonCol,
    IonTabButton, 
    IonLabel,
    IonTabBar, 
    IonTabs, 
    IonPage, 
    IonContent,
    IonFooter,
    IonSearchbar,
    IonProgressBar,
  },
  data() {
    return { 
      fullscreen_banner:{image:'', url:'', id:''},
      //token: '',
      showSearch: false,
      searchInput:'',
      weatherIcon:'',
      weather:{},
      showWeather:false,
      dialog:true,
      logo:true,
      showContent:true
    };
  },
  setup(){
    var time = ref()
    setInterval(() => {
      var date = new Date()
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      time.value = strTime
    }, 1000)

    

      const router = useRouter();
      App.addListener('appUrlOpen', function (data) {
        // Example url: https://beerswift.app/tabs/tabs2
        // slug = /tabs/tabs2
        const slug = data.url//.split("?")[0];
        // We only push to the route if there is a slug present

      if(slug.includes('https://gamavision.com/noticias/')){
        router.push('/detail/'+slug.slice(32, slug.length));
      }else{

        switch (slug) {
          
          case "https://gamavision.com/":
            router.push('/');
          break;

          case "https://gamavision.com/live":
            router.push('/lives');
            break;

          case "https://gamavision.com/categorias/Local":
            router.push('/posts/Local');
          break;

          case "https://gamavision.com/categorias/Nacional":
            router.push('/posts/Nacional');
          break;

          case "https://gamavision.com/categorias/Negocios":
            router.push('/posts/Negocios');
          break;

          case "https://gamavision.com/categorias/Internacional":
            router.push('/posts/Internacional');
          break;

          case "https://gamavision.com/categorias/Deportes":
            router.push('/posts/Deportes');
          break;

          case "https://gamavision.com/categorias/Espect%C3%A1culos":
            router.push('/posts/Espect%C3%A1culos');
          break;

          case "https://gamavision.com/categorias/Editorial":
            router.push('/posts/Editorial');
          break;

          
          
          default: console.log("URL not found");

        }
      }

    });


    



    return{
      search, newspaper, person, menu, radio, videocam, star, time, router
    }
  },
  watch:{
    /*
    $route (to, from){
      if(from.fullPath == "/login" && to.fullPath == "/home"){
        this.checkLogin()
      }
    }*/
  },
  created(){
    var perro = 'Fullscreen App'
    axios.get('https://gv.unocrm.mx/api/v1/display_ad?filter[is_in_time]=true&filter[is_in_hour]=true&filter[position]=' + perro + '&itemsPerPage=3').then(response=>{
      if(response.data.length>0){
        this.fullscreen_banner.image = response.data[0].image_url
        this.fullscreen_banner.url = response.data[0].url
        this.fullscreen_banner.id = response.data[0].id
      }
    })
    //this.checkLogin()
    this.$store.dispatch('posts/getPosts', 6)
    this.$store.dispatch('categories/getCategories').then(response=>{
      this.$store.dispatch('posts/getPostByCategory', {items_per_page:'10', category:''})
    })
    var lat = 25.67507
    var lon = -100.31847
    var api_key = '76ece60b69182d0a3034049760725d54'
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + api_key + '&lang=sp&units=metric').then(response=>{
      this.weather = response.data
      this.weatherIcon = 'https://openweathermap.org/img/wn/'+response.data.weather[0].icon+'.png'
      this.showWeather = true
    })
  },
  computed:{
    background(){
      if(this.logo||(!this.dialog)){// && this.token===''
        return "background:white;"
      }
    },
    currentDate(){
        // Creamos el objeto fecha instanci??ndolo con la clase Date
        const fecha = new Date()
        // Creamos array con los d??as de la semana
        const dias_semana = ['Domingo', 'Lunes', 'martes', 'Mi??rcoles', 'Jueves', 'Viernes', 'S??bado'];
        // Creamos array con los meses del a??o
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        // Construimos el formato de salida
        if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
            return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()];
        }else{
            return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
        }
        
    },
    /*currentUser(){
      return this.$store.state.currentUser.user
    },*/
    loader(){
      return this.$store.state.search.loader
    },
    categories(){
      return this.$store.state.categories.categories
    }
  },
  mounted () {
    this.callFunction()
  },
  methods: {
    
    clicAd(ad){
      fetch('https://gv.unocrm.mx/api/v1/click_ad/' + ad.id).then(response =>{
        window.open(ad.url, '_blank');
      });
    },
    callFunction: function () {
      var v = this;
      setTimeout(function () {
        v.logo = false;
      }, 3000);
      setTimeout(function () {
        v.dialog = false;
      }, 7000);
    },
    
    /*checkLogin(){
      Preferences.get({ key: 'token' }).then(resp=>{
        axios({
          method: "GET",
          url: "https://gv.unocrm.mx/api/v1/user/current",
          headers: {
            "Authorization": "Bearer " + resp.value,
          },
        }).then(response => {
          this.token = true
          this.$store.dispatch('currentUser/setUserNow', response.data.data)
        }).catch(error => {
          console.log('error')
          this.$store.dispatch('currentUser/logoutUser')
          this.token = false
        });
      }).catch(error => {
        console.log('error')
        this.$store.dispatch('currentUser/logoutUser')
        this.token = false
      });
    },
    logout(){
      this.$store.dispatch('currentUser/logoutUser')
      this.token = false
    },*/
    searchNow(){
      if(this.searchInput!=''&&this.searchInput!=null&&this.searchInput!=undefined){
        console.log(this.searchInput)
        this.$store.dispatch('search/getResults', this.searchInput)
      }
    },
    openMenu() {
      menuController.open('app-menu');
    },
    closeMenu() {
      menuController.close('app-menu');
    },
  }
});
</script>

<style>
body{
  /*margin-top: constant(safe-area-inset-top);
  margin-top: env(safe-area-inset-top);
  margin-bottom: constant(safe-area-inset-bottom, 30px);
  margin-bottom: env(safe-area-inset-bottom, 30px);
  padding-bottom: constant(safe-area-inset-bottom, 30px);
  padding-bottom: env(safe-area-inset-bottom, 30px);*/
  background-color: #4d30f2;
}
html, body {
  width: 100vw;
  height: 100vh;
}
html {
  background-color: #4d30f2;
}
.ios .header-space{
  padding-top:35px;
}
.ios .tabar-space{
  background:#4d30f2;
  padding:5px 0px 25px 5px;
}
.search-space{
  margin-top:4px;
  margin-bottom:0px;
}
.ios .search-space{
  margin-top:10px;
  margin-bottom:-8px;
}
</style>

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

.toolbar-container{
  padding: 0px!important;
}

</style>