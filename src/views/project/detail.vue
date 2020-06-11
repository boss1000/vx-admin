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
        <el-col :span="8">
          <el-form-item label="项目名称" prop="ProjectName">
            <el-input v-model="dialogForm.ProjectName" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人" prop="PrincipalerName">
            <el-input v-model="dialogForm.PrincipalerName" placeholder="请输入负责人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人电话" prop="PrincipalerMobile">
            <el-input v-model="dialogForm.PrincipalerMobile" placeholder="请输入负责人电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="折扣" prop="Discount">
            <el-input v-model="dialogForm.Discount" placeholder="请输入折扣"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开发商" prop="Developer">
            <el-input v-model="dialogForm.Developer" placeholder="请输入开发商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开盘时间" prop="OpeningTime">
            <el-date-picker v-model="dialogForm.OpeningTime" type="date" placeholder="请选择开盘时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="佣金" prop="Commission">
            <el-input v-model="dialogForm.Commission" placeholder="请输入佣金"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="头像" prop="userImage">
            <el-upload
              class="avatar-uploader"
              action="这里填入后台的接口地址"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="dialogForm.userImage" :src="dialogForm.userImage" class="avatar" />
              <span
                v-if="dialogForm.userImage"
                class="el-upload-action"
                @click.stop="handleRemove()"
              >
                <i class="el-icon-delete"></i>
              </span>
              <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
            </el-upload>
          </el-form-item>
        </el-col>-->
        <el-col :span="24">
          <el-form-item label="特别说明">
            <editor-bar v-model="dialogForm.Remark" :isClear="isClear" @change="change"></editor-bar>
            <!-- <el-input v-model="dialogForm.Remark" placeholder="请输入特别说明"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { validPhone } from "@/utils/validate";
import EditorBar from "@/components/wangEditor/index.vue";
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
      rules: {
        ProjectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
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
        Commission: [{ required: true, message: "请输入佣金", trigger: "blur" }]
      },
      isClear: false,
      dialogForm: {
        ProjectName: "",
        PrincipalerName: "",
        PrincipalerMobile: "",
        Discount: "",
        Developer: "",
        OpeningTime: "",
        Commission: "",
        Remark: ""
      }
    };
  },
  watch: {
    title: {
      handler() {
        // this.state = this.title == "新增" ? true : false;
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
    }
  },
  methods: {
    // 移除图片
    handleRemove() {
      this.dialogForm.userImage = "";
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      this.dialogForm.userImage = res.data.url;
    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const type =
        file.type === "image/jpeg" ||
        "image/jpg" ||
        "image/webp" ||
        "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!type) {
        this.$message.error("图片格式不正确!(只能包含jpg，png，webp，JPEG)");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return type && isLt2M;
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          return this.dialogForm;
        }
      });
    },
    change(val) {
      console.log(val);
    }
  }
};
</script>
