<template>
  <div>
    <el-input v-model="formInline" placeholder="审批人"></el-input>
  </div>
</template>
<script>
export default {
  name: "NoticeManage",
  data() {
    return {
      formInline: ""
    };
  }
};
</script>
