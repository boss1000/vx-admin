<template>
  <el-dialog
    width="800px"
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
          <el-col :span="12">
            <el-form-item label="姓名" prop="UserName">
              <el-input v-model="dialogForm.UserName" :disabled="!isAdd" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="Mobile">
              <el-input v-model="dialogForm.Mobile" :disabled="!isAdd" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店" prop="StoreName">
              <el-input v-model="dialogForm.StoreName" placeholder="请选择门店"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="IdCard">
              <el-input v-model="dialogForm.IdCard" placeholder="请输入身份证号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体系" prop="Company">
              <el-select v-model="dialogForm.companyId" placeholder="请选择体系" filterable clearable>
                <el-option
                  v-for="item in groupList.Company"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责项目">
              <el-select
                v-model="dialogForm.ResponsibleProjects"
                placeholder="请选择负责项目"
                multiple
                filterable
                clearable
                collapse-tags
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号类型" prop="TypeEnum">
              <el-select v-model="dialogForm.TypeEnum" placeholder="请选择账号类型" clearable>
                <el-option
                  v-for="item in groupList.TypeEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号状态" prop="StatusEnum">
              <el-select v-model="dialogForm.StatusEnum" placeholder="请选择账号类型" clearable>
                <el-option
                  v-for="item in groupList.StatusEnum"
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
import { validPhone, IdCardValidate } from "@/utils/validate";
import { AddAccount, ModifyAccount } from "@/api/account";
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
    areaList: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    projectList: {
      type: Array,
      default: () => []
    },
    changData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var validatePHone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      }
      if (!validPhone(value)) {
        callback(new Error("手机号码错误，请检查"));
      } else {
        callback();
      }
    };
    var validateIDcard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入身份证号码"));
      }
      if (!IdCardValidate(value)) {
        callback(new Error("身份证号码错误，请检查"));
      } else {
        callback();
      }
    };
    return {
      isAdd: true,
      rules: {
        UserName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        Mobile: [
          {
            required: true,
            validator: validatePHone,
            trigger: "blur"
          }
        ],
        StoreName: [{ required: true, message: "请选择门店", trigger: "blur" }],
        IdCard: [
          {
            required: true,
            validator: validateIDcard,
            trigger: "blur"
          }
        ],
        // Company: [
        //   {
        //     required: true,
        //     message: "请选择体系",
        //     trigger: "change"
        //   }
        // ],
        TypeEnum: [
          { required: true, message: "请选择账号类型", trigger: "change" }
        ],
        StatusEnum: [
          { required: true, message: "请选择账号状态", trigger: "change" }
        ]
      },
      dialogForm: {
        Id: 0,
        Mobile: "", // 手机号（账号）
        UserName: "", // 姓名
        StoreName: "", // 门店
        IdCard: "", // 身份证号码
        CompanyId: 0, // 体系Id
        Company: "", // 体系
        TypeEnum: "", // 账号类型
        StatusEnum: "", // 账号状态
        ResponsibleProjects: [] // 负责项目
      },
      groupList: {
        Company: [],
        TypeEnum: [
          {
            value: 1,
            label: "公司账号"
          },
          {
            value: 2,
            label: "项目驻场账号"
          },
          {
            value: 3,
            label: "中介用户账号"
          }
        ],
        StatusEnum: [
          { label: "全部", value: null },
          { label: "启用", value: 1 },
          { label: "停用", value: 2 },
          { label: "异常", value: 3 }
        ]
      }
    };
  },
  watch: {
    title: {
      handler() {
        this.isAdd = this.title == "账号新增" ? true : false;
      },
      deep: true,
      immediate: true
    },
    tableData: {
      handler() {
        this.groupList.Company = this.tableData
          .map(item => {
            if (item.TypeId == 1) {
              return {
                value: item.Id,
                label: item.UserName
              };
            }
          })
          .filter(item => item);
      }
    },
    dialogFormVisible() {
      if (this.dialogFormVisible) {
        if (Object.keys(this.changData).length > 0) {
          this.dialogForm = Object.assign({}, this.dialogForm, this.changData, {
            TypeEnum: this.changData.TypeId,
            StatusEnum: this.changData.Status
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
          if (this.isAdd) {
            AddAccount(this.dialogForm).then(res => {
              this.$message.success("账号添加成功");
              this.$emit("getDataList");
              this.$emit("update:dialogFormVisible", false);
            });
          } else {
            let setData = Object.assign({}, this.dialogForm, {
              TypeEnum: this.dialogForm.TypeId,
              StatusEnum: this.dialogForm.StatusEnum
            });
            ModifyAccount(setData).then(res => {
              this.$message.success("账号修改成功");
              this.$emit("getDataList");
              this.$emit("update:dialogFormVisible", false);
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
