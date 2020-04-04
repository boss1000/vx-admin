<template>
  <div class="commonTemp">
    <el-form :inline="true" class="detailForm" :model="dialogForm" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="留言">
            <el-input v-model="dialogForm.message" class="contentBox" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "NoticeDetail",
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogForm: {
        message: ""
      }
    };
  },
  watch: {
    dialogFormVisible: {
      handler() {
        this.dialogForm.message = ""
      },
      deep: true
    }
  },
  methods: {}
};
</script>
<style lang="scss" scope>
.contentBox {
  height: 150px;
  max-height: 150px;
  textarea {
    height: 100%;
  }
}
</style>
