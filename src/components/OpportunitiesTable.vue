<template>
  <div class="opportunities-table">
    <div class="row">
      <div class="col-md-12 mb-5">
        <div class="d-flex align-items-center">
          <label class="w-20"> Creation Time </label>
          <VueDatePicker v-model="selectedDate" range multi-calendars :enable-time-picker="false" @cleared="clearDatePicker"/>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-4"> 
        <MultiSelect v-model="selectSource" :options="sourceDropdown" optionLabel="title" placeholder="Select Source" :maxSelectedLabels="2" class="w-full" @change="onFilterChange()"/>
      </div>
      <div class="col-md-4"> 
        <MultiSelect v-model="selectStage" :options="stageDropdown" optionLabel="title" placeholder="Select Stage" :maxSelectedLabels="2" class="w-full" @change="onFilterChange()"/>
      </div>
      <div class="col-md-4"> 
        <div>
          <InputText v-model.number="probabilityValue" class="w-full border-0 m-0 p-0" />
          <Slider v-model="probabilityValue" class="w-full" range @change="onFilterChange()"/>
        </div>
      </div>
    </div>
    <DataTable class="display" width="100%" ref="table" :columns="columns" :data="data" />
  </div>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import record from './../json/data.json'
import moment from 'moment';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { format } from 'date-fns';
import MultiSelect from 'primevue/multiselect';
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext';

DataTable.use(DataTablesCore);

export default {
  name: 'OpportunitiesTable',
  components:{
    DataTable,
    VueDatePicker,
    MultiSelect,Slider, 
    InputText
  },
  props:["isRefresh"],
  data:function(){
    return {
        selectedDate: {
          startDate: null,
          endDate: null
        },
        columns:[{title:'ID'},{title:'Name'},{title:'Source'},{title:'Stage'},{title:'Probability'},{title: 'Creation Time'},{title:'Last Updated'}],
        data:[],
        value: null,
        options: [
          'Batman',
          'Robin',
          'Joker',
        ],
        selectSource:[],
        selectStage:[],
        sourceDropdown: [],
        stageDropdown: [],
        probabilityValue: [0, 100]
    }
  },
  methods:{
    moment: function (date) {
      return moment(date);
    },

    onFilterChange(){
      this.loadData()
      let source = this.selectSource
      let stage = this.selectStage
      let probability = this.probabilityValue
      let dateRange = this.selectedDate

      this.data =  this.data.filter(function(item) {
        let flagStageShow = false;
        let flagProbabilityShow = false;
        let flagSourceShow = false;
        let dateRangeFlag = false;
        
        if(dateRange.length > 0) {
          console.log('new Date(item[5]).getTime()',new Date(item[5]).getTime(),dateRange)
          if(new Date(item[5]).getTime() >= new Date(format(dateRange[0],'yyyy-MM-dd')).getTime() && new Date(item[5]).getTime() <= new Date(dateRange[1]).getTime()){
            dateRangeFlag = true;
          }
        } else { dateRangeFlag = true; }

        if(source.length > 0) {
          if(source.find(o => o.title === item[2])){
            flagSourceShow = true;  
          }
        } else { flagSourceShow= true; }
        
        if(stage.length > 0) {
          if(stage.find(o => o.title === item[3])){
            flagStageShow = true;
          }
        } else { flagStageShow = true }

        if(probability.length > 0) {
          if(probability[0] <= item[4] && probability[1] >= item[4]){
            flagProbabilityShow = true;
          }
        } else { flagProbabilityShow = true; }

        if(dateRangeFlag && flagSourceShow && flagStageShow && flagProbabilityShow){
          return true
        }
            
      });

    },

    loadData(){
      this.data = []
      this.stageDropdown = []
      this.sourceDropdown = []
      let AllStages = [];
      let AllSources = [];
      
      record.forEach(opportunity => {

        let stageName =  opportunity.partner == 'SALESFORCE' ? opportunity?.info?.salesforceOpportunity?.Opportunity.StageName : ''
        let sourceName = opportunity.partner

        if(!AllStages.includes(stageName) && stageName != ''){
          AllStages.push(stageName)
          this.stageDropdown.push({
            title:stageName,
            value:stageName
          });
        }

        if(!AllSources.includes(sourceName) && sourceName != ''){
          AllSources.push(sourceName)
          this.sourceDropdown.push({
            title:sourceName,
            value:sourceName
          });
        }

        this.data.push([
          opportunity.id,
          opportunity.partner == 'SALESFORCE' ? opportunity?.info?.salesforceOpportunity?.Account?.Name ? opportunity.info.salesforceOpportunity.Account.Name : '' : opportunity?.info?.hubspotDeal?.associations?.company_collection__primary?.items && opportunity.info.hubspotDeal.associations.company_collection__primary.items[0].name ?  opportunity.info.hubspotDeal.associations.company_collection__primary.items[0].name : '',
          opportunity.partner,
          opportunity.partner == 'SALESFORCE' ? opportunity?.info?.salesforceOpportunity?.Opportunity.StageName : '',
          opportunity.partner == 'SALESFORCE' ? opportunity?.info?.salesforceOpportunity?.Opportunity.Probability : '',
          opportunity?.creationTime ? moment(opportunity.creationTime).format('YYYY-MM-DD') :'',
          opportunity?.lastUpdateTime ? moment(opportunity.lastUpdateTime).format('YYYY-MM-DD') : '',
        ])
      });
    },

    cleared(){
      this.selectedDate = []
    }
  },
  watch:{
    selectedDate(){
      this.onFilterChange()
    },
    isRefresh(){
      this.selectedDate = [],
      this.selectSource = [],
      this.selectStage=[],
      this.probabilityValue = [0, 100],
      this.loadData()
    },
  },
  created(){
    this.loadData()
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style>
    @import 'datatables.net-dt';
    .w-20{
      width: 150px;
    }
</style>