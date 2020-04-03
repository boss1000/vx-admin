<template>
  <div class="commonTemp">
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="dialogForm"
      :rules="rules"
      class="detailForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="消息标题" prop="messageTitle">
            <el-input v-model="dialogForm.messageTitle" placeholder="请输入消息标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理部门" prop="messageToUserDept">
            <el-select v-model="dialogForm.messageToUserDept" placeholder="请选择管理部门">
              <el-option
                v-for="item in approverList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="消息内容" prop="messageBody">
            <el-input
              v-model="dialogForm.messageBody"
              placeholder="请输入消息内容"
              class="contentBox"
              type="textarea"
            ></el-input>
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
    approverList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogForm: {
        messageTitle: "",
        messageToUserId: "",
        messageBody: ""
      },
      rules: {
        messageTitle: [
          { required: true, message: "请输入消息标题", trigger: "blur" }
        ],
        messageToUserDept: [
          { required: true, message: "请选择管理部门", trigger: "change" }
        ],
        messageBody: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogFormVisible: {
      handler() {
        this.dialogForm = Object.assign({}, this.$data.dialogForm, this.$options.data().dialogForm);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submitForm() {
      let state = "";
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          state = true;
        } else {
          state = false;
        }
      });
      return state;
    }
  }
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
