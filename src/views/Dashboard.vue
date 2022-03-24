<template>
  <div class="vpfe-dashboard">
    <div class="vpfe-dashboard-title">
      <el-form
        ref="searchForm"
        :model="searchObj"
        class="vpfe-dashboard-title_search"
      >
        <el-form-item class="vpfe-dashboard-title_search_item" label="疾病搜索">
          <el-input
            v-model.trim="searchObj.disease"
            clearable
            @clear="handleClear('disease')"
          ></el-input>
        </el-form-item>
        <el-form-item class="vpfe-dashboard-title_search_item" label="症状搜索">
          <el-input
            v-model.trim="searchObj.symptom"
            clearable
            @clear="handleClear('symptom')"
          ></el-input>
        </el-form-item>
        <el-form-item class="vpfe-dashboard-title_search_item" label="药方搜索">
          <el-input
            v-model.trim="searchObj.prescriptionName"
            clearable
            @clear="handleClear('prescriptionName')"
          ></el-input>
        </el-form-item>
        <el-form-item class="vpfe-dashboard-title_search_item" label="方式搜索">
          <el-input
            v-model.trim="searchObj.treatment"
            clearable
            @clear="handleClear('treatment')"
          ></el-input>
        </el-form-item>
        <div class="vpfe-dashboard-title_search_op">
          <el-button type="primary" size="medium" @click="toSearch"
            >查询</el-button
          >
          <el-button type="primary" size="medium" @click="toDetail({}, 1)"
            >新建</el-button
          >
          <el-checkbox v-model="searchObj.favorite"
            >已收藏</el-checkbox
          >
        </div>
      </el-form>
    </div>

    <vpfe-table
      :tableHeaders="tableHeaders"
      :tableData="tableData"
      :total="total"
    >
      <template v-slot="{ row, column }">
        <p v-if="column.property === 'op'">
          <el-button @click="toDetail(row)">查看</el-button>
          <el-button @click="removePrescription(row)">删除</el-button>
          <el-button @click="addToFavorite(row)">收藏</el-button>
        </p>
        <p v-else-if="column.property === 'prescriptionName'">
          <i class="el-icon-star-off"></i>
          <span style="margin-left: 8px">{{ row.prescriptionName }}</span>
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
    <el-pagination
      style="margin-top: 8px"
      background
      layout="prev, pager, next"
      :page-count="total"
      @current-change="handlePageChange"
      @prev-click="handlePageChange"
      @next-click="handlePageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import ElPagination from "element-ui/lib/pagination";
import VpfeTable from "../components/VpfeTable.vue";
import ElButton from "element-ui/lib/button";
import ElInput from "element-ui/lib/input";
import ElForm from "element-ui/lib/form";
import ElFormItem from "element-ui/lib/form-item";
import ElTag from "element-ui/lib/tag";
import ElCheckbox from "element-ui/lib/checkbox";
import { removePrescriptionById, retrievePrescriptions } from "../api/index";
export default {
  components: {
    VpfeTable,
    ElButton,
    ElInput,
    ElForm,
    ElFormItem,
    ElTag,
    ElPagination,
    ElCheckbox,
  },
  mounted() {},
  data: () => ({
    total: 1,
    currentPage: 1,
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
  watch: {
    "$route.query": {
      handler(newQuery) {
        const {
          prescriptionName = "",
          disease = "",
          symptom = "",
          treatment = "",
          page,
        } = newQuery;
        this.searchObj = {
          prescriptionName,
          disease,
          symptom,
          treatment,
        };
        this.currentPage = page || 1;
        this.retrievePrescriptions(this.searchObj);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handlePageChange(page) {
      this.$router.push({
        path: "/",
        query: {
          page,
          pageSize: 10,
          ...this.searchObj,
          t: new Date().getTime(),
        },
      });
    },
    handleClear(propName = "") {
      if (!propName) {
        return;
      }
      const { query = {} } = this.$route;
      const newQuery = Object.assign({}, query, {
        [propName]: "",
        page: 1,
        pageSize: 10,
        t: new Date().getTime(),
      });
      this.$router.push({
        path: "/",
        query: newQuery,
      });
    },
    toSearch() {
      console.log(this.searchObj);
      this.$router.push({
        path: "/",
        query: {
          page: 1,
          pageSize: 10,
          ...this.searchObj,
          t: new Date().getTime(),
        },
      });
    },
    toDetail(row, isEdit = 0) {
      this.$router.push({
        path: "/detailboard",
        query: {
          id: row?._id || "",
          edit: isEdit,
          t: new Date().getTime(),
        },
      });
      console.log(row);
    },
    async removePrescription({ _id: id }) {
      await removePrescriptionById(id);
      this.$router.push({
        path: "/",
        query: {
          t: new Date().getTime(),
        },
      });
    },
    async retrievePrescriptions(query) {
      const { list = [], totalPage = 1 } = await retrievePrescriptions({
        ...query,
        pageSize: 10,
        page: this.currentPage,
      });
      this.tableData = list;
      this.total = totalPage;
    },
  },
  addToFavorite(row) {
    console.log(row);
  },
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(40px, 40px);
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
.vpfe-dashboard-title_search_item .el-form-item__content {
  width: 100%;
}
.vpfe-dashboard-title_search_item_label {
  margin-right: 8px;
}
.vpfe-dashboard-title_search_op {
  display: flex;
  align-items: center;
}

.vpfe-dashboard-title_search_op .el-checkbox {
  margin:0 10px;
  line-height: 0;
  border-radius: 4px;
}
</style>