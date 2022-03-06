  <template>
  <div>
    <el-table
      :data="tableData"
      stripe
      :header-row-class-name="headerClassname"
      class="vpfe-table"
      border
      style="width: 100%"
    >
      <template v-for="(item, index) in tableHeaders">
        <el-table-column
          :key="item.prop"
          :columnIndex="index"
          v-bind="item"
        >
          <template v-slot:nestedHeader v-if="item.children">
            <el-table-column
              v-for="(child, childIndex) in item.children"
              :key="child.prop"
              :columnIndex="childIndex"
              v-bind="child"
            >
              <template v-slot="scope">
                <slot v-bind="{ ...scope, props: child }"></slot>
              </template>
            </el-table-column>
          </template>
          <template v-else v-slot="scope">
            <slot v-bind="{ ...scope, props: item }"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import ElTable from "element-ui/lib/table";
import ElTableColumn from "element-ui/lib/table-column";
export default {
  name: "VpfeTable",
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    tableHeaders: {
      required: true,
      type: Array,
    },
    tableData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    headerClassname() {
      return "vpfe-table_header";
    },
  },
};
</script>

<style lang="css">
.vpfe-table_header {
  height: 48px;
  max-height: 48px;
  line-height: 48px;
}
.vpfe-table_header th {
  padding: 0 !important;
}
</style>