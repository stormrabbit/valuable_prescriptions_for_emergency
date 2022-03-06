<template>
  <div>
    <el-form label-position="left" label-width="80px" :model="prescriptionObj">
      <el-form-item label="药方名称">
        <el-input
          v-model="prescriptionObj.prescriptionName"
          :readonly="!edit"
        ></el-input>
      </el-form-item>
      <el-form-item label="治疗疾病">
        <!-- <el-input v-model="prescriptionObj.disease"></el-input> -->
        <vpfe-input
          v-model="prescriptionObj.disease"
          :editModel="edit"
        ></vpfe-input>
      </el-form-item>
      <el-form-item label="对应症状">
        <!-- <el-input v-model="prescriptionObj.symptom/"></el-input> -->
        <vpfe-input
          v-model="prescriptionObj.symptom"
          :editModel="edit"
        ></vpfe-input>
      </el-form-item>
      <el-form-item label="治疗方式">
        <!-- <el-input v-model="prescriptionObj.treatment"></el-input> -->
        <vpfe-input
          v-model="prescriptionObj.treatment"
          :editModel="edit"
        ></vpfe-input>
      </el-form-item>
      <el-form-item label="详情">
        <el-input
          type="textarea"
          :readonly="!edit"
          :autosize="{ minRows: 7 }"
          v-model="prescriptionObj.detail"
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="medium" @click="toDarhboard">返回</el-button>
      <el-button v-if="edit" type="primary" size="medium" @click="setPrescription">确定</el-button>
    </div>
  </div>
</template>

<script>
import ElForm from "element-ui/lib/form";
import ElFormItem from "element-ui/lib/form-item";
import ElInput from "element-ui/lib/input";
import ElButton from "element-ui/lib/button";
import VpfeInput from "../components/VpfeInput.vue";
import { createPrescription, retrievePrescriptionById, updatePrescriptionById } from "../api";
export default {
  name: "Detailboard",
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    VpfeInput,
  },
  async mounted() {
    const { id, edit } = this.$route.query;
    if (id) {
      this.prescriptionObj = await retrievePrescriptionById(id);
    }
    if (edit) {
      this.edit = Boolean(parseInt(edit));
    }
  },
  data: () => ({
    edit: false,
    prescriptionObj: {
      prescriptionName: "",
      disease: [],
      symptom: [],
      treatment: [],
      detail: "",
    },
  }),
  methods: {
      toDarhboard() {
          this.$router.push({path: '/', query: {
              t: new Date().getTime()
          }})
      },
      async setPrescription() {
           const { id } = this.$route.query;
           const result = !id ? createPrescription(this.prescriptionObj) : updatePrescriptionById(id, this.prescriptionObj);
           console.log(result)
      }
  }
};
</script>

<style>
</style>