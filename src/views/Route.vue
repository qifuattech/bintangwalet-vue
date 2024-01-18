<template>
<v-container>
    {{ user.level }}
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  async created() {
    console.log(this.user.level);
  },

  computed: {
    getMenu() {
      return this.$store.state.menu;
    },
    getApiServer() {
      return this.$store.state.apiServer;
    },
    getApiLokal() {
      return this.$store.state.apiLokal;
    },
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
    }),
  },
};
</script>

<style>
</style>