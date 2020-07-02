<template>
  <el-dialog
    width="600px"
    :title="title"
    :visible="dialogFormVisible"
    :close-on-click-modal="false"
    @close="$emit('update:dialogFormVisible',false)"
  >
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
          <el-col :span="24">
            <el-form-item label="地区名称" prop="AreaName">
              <el-input v-model="dialogForm.AreaName" placeholder="请输入地区名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button @click="$emit('update:dialogFormVisible', false)">取消</el-button>
      <el-button
        type="primary"
        :loading="sureloading"
        @click="submitForm('ruleForm')"
      >{{ isAdd ?'确定':'修改' }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddArea, EditArea, DeleteArea } from "@/api/project";
export default {
  name: "ProjectDetail",
  props: {
    title: {
      type: String,
      default: ""
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    changData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isAdd: true,
      sureloading: false,
      rules: {
        AreaName: [
          { required: true, message: "请输入地区名称", trigger: "blur" }
        ]
      },
      dialogForm: {
        AreaId: 0,
        AreaName: "" // 姓名
      }
    };
  },
  watch: {
    title: {
      handler() {
        this.isAdd = this.title == "地区新增" ? true : false;
      },
      deep: true,
      immediate: true
    },
    dialogFormVisible() {
      if (this.dialogFormVisible) {
        if (Object.keys(this.changData).length > 0) {
          this.dialogForm = Object.assign({}, this.dialogForm, {
            AreaId: this.changData.value,
            AreaName: this.changData.text
          });
        } else {
          this.restFrom();
        }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.sureloading = false;
          if (this.isAdd) {
            AddArea(this.dialogForm)
              .then(res => {
                this.$message.success("地区添加成功");
                this.$emit("getDataList");
                this.sureloading = false;
                this.$emit("update:dialogFormVisible", false);
              })
              .catch(() => {
                this.sureloading = false;
              });
          } else {
            EditArea(this.dialogForm)
              .then(res => {
                this.$message.success("地区修改成功");
                this.$emit("getDataList");
                this.sureloading = false;
                this.$emit("update:dialogFormVisible", false);
              })
              .catch(() => {
                this.sureloading = false;
              });
          }
        }
      });
    },
    restFrom() {
      this.dialogForm = Object.assign(
        {},
        this.$data.dialogForm,
        this.$options.data().dialogForm
      );
      this.clearValidate();
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
