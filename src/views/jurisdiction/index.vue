<template>
  <div>
    <el-input v-model="formInline" placeholder="权限配置" />
  </div>
</template>
<script>
export default {
  name: "JurisDiction",
  data() {
    return {
      formInline: ""
    };
  }
};
</script>
