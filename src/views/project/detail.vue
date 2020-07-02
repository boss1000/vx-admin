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
                <el-form-item label="地区" prop="Area">
                  <el-select v-model="dialogForm.Area" placeholder="请选择地区" clearable>
                    <el-option
                      v-for="item in areaList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报备手机号显示" prop="ReportMobileTypeEnum">
                  <el-select
                    v-model="dialogForm.ReportMobileTypeEnum"
                    placeholder="请选择报备手机号显示"
                    clearable
                  >
                    <el-option
                      v-for="item in ReportMobileTypeEnumList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目驻场人" prop="ResidenterId">
                  <!-- <el-input v-model="dialogForm.ResidenterName" placeholder="请输入负责人"></el-input> -->
                  <el-select
                    v-model="dialogForm.ResidenterId"
                    placeholder="请选择负责人"
                    clearable
                    @change="changeMobile('ResidenterMobile',$event)"
                  >
                    <el-option
                      v-for="item in groupList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目驻场人手机号" prop="ResidenterMobile">
                  <el-input v-model="dialogForm.ResidenterMobile" placeholder="请输入负责人电话" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目负责人" prop="PrincipalerId">
                  <!-- <el-input v-model="dialogForm.PrincipalerName" placeholder="请输入负责人"></el-input> -->
                  <el-select
                    v-model="dialogForm.PrincipalerId"
                    placeholder="请选择项目负责人"
                    clearable
                    @change="changeMobile('PrincipalerMobile',$event)"
                  >
                    <el-option
                      v-for="item in groupList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人电话" prop="PrincipalerMobile">
                  <el-input v-model="dialogForm.PrincipalerMobile" placeholder="请输入负责人电话" disabled></el-input>
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
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择开盘时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目佣金" prop="Commission">
                  <el-input v-model="dialogForm.Commission" placeholder="请输入佣金"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="需要身份证">
                  <el-select v-model="dialogForm.IsEnableIdCard" placeholder="请选择是否需要身份证" clearable>
                    <el-option
                      v-for="item in hasIDcard"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="项目位置" prop="Address" class="gpsMap">
                  <el-input v-model="dialogForm.Address" disabled placeholder="请选择项目位置">
                    <el-button slot="append" type="primary" @click="openGPS">地图</el-button>
                  </el-input>
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
                <el-form-item label="文字详情" prop="Detail">
                  <editor-bar v-model="DetailAchae" :isClear="isClear" @change="changeDetail"></editor-bar>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="联动规则">
          <el-form
            ref="ruleForm2"
            :inline="true"
            :model="dialogForm"
            :rules="rules"
            class="detailForm"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24" prop>
                <el-form-item label="联动规则" prop="LinkAgeRules">
                  <el-input
                    v-model="dialogForm.LinkAgeRules"
                    type="textarea"
                    style="height:178px"
                    placeholder="请输入联动规则"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:center">
      <el-button @click="$emit('update:dialogFormVisible', false)">取消</el-button>
      <el-button v-if="activeName !== '0'" type="primary" @click="preFrom">上一页</el-button>
      <el-button v-if="activeName !== '2'" type="primary" @click="nextFrom">下一页</el-button>
      <el-button
        v-if="activeName == '2'"
        :loading="sureloading"
        type="primary"
        @click="nextFrom"
      >{{ isAdd ?'确定':'修改' }}</el-button>
    </div>
    <MapDialog :showMap.sync="showMap" :gpsForm="GpsForm" @getMap="getMap"></MapDialog>
  </el-dialog>
