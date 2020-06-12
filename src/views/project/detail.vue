<template>
  <el-dialog
    width="1300px"
    :title="title"
    :visible="dialogFormVisible"
    :close-on-click-modal="false"
    @close="$emit('update:dialogFormVisible',false)"
  >
    <div class="commonTemp">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基础信息">
          <el-form
            ref="ruleForm0"
            :inline="true"
            :model="dialogForm"
            :rules="rules"
            class="detailForm"
            label-width="140px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目名称" prop="ProjectName">
                  <el-input v-model="dialogForm.ProjectName" placeholder="请输入项目名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="!isAdd" :span="8">
                <el-form-item label="报备数" prop="ReportCount">
                  <el-input v-model="dialogForm.ReportCount" placeholder="请输入报备数"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目驻场人" prop="ResidenterName">
                  <el-input v-model="dialogForm.ResidenterName" placeholder="请输入负责人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目驻场人手机号" prop="residenterMobile">
                  <el-input v-model="dialogForm.residenterMobile" placeholder="请输入负责人电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目负责人" prop="PrincipalerName">
                  <el-input v-model="dialogForm.PrincipalerName" placeholder="请输入负责人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人电话" prop="PrincipalerMobile">
                  <el-input v-model="dialogForm.PrincipalerMobile" placeholder="请输入负责人电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目优惠" prop="Discount">
                  <el-input v-model="dialogForm.Discount" placeholder="请输入项目优惠"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目开发商" prop="Developer">
                  <el-input v-model="dialogForm.Developer" placeholder="请输入项目开发商"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开盘时间" prop="OpeningTime">
                  <el-date-picker
                    v-model="dialogForm.OpeningTime"
                    type="date"
                    placeholder="请选择开盘时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目佣金" prop="Commission">
                  <el-input v-model="dialogForm.Commission" placeholder="请输入佣金"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="特别说明" prop="Remark">
                  <el-input
                    v-model="dialogForm.Remark"
                    type="textarea"
                    style="height:178px"
                    placeholder="请输入特别说明"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目头像" prop="ImgUrl">
                  <el-upload
                    class="avatar-uploader"
                    action
                    :show-file-list="false"
                    :http-request="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="dialogForm.ImgUrl" :src="dialogForm.ImgUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目位置" prop="Gps" class="gpsMap">
                  <el-input v-model="dialogForm.Gps" disabled placeholder="请选择项目位置">
                    <el-button slot="append" type="primary" @click="openGPS">地图</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="文字详情">
          <el-form
            ref="ruleForm1"
            :inline="true"
            :model="dialogForm"
            :rules="rules"
            class="detailForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="文字详情">
                  <editor-bar v-model="dialogForm.Detail" :isClear="isClear" @change="change"></editor-bar>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="联动规则">角色管理</el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button v-if="activeName == '0'" @click="$emit('update:dialogFormVisible', false)">取消</el-button>
      <el-button v-if="activeName !== '0'" type="primary" @click="preFrom">上一页</el-button>
      <el-button v-if="activeName !== '2'" type="primary" @click="nextFrom">下一页</el-button>
      <el-button v-if="activeName == '2'" type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validPhone } from "@/utils/validate";
