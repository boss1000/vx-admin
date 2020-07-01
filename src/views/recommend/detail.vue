<template>
  <el-dialog
    width="800px"
    title="推荐人新增"
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
          <el-col :span="12">
            <el-form-item label="推荐人">
              <el-select
                v-model="dialogForm.Id"
                placeholder="请选择推荐人"
                multiple
                filterable
                clearable
                collapse-tags
              >
                <el-option
                  v-for="item in accountSelectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button @click="$emit('update:dialogFormVisible', false)">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">{{ isAdd ?'确定':'修改' }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { GetAccountList, ModifyAccount } from "@/api/account";
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
    }
  },
  data() {
    return {
      isAdd: true,
      rules: {
        StatusEnum: [
          { required: true, message: "请选择账号状态", trigger: "change" }
        ]
      },
      dialogForm: {
        Id: []
      },
      accountList: [],
      accountSelectList: []
    };
  },
  watch: {
    dialogFormVisible() {
      if (this.dialogFormVisible) {
        this.getAccountList();
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let results = await Promise.all(
            this.dialogForm.Id.map(async item => {
              this.accountList.map(async data => {
                if (item == data.Id) {
                  let setData = Object.assign({}, data, { isReferrer: true });
                  return await ModifyAccount(setData);
                }
              });
            })
          );
          await this.changeAccount();
        }
      });
    },
    changeAccount() {
      this.$message.success("推荐人新增成功");
      this.$emit("getDataList");
      this.$emit("update:dialogFormVisible", false);
    },
    getAccountList() {
      GetAccountList({
        UserName: "",
        Mobile: "",
        Store: "",
        Status: "",
        AccountType: "",
        IsReferrer: false
      }).then(res => {
        this.accountList = res.Result;
        this.accountSelectList = res.Result.map(item => {
          return {
            value: item.Id,
            label: item.UserName
          };
        });
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
