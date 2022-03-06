<template>
  <div class="vpfe-dashboard">
    <div class="vpfe-dashboard-title">
      <el-form
        ref="searchForm"
        :model="searchObj"
        class="vpfe-dashboard-title_search"
      >
        <el-form-item class="vpfe-dashboard-title_search_item" label="疾病搜索">
          <el-input v-model="searchObj.disease"></el-input>
        </el-form-item>
        <el-form-item class="vpfe-dashboard-title_search_item" label="症状搜索">
          <el-input v-model="searchObj.symptom"></el-input>
        </el-form-item>
        <el-form-item class="vpfe-dashboard-title_search_item" label="药方搜索">
          <el-input v-model="searchObj.prescriptionName"></el-input>
        </el-form-item>
        <el-form-item
          class="vpfe-dashboard-title_search_item"
          label="治疗方式搜索"
        >
          <el-input v-model="searchObj.treatment"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium">查询</el-button>
      <el-button type="primary" size="medium" @click="toDetail({}, 1)">新建</el-button>
    </div>

    <vpfe-table :tableHeaders="tableHeaders" :tableData="tableData">
      <template v-slot="{ row, column }">
        <p v-if="column.property === 'op'">
          <el-button @click="toDetail(row)">查看</el-button>
          <el-button @click="toDetail(row, 1)">编辑</el-button>
           <el-button @click="removePrescription(row)">删除</el-button>
        </p>
        <p v-else-if="Array.isArray(row[column.property])">
          <el-tag
            style="margin: 4px"
            v-for="(tag, i) in row[column.property]"
            :key="i"
          >
            {{ tag }}
          </el-tag>
        </p>

        <p v-else>{{ row[column.property] }}</p>
      </template>
    </vpfe-table>
  </div>
</template>

<script>
import VpfeTable from "../components/VpfeTable.vue";
import ElButton from "element-ui/lib/button";
import ElInput from "element-ui/lib/input";
import ElForm from "element-ui/lib/form";
import ElFormItem from "element-ui/lib/form-item";
import ElTag from "element-ui/lib/tag";
import {removePrescriptionById, retrievePrescriptions} from '../api/index'
export default {
  components: {
    VpfeTable,
    ElButton,
    ElInput,
    ElForm,
    ElFormItem,
    ElTag,
  },
  mounted() {
    this.retrievePrescriptions()  
  },
  data: () => ({
    searchObj: {
      prescriptionName: "",
      disease: "",
      symptom: "",
      treatment: "",
    },
    tableHeaders: [
      { prop: "prescriptionName", label: "处方" },
      { prop: "disease", label: "治疗疾病" },
      { prop: "symptom", label: "对应症状" },
      { prop: "treatment", label: "治疗方式" },
      { prop: "updateAt", label: "修改时间" },
      { prop: "op", label: "操作" },
    ],
    tableData: [],
  }),
  methods: {
    toDetail(row, isEdit = 0) {
      this.$router.push({
        path: '/detailboard',
        query: {
          id:row?._id || '',
          edit: isEdit,
          t: new Date().getTime()
        }
      })
      console.log(row)
    },
    async removePrescription({'_id':id}) {
      await removePrescriptionById(id)
      await this.retrievePrescriptions()
    },
    async retrievePrescriptions() {
       const {
      list=[]
    } = await retrievePrescriptions()
    this.tableData = list;
    console.log(list)
    }
  }
};
</script>

<style>
.vpfe-inner {
  height: 100%;
}
.vpfe-dashboard-title {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
}
.vpfe-dashboard-title_search {
  display: flex;
  flex: 1;
}
.vpfe-dashboard-title_search .el-form-item {
  margin-bottom: 0;
}
.vpfe-dashboard-title_search_item {
  display: flex;
  white-space: nowrap;
  margin-right: 16px;
  flex: 1;
}
.vpfe-dashboard-title_search_item .el-form-item__content{
    width: 100%;
}
.vpfe-dashboard-title_search_item_label {
  margin-right: 8px;
}
</style>