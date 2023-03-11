import axios from "axios";
import router from '../../router';

const state = {
  result: {},
  loader: false,
  filter:'',
  meta:{}
};
const getters = {};
const actions = {
  getResults({commit, state}, filter) {
    console.log(filter)
    commit("setFilter", filter)
    commit("setLoader", true)
    axios.get('https://gv.unocrm.mx/api/v1/news?filter[title_or_tag]='+filter).then(response => {
      commit("setResult", response.data.data)
      router.push('/search')
      commit("setLoader", false)
      commit("setMeta", {
        next_link: response.data.links.next,
        prev_link: response.data.links.prev,
        total: response.data.meta.total,
        current_page: response.data.meta.current_page
      })
    }).catch(error=>{
      commit("setResult", error)
        router.push('/search')
        commit("setLoader", false)
    })
  },
  refreshResults({commit}){
    return new Promise((resolve, reject) => {
      axios.get('https://gv.unocrm.mx/api/v1/news?filter[title_or_tag]='+state.filter).then(response => {
        commit("setResult", response.data.data)
        commit("setMeta", {
          next_link: response.data.links.next,
          prev_link: response.data.links.prev,
          total: response.data.meta.total,
          current_page: response.data.meta.current_page
        })
        resolve(false)
      }).catch(error=>{
        commit("setResult", error)
      })
    })
  },
  moreResults({commit}){
    return new Promise((resolve, reject) => {
      axios.get(state.meta.next_link).then(response => {
        commit("setMoreResults", response.data.data)
        commit("setMeta", {
          next_link: response.data.links.next,
          prev_link: response.data.links.prev,
          total: response.data.meta.total,
          current_page: response.data.meta.current_page
        })
        resolve(false)
      }).catch(error=>{
        commit("setMoreResults", error)
      })
    })
  },
};
const mutations = {
  setResult(state, data) {
    state.result = data;
  },
  setLoader(state, data) {
    state.loader = data;
  },
  setFilter(state, data) {
    state.filter = data;
  },
  setMeta(state, data) {
    state.meta = data;
  },
  setMoreResults(state, data) {
    var perro = JSON.parse(JSON.stringify(state.result)).concat(data);
    state.result = perro;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
