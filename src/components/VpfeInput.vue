  <template>
  <div class="vpfe-input">
    <div>
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        :closable="editModel"
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
    </div>

    <div v-if="editModel">
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showInput"
        icon="el-icon-edit"
        plain
        >添加</el-button
      >
    </div>
  </div>
</template>

<script>
import ElTag from "element-ui/lib/tag";
import ElInput from "element-ui/lib/input";
import ElButton from "element-ui/lib/button";
export default {
  components: {
    ElTag,
    ElInput,
    ElButton,
  },
  props: {
    editModel: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  watch: {
    value: {
      handler(newTags) {
           this.dynamicTags = newTags || []; 
      },
      deep: true,
      immediate: true,
    },
    dynamicTags: {
        handler(newTags) {
            this.$emit('input', newTags || [])
        },
        deep: true,
        immediate: true
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>


<style>
.vpfe-input {
  display: flex;
  width: 100%;
  text-align: left;
}
.vpfe-input .input-new-tag {
  width: auto;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px !important;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
