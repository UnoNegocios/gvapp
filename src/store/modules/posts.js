
import axios from "axios";
const state = {
    posts_by_category:[],
    posts:[],
    show_by_category:false,
    show:false,
    next_page:''
};
const getters = {};

const actions = {
    getPostByCategory( {commit, state}, props ){
        this.show_by_category = false
        var items_per_page = props.items_per_page
        var category = ''
        if(props.category!=''){
            category = '&filter[Categories.id]=' + props.category
        }

        return new Promise((resolve, reject) => {
            axios.get('https://gv.unocrm.mx/api/v1/news?itemsPerPage=' + items_per_page + category).then(response => {
                commit('setPostByCategory', response.data.data);
                state.next_page = response.data.links.next.replace('%5B', '[').replace('%5D', ']')
                console.log(state.next_page)
                state.show_by_category = true;
            }).finally(() => (resolve(false)))
        })
    },
    getPosts( {commit, state}, items_per_page ){
        return new Promise((resolve, reject) => {
            axios.get('https://gv.unocrm.mx/api/v1/news?itemsPerPage='+items_per_page).then(response => {
                commit('setPosts', response.data.data);
                state.next_page = response.data.links.next.replace('%5B', '[').replace('%5D', ']')
                state.show = true;
            }).finally(() => (resolve(false)))
        })
    },
    getNextPosts( {commit, state} ){
        return new Promise((resolve, reject) => {
            axios.get(state.next_page).then(response => {
                commit('setMorePostByCategory', response.data.data);
                state.next_page = response.data.links.next.replace('%5B', '[').replace('%5D', ']')
                state.show_by_category = true;
            }).finally(() => (resolve(false)))
        })
    },
};

const mutations = {
    setPostByCategory(state, data){
        state.posts_by_category = data;
    },
    setMorePostByCategory(state, data){
        state.posts_by_category = state.posts_by_category.concat(data);
    },
    setPosts(state, data){
        state.posts = data;
    },
    setShow(){
        state.show = true;
    },
    setShowByCategory(){
        state.show_by_category = true;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}