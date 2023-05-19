<template>
   <div class="app">
      <div class="container mt-3">
        <div class="row mb-3"> 
          <div class="col-md-12 pt-2 d-flex justify-content-between">
            <h3>CRM Opportunities</h3>
            <div class="cursor-pointer">
              <img src="./assets/undo_icon.png" height="30" width="30" title="reload" @click="refreshData"/>
            </div>
          </div>
        </div>
        <opportunities-table :isRefresh="isRefresh" />
      </div>
     
   </div>
</template>

<script>
import OpportunitiesTable from './components/OpportunitiesTable.vue'

export default {
  name: 'App',
  components: {
    'opportunities-table':OpportunitiesTable
  },
  data:function(){
    return {
      isRefresh:true
    }
  },
  methods:{
    refreshData()
    {
      this.isRefresh = false;
      this.$nextTick(()=>{
        this.isRefresh =true
      })
    }
  }
}
</script>

<style scoped>
  img{
    cursor: pointer;
  }
</style>