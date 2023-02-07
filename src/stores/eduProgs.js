import { deleteData, editData, getData, postData } from '@/api/http/apiService';
import { defineStore } from 'pinia';
import router from '../router';
export const useEduProgsStore = defineStore({
  id: 'eduProgs',

  state: () => ({
    eduProgs:[],
    loading: false,
    eduProgData: {},
    creditsInfo: {},
    scheme:[]
  }),

  getters: {
    getEduProgs: state => state.eduProgs,
    isLoading: state => state.loading,
    getEduProg: state => state.eduProgData,
    getCreditsInfo: state => state.creditsInfo,
    getScheme: state => state.scheme,
  },

  actions: {
    async fetchEduProgs(){
        const response = await getData('eduprogs');
        this.eduProgs = response.items;
    },
    async deleteEduProg(payload){
        await deleteData('/eduprogs/'+payload);
        this.fetchEduProgs
    },
    async createEduProg(payload){
      const response = await postData('/eduprogs/create', payload);
      this.fetchEduProgs
      router.replace('/eduprogs/'+response.id)
    },
    async editNameEduProg(payload, id){
    await editData('/eduprogs/'+ id, payload);
    this.fetchEduProgs
    },
    async fetchScheme(id){
      this.scheme = await getData('/eduprogs/scheme/byEduprogId/'+id);
      console.log(this.scheme)
  },
  async findEduProgById(id){
    if (!this.loading) {
      try {
        this.loading = true;
        const response = await getData('eduprogs/'+id);
        this.eduProgData = response;
        this.creditsInfo = await getData('/eduprogs/credits/'+id)
      }finally {
        this.loading = false;
      }
    }
},
  async editEduprog(payload){
    await editData('eduprogs/'+this.eduProgData.id, payload);
  },
  async createComponent(payload){
    console.log(payload)
    const response = await postData('eduprogs/comps/create', payload);
  },
  async editComponent(id, payload){
    await editData('eduprogs/comps/'+id, payload);
    const response = await getData('eduprogs/credits/'+payload.eduprog_id);
    this.creditsInfo = response
  },
  async deleteComponent(id){
    const response = await deleteData('eduprogs/comps/'+id);
  },
  },
})
