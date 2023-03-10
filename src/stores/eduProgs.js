import { deleteData, editData, getData, getFile, postData } from '@/api/http/apiService'
import { defineStore } from 'pinia'
import router from '../router'
export const useEduProgsStore = defineStore({
  id: 'eduProgs',

  state: () => ({
    eduProgs: [],
    loading: false,
    eduProgData: {},
    creditsInfo: {},
    scheme: [],
    disciplines: [],
    competencies: [],
    competencyRelations: [],
  }),

  getters: {
    getEduProgs: state => state.eduProgs,
    isLoading: state => state.loading,
    getEduProg: state => state.eduProgData,
    getCreditsInfo: state => state.creditsInfo,
    getScheme: state => state.scheme,
    getDisciplines: state => state.disciplines,
    getCompetencies: state => state.competencies,
    getCompetencyRelations: state => state.competencyRelations,
    getCompetencyAllRelations: state => state.competencyAllRelations,
    getCompetencyFkAllRelations: state => state.competencyFkAllRelations,
  },

  actions: {
    async fetchEduProgs() {
      const response = await getData('eduprogs')
      this.eduProgs = response.items
    },
    async deleteEduProg(payload) {
      await deleteData('/eduprogs/' + payload)
      this.fetchEduProgs
    },
    async createEduProg(payload) {
      const response = await postData('/eduprogs/create', payload)
      this.fetchEduProgs
      router.replace('/eduprogs/' + response.id)
    },
    async editNameEduProg(payload, id) {
      await editData('/eduprogs/' + id, payload)
      this.fetchEduProgs
    },
    async fetchScheme(id) {
      this.scheme = await getData('/eduprogs/scheme/byEduprogId/' + id)
    },
    async findEduProgById(id) {
      if (!this.loading) {
        try {
          this.loading = true
          const response = await getData('eduprogs/' + id)
          this.eduProgData = response
          this.creditsInfo = await getData('/eduprogs/credits/' + id)
        } finally {
          this.loading = false
        }
      }
    },
    async fetchCreditsInfo(id) {
      this.creditsInfo = await getData('/eduprogs/credits/' + id)
    },
    async editEduprog(payload) {
      await editData('eduprogs/' + this.eduProgData.id, payload)
    },
    async createComponent(payload) {
      const response = await postData('eduprogs/comps/create', payload)
      return response.id
    },
    async editComponent(id, payload) {
      await editData('eduprogs/comps/' + id, payload)
      const response = await getData('eduprogs/credits/' + payload.eduprog_id)
      this.creditsInfo = response
    },
    async deleteComponent(payload) {
      await deleteData('eduprogs/comps/' + payload.id)
    },
    async setComponentToScheme(payload) {
      const response = await postData('/eduprogs/scheme/setCompToSemester', payload)
    },
    async createDiscipline(payload) {
      const response = await postData('/eduprogs/scheme/disciplines/create', payload)
    },
    async fetchDisciplines(id) {
      const response = await getData('/eduprogs/scheme/disciplines/getByEdId/' + id)
      this.disciplines = response
    },
    async deleteDiscipline(id) {
      const response = await deleteData('/eduprogs/scheme/disciplines/' + id)
    },
    async editDiscipline(discipline) {
      const editedDiscipline = {
        name: discipline.name,
        eduprog_id: discipline.eduprog_id,
      }
      await editData('/eduprogs/scheme/disciplines/' + discipline.id, editedDiscipline)
    },
    async deleteComponentFromSheme(id) {
      const response = await deleteData('/eduprogs/scheme/' + id)
    },
    async fetchPossibleRelations(eduId, compId) {
      const response = await getData('/eduprogs/compRelations/posRel/' + eduId + '/' + compId)
      return response
    },
    async fetchCompetencies(eduId) {
      const response = await getData('/eduprogs/competencies/byEduprogId/' + eduId)
      this.competencies = response
    },
    async createCompetencyRelation(eduprogId, componentId, competencyId) {
      const newRelation = {
        eduprog_id: eduprogId,
        component_id: componentId,
        competency_id: competencyId,
      }
      const response = await postData('/eduprogs/competenciesMatrix/create', newRelation)
    },
    async deleteCompetencyRelation(eduprogId, componentId, competencyId) {
      const response = await deleteData('/eduprogs/competenciesMatrix/' + componentId + '/' + competencyId)
    },
    async fetchCompetencyRelations(eduId) {
      const response = await getData('/eduprogs/competenciesMatrix/'+eduId+'?type=ZK')
      this.competencyRelations = response
    },
    async fetchCompetencyAllRelations(eduId) {
      const response = await getData('/eduprogs/baseCompetencies/ZK_list')
      this.competencyAllRelations = response
    },
    async fetchCompetencyFkAllRelations(eduId) {
      const response = await getData('/eduprogs/baseCompetencies/FK_list')
      this.competencyFkAllRelations = response
    },
    async addCompetencyToEduprog(eduprogId, competencyId) {
      const newRelation = {
        competency_id:competencyId,
        eduprog_id: eduprogId,
        redefinition:"",
      }
      const response = await postData('/eduprogs/competencies/add', newRelation)
      console.log('response',response)

      return response
    },
    async deleteCompetencyInEduprog(competencyId) {
      await deleteData('/eduprogs/competencies/' + competencyId)
    },
    async exportToExcel(eduId) {
      await getFile('/eduprogs/toExcel/'+eduId).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '?????? '+eduId+'.xlsx');
        document.body.appendChild(link);
        link.click();
      })},
    async fetchRelations(eduId){
      const response = await getData('/eduprogs/compRelations/'+eduId);
      return response
    },
    async createRelation(payload){
      const response = await postData('/eduprogs/compRelations/create', payload);
      return response
    },
    async deleteRelation(baseId, childId){
      const response = await deleteData('/eduprogs/compRelations/'+baseId+'/'+childId);
      return response
    },
  },
})
