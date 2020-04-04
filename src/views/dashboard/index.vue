<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import { getNewMessage } from "../../api/message";

export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard"
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    if (!this.roles.includes("admin")) {
      this.currentRole = "editorDashboard";
    }
  },
  mounted() {
    getNewMessage().then(res => {
      // 写循环两个提示会重叠
      if (res.data.length > 0) {
        this.$notify.info({
          title: res.data[0].messageTitle,
          message: res.data[0].messageBody,
          position: "bottom-right",
          duration: 0
        });
        if (res.data.length > 1) {
          this.$nextTick(() => {
            this.$notify.info({
              title: res.data[1].messageTitle,
              message: res.data[1].messageBody,
              position: "bottom-right",
              duration: 0
            });
          });
        }
      }
    });
  }
};
</script>