</template>
<script>
import { validPhone } from "@/utils/validate";
import EditorBar from "@/components/wangEditor/index.vue";
import MapDialog from "@/components/MapDialog/Map";
import {
  UploadPhysical,
  AddProject,
  getEditProject,
  updateEditProject
} from "@/api/project";
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
    dialogId: {
      type: Number,
      default: 0
    },
    accountList: {
      type: Array,
      default: () => []
    }
  },
  components: { EditorBar, MapDialog },
  data() {
    var validatePHone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入项目驻场人手机号"));
      }
      if (!validPhone(value)) {
        callback(new Error("手机号码错误，请检查"));
      } else {
        callback();
      }
    };
    return {
      isAdd: false,
      sureloading: false,
      rules: {
        ProjectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        Area: [{ required: true, message: "请选择地区", trigger: "change" }],
        ReportMobileTypeEnum: [
          {
            required: true,
            message: "请选择报备手机号显示方式",
            trigger: "change"
          }
        ],
        // ResidenterName: [
        //   { required: true, message: "请输入项目驻场人", trigger: "blur" }
        // ],
        // ResidenterMobile: [
        //   {
        //     required: true,
        //     validator: validatePHone,
        //     trigger: "blur"
        //   }
        // ],
        // PrincipalerName: [
        //   { required: true, message: "请输入负责人", trigger: "blur" }
        // ],
        // PrincipalerMobile: [
        //   {
        //     required: true,
        //     validator: validatePHone,
        //     trigger: "blur"
        //   }
        // ],
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
        Detail: [{ required: true, message: "请输入文字详情" }],
        Address: [{ required: true, message: "请选择项目位置" }]
      },
      activeName: "0",
      isClear: true,
      showMap: false,
      DetailAchae: "",
      GpsForm: {
        gps: "",
        address: ""
      },
      ReportMobileTypeEnumList: [
        {
          label: "全号报备",
          value: 1
        },
        {
          label: "隐号报备",
          value: 2
        }
      ],
      hasIDcard: [
        {
          label: "需要",
          value: true
        },
        {
          label: "不需要",
          value: false
        }
      ],
      dialogForm: {
        ProjectName: "", // 项目名称
        Area: null, // 地区
        ReportCount: 0, // 报备数
        ReportMobileTypeEnum: null, // 报备手机号显示方式
        ResidenterId: "", // 项目驻场人
        ResidenterMobile: "", // 项目驻场人手机号
        PrincipalerId: "", // 负责人
        PrincipalerMobile: "", // 项目负责人手机号
        ImgUrl: "", // 图片
        Discount: "", // 项目优惠
        Developer: "", // 项目开发商
        OpeningTime: "", // 开盘时间
        Commission: "", // 项目佣金
        Remark: "", // 特别说明
        LinkAgeRules: "", // 联动规则
        Detail: "", // 文字详情(富文本)
        Address: "", // 地址详情
        GPS: "", // 地址
        IsEnableIdCard: true
      },
      groupList: []
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
    dialogFormVisible() {
      this.activeName = "0";
      if (this.dialogFormVisible) {
        this.getFetchId();
        this.clearValidate();
      } else {
        this.restFrom();
      }
    },
    accountList: {
      handler() {
        this.groupList = this.accountList
          .map(item => {
            if (item.Type == 2) {
              return {
                value: item.Id,
                label: item.UserName,
                Mobile: item.Mobile
              };
            }
          })
          .filter(item => item);
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.activeName == "2") {
            // 最后一步 确定
            this.sureloading = true;
            if (this.isAdd) {
              AddProject(this.dialogForm)
                .then(res => {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                  this.sureloading = false;
                  this.$emit("update:dialogFormVisible", false);
                  this.$emit("getDataList");
                })
                .catch(() => {
                  this.sureloading = false;
                });
            } else {
              let updateForm = Object.assign({}, this.dialogForm, {
                Id: this.dialogId
              });
              updateEditProject(updateForm)
                .then(res => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.sureloading = false;
                  this.$emit("update:dialogFormVisible", false);
                  this.$emit("getDataList");
                })
                .catch(() => {
                  this.sureloading = false;
                });
            }
          } else {
            this.activeName = (Number(this.activeName) + 1).toString();
          }
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
      const isJPG = file.type == "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    changeDetail(val) {
      let setDetail = val.replace(/<[^>]+>/g, "");
      this.dialogForm.Detail = setDetail.length > 0 ? val : "";
    },
    preFrom() {
      if (Number(this.activeName) !== 0) {
        this.activeName = (Number(this.activeName) - 1).toString();
      }
    },
    nextFrom() {
      this.submitForm("ruleForm" + this.activeName);
    },
    openGPS() {
      this.showMap = true;
    },
    getMap(data) {
      // 通过  e.point.lng获取经度
      // 通过  e.point.lat获取纬度
      this.dialogForm.GPS = `${data.point.lng},${data.point.lat}`;
      this.dialogForm.Address = data.site;
    },
    getFetchId() {
      getEditProject({ Id: this.dialogId }).then(data => {
        let Result = data.Result;
        this.DetailAchae = Result.Detail;
        this.GpsForm = {
          gps: Result.GPS,
          address: Result.Address
        };
        this.dialogForm = Object.assign({}, this.dialogForm, Result, {
          ResidenterId: Result.ResidenterId, // 项目驻场人
          ResidenterMobile: Result.ResidenterMobile, // 项目驻场人手机号
          PrincipalerId: Result.PrincipalerId, // 负责人
          PrincipalerMobile: Result.PrincipalerMobile // 项目负责人手机号
        });
      });
    },
    restFrom() {
      this.DetailAchae = "";
      this.GpsForm = Object.assign(
        {},
        this.$data.GpsForm,
        this.$options.data().GpsForm
      );
      this.dialogForm = Object.assign(
        {},
        this.$data.dialogForm,
        this.$options.data().dialogForm
      );
      this.clearValidate();
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.ruleForm0.clearValidate();
        this.$refs.ruleForm1.clearValidate();
        this.$refs.ruleForm2.clearValidate();
      });
    },
    changeMobile(name, data) {
      let currResidenter = this.groupList.filter(item => {
        return item.value == data;
      });
      this.dialogForm[name] = currResidenter[0].Mobile;
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
