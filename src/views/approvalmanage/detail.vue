<template>
  <div class="commonTemp">
    <el-form :inline="true" class="detailForm" :model="dialogForm" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="消息标题">
            <el-input v-model="dialogForm.messageTitle" placeholder="请输入消息标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接受者学号">
            <el-input v-model="dialogForm.messageToUserId" placeholder="请输入接受者学号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="消息内容">
            <el-input v-model="dialogForm.messageBody" class="contentBox" type="textarea"></el-input>
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
    },
    jurisdictionList: {
      type: Array,
      default: () => []
    },
    dialogData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogForm: {
        messageTitle: "",
        messageToUserId: "",
        messageBody: ""
      }
    };
  },
  watch: {
    dialogData: {
      handler() {
        let handlerData = {};
        handlerData = JSON.parse(JSON.stringify(this.dialogData));
        handlerData.password = "";
        this.dialogForm = Object.assign({}, this.dialogForm, handlerData);
      },
      deep: true,
      immediate: true
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