import EditorBar from "@/components/wangEditor/index.vue";
import { UploadPhysical } from "@/api/project";
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
    dialogData: {
      type: Object,
      default: () => {}
    }
  },
  components: { EditorBar },
  data() {
    var validatePHone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (validPhone(value)) {
            callback(new Error("手机号码错误，请检查"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      isAdd: false,
      rules: {
        ProjectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        ResidenterName: [
          { required: true, message: "请输入项目驻场人", trigger: "blur" }
        ],
        residenterMobile: [
          {
            validator: validatePHone,
            message: "请输入项目驻场人手机号",
            trigger: "blur"
          }
        ],
        PrincipalerName: [
          { required: true, message: "请输入负责人", trigger: "blur" }
        ],
        PrincipalerMobile: [
          {
            validator: validatePHone,
            message: "请输入负责人电话",
            trigger: "blur"
          }
        ],
        Discount: [{ required: true, message: "请输入折扣", trigger: "blur" }],
        Developer: [
          { required: true, message: "请输入开发商", trigger: "blur" }
        ],
        OpeningTime: [
          { required: true, message: "请输入开盘时间", trigger: "change" }
        ],
        ImgUrl: [{ required: true, message: "请上传图片" }],
        Commission: [
          { required: true, message: "请输入佣金", trigger: "blur" }
        ],
        Remark: [
          { required: true, message: "请输入特别说明", trigger: "blur" }
        ],
        LinkAgeRules: [
          { required: true, message: "请输入联动规则", trigger: "blur" }
        ],
        Detail: [
          { required: true, message: "请输入文字详情", trigger: "blur" }
        ],
        Gps: [{ required: true, message: "请选择项目位置" }]
      },
      activeName: "0",
      isClear: false,
      dialogForm: {
        ProjectName: "", // 项目名称
        ReportCount: "", // 报备数
        ResidenterName: "", // 项目驻场人
        residenterMobile: "", // 项目驻场人手机号
        PrincipalerName: "", // 负责人
        PrincipalerMobile: "", // 项目负责人手机号
        ImgUrl: "", // 图片
        Discount: "", // 项目优惠
        Developer: "", // 项目开发商
        OpeningTime: "", // 开盘时间
        Commission: "", // 项目佣金
        Remark: "", // 特别说明
        LinkAgeRules: "", // 联动规则
        Detail: "", // 文字详情(富文本)
        Gps: "" // 地址
      }
    };
  },
  watch: {
    title: {
      handler() {
        this.isAdd = this.title == "新增项目" ? true : false;
      },
      deep: true,
      immediate: true
    },
    dialogData: {
      handler() {
        let handlerData = {};
        handlerData = JSON.parse(JSON.stringify(this.dialogData));
        handlerData.password = "";
        this.dialogForm = Object.assign({}, this.dialogForm, handlerData);
      },
      deep: true,
      immediate: true
    },
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.dialogForm = Object.assign(
          {},
          this.$data.dialogForm,
          this.$options.data().dialogForm
        );
        this.$refs.ruleForm0.clearValidate();
        this.$refs.ruleForm1.clearValidate();
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(134);
          // return this.dialogForm;
        }
      });
    },
    handleAvatarSuccess(files) {
      var formData = new FormData();
      formData.append("files", files.file, files.file.name);

      UploadPhysical(formData).then(res => {
        res.Result.fileNames.forEach(item => {
          this.dialogForm.ImgUrl =
            "http://ccreport.chuanchengfc.com" + item.replace(/\\/g, "/");
        });
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    change(val) {
      console.log(val);
    },
    preFrom() {
      if (Number(this.activeName) !== 0) {
        this.activeName = (Number(this.activeName) - 1).toString();
      }
    },
    nextFrom() {
      if (Number(this.activeName) < 2) {
        this.submitForm("ruleForm" + this.activeName);
        // this.activeName = (Number(this.activeName) + 1).toString();
      }
    },
    openGPS() {
      alert(123);
    }
  }
};
</script>
<style lang="scss" scoped>
.commonTemp {
  /deep/ .el-tabs {
    .el-tabs__header {
      display: none;
    }
  }
  /deep/.el-textarea {
    .el-textarea__inner {
      height: 100%;
    }
  }
  .gpsMap {
    /deep/.is-disabled {
      .el-input__inner {
        // cursor: pointer;
      }
    }
  }
  /deep/.el-input-group__append button.el-button {
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
  }
}
.el-form-item.is-error {
  /deep/ .el-upload {
    border: solid #ff4949 1px;
  }
}
.avatar-uploader {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
