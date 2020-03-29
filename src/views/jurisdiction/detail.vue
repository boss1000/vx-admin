<template>
  <div class="commonTemp">
    <el-form :inline="true" class="detailForm" :model="dialogForm" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="dialogForm.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份">
            <el-input v-model="dialogForm.userType" placeholder="请输入身份"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码">
            <el-input v-model="dialogForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理部门">
            <el-select v-model="dialogForm.userDept" placeholder="请选择管理部门">
              <el-option
                v-for="item in approverList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户权限">
            <el-select v-model="dialogForm.userDuty" placeholder="请选择权限">
              <el-option
                v-for="item in jurisdictionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="dialogForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="头像">
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
            <!-- <el-input v-model="dialogForm.userImage" placeholder="请输入头像url"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "JurisDictionDetail",
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
      dialogForm: {}
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
    }
  }
};
</script>
