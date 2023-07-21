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
    selectedVfk: [],
    selectedVpr: [],
    allCompetencies: [],
    selectedCompetencies: [],
    levelsList: [],
    specialities: [],
    components: [],
    VBblock: [],
    freeCompSheme: [],
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
    getSelectedVfk: state => state.selectedVfk,
    getSelectedVpr: state => state.selectedVpr,
    getAllCompetencies: state => state.allCompetencies,
    getSelectedCompetencies: state => state.selectedCompetencies,
    getLevels: state => state.levelsList,
    getSpecialities: state => state.specialities,
    getComponents: state => state.components,
    getVBblock: state => state.VBblock,
    getfreeCompSheme: state => state.freeCompSheme,
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
      router.replace('/eduprogs/' + response.id + '/characteristic')
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
          this.components = response.components
          this.creditsInfo = await getData('/eduprogs/credits/' + id)
          console.log('response', response)
        } finally {
          this.loading = false
        }
      }
    },
    async fetchCreditsInfo(id) {
      this.creditsInfo = await getData('/eduprogs/credits/' + id)
    },
    async fetchComponents(id) {
      this.components = await getData('/eduprogs/comps/byEduprogId/' + id)
    },
    async editEduprog(payload) {
      try {
        await editData('eduprogs/' + this.eduProgData.id, payload)
      } catch (error) {
        throw error
      }
    },
    async createComponent(payload) {
      const response = await postData('eduprogs/comps/create', payload)
      console.log('FQLB', response)
      return response
    },
    async editComponent(id, payload) {
      await editData('eduprogs/comps/' + id, payload)
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
      const response = await deleteData('/eduprogs/scheme/delFull/' + id)
    },
    async fetchPossibleRelations(eduId, compId) {
      const response = await getData('/eduprogs/compRelations/posRel/' + eduId + '/' + compId)
      return response
    },
    async fetchAllCompetencies(eduId) {
      const response = await getData('/eduprogs/competencies/byEduprogId/' + eduId)
      this.competencies = response
    },
    async fetchFreeCompSheme(eduId) {
      const response = await getData('/eduprogs/scheme/freeComps/' + eduId)
      this.freeCompSheme = response
    },

    async expandSchemecomp(payload) {
      const respone = await postData('/eduprogs/scheme/expand/'+payload+'?expandTo=RIGHT')
      return respone
    },

    async shrinkSchemecomp(payload) {
      const respone = await  deleteData('/eduprogs/scheme/shrink/'+payload+'?shrinkTo=LEFT')
      return respone
    },
    async updateComponentInScheme(id, payload) {
      const response = await editData('/eduprogs/scheme/' + id, payload)
    },
    async moveComponentInScheme(id, payload) {
      const response = await editData('/eduprogs/scheme/move/' + id, payload)
    },

    async createCompetencyRelation(eduprogId, componentId, competencyId) {
      const newRelation = {
        eduprog_id: eduprogId,
        component_id: componentId,
        competency_id: competencyId,
      }
      const response = await postData('/eduprogs/competenciesMatrix/create', newRelation)
    },
    async createCompetencyResultRelation(eduprogId, componentId, competencyId) {
      const newRelation = {
        eduprog_id: eduprogId,
        component_id: componentId,
        eduprogresult_id: competencyId,
      }
      const response = await postData('/eduprogs/resultsMatrix/create', newRelation)
    },
    async deleteCompetencyRelation(eduprogId, componentId, competencyId) {
      const response = await deleteData('/eduprogs/competenciesMatrix/' + componentId + '/' + competencyId)
    },
    async fetchCompetencyRelations(eduId) {
      const response = await getData('/eduprogs/competenciesMatrix/' + eduId + '?type=ZK')
      this.competencyRelations = response
    },
    async fetchSelectedCompetencies(eduId, type) {
      const response = await getData(`/eduprogs/competencies/byEduprogId/${eduId}/byType?type=${type}`)
      this.selectedCompetencies = response
    },
    async fetchCompetencies(eduId, type) {
      const response = await getData(`/eduprogs/baseCompetencies/${eduId}/byType?type=${type}`)
      this.allCompetencies = response
    },

    async fetchSelectedVfk(eduId) {
      const response = await getData('/eduprogs/competencies/byEduprogId/' + eduId + '/byType?type=VFK')
      this.selectedVfk = response
    },
    async fetchSelectedVpr(eduId) {
      const response = await getData('/eduprogs/competencies/byEduprogId/' + eduId + '/byType?type=VPR')
      this.selectedVpr = response
    },
    async fetchVBblock(eduId) {
      const response = await getData('/eduprogs/comps/getVB/' + eduId)
      this.VBblock = response
    },

    async addCompetencyToEduprog(eduprogId, competencyId) {
      const newRelation = {
        competency_id: competencyId,
        eduprog_id: eduprogId,
        definition: '',
      }
      const response = await postData('/eduprogs/competencies/add', newRelation)
      console.log('response', response)

      return response
    },
    async addAllCompetencies(eduprogId, type) {
      await postData(`/eduprogs/competencies/addAll/${eduprogId}/type?type=${type}`)
    },
    async deleteAllCompetencies(eduprogId, type) {
      await deleteData(`/eduprogs/competencies/delAll/${eduprogId}/type?type=${type}`)
    },
    async deleteCompetencyInEduprog(competencyId) {
      await deleteData('/eduprogs/competencies/' + competencyId)
    },
    async addCustomCompetency(payload) {
      const respone = await postData('/eduprogs/competencies/addCustom', payload)
      return respone
    },
    async copyEduprog(id, payload) {
      const response = await postData('/eduprogs/copy/' + id, payload)

      router.replace('/eduprogs/' + response.id + '/characteristic')
    },
    async editCustomCompetency(id, payload) {
      const newDefinition = {
        definition: payload,
      }
      await editData('/eduprogs/competencies/' + id, newDefinition)
    },
    async exportToExcel(eduId) {
      await getFile('/eduprogs/toExcel/' + eduId).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'ОПП ' + eduId + '.xlsx')
        document.body.appendChild(link)
        link.click()
      })
    },
    async exportToPng(eduId) {
      await getFile('/eduprogs/compsToPng/' + eduId).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'ОПП ' + eduId + '.png')
        document.body.appendChild(link)
        link.click()
      })
    },
    async exportToDocx(eduId) {
      await getFile('/eduprogs/expToWord/edId/' + eduId).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'ОПП ' + eduId + '.docx')
        document.body.appendChild(link)
        link.click()
      })
    },

    async fetchRelations(eduId) {
      const response = await getData('/eduprogs/compRelations/' + eduId)
      return response
    },
    async createRelation(payload) {
      const response = await postData('/eduprogs/compRelations/create', payload)
      return response
    },
    async deleteRelation(baseId, childId) {
      const response = await deleteData('/eduprogs/compRelations/' + baseId + '/' + childId)
      return response
    },
    async fetchLevelsList(eduId) {
      const response = await getData('/eduprogs/levelsList')
      this.levelsList = response
    },
    async fetchSpecialities(eduId) {
      const response = await getData('/eduprogs/specialties/all')
      this.specialities = response
    },
    async updateVbBlockName(eduId, num, name) {
      const payload = {
        block_num: num,
        block_name: name,
      }
      await editData('/eduprogs/comps/updVB/' + eduId, payload)
    },
    async findCompById(compId) {
      const response = await getData('/eduprogs/comps/' + compId)
      return response
    },
    async replaceCompAfter(eduId, putAfterId) {
      console.log('replace')
      await editData(`/eduprogs/comps/replace?edcompId=${eduId}&putAfter=${putAfterId}`)
    },
  },
})
