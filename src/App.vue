<template>
  <v-app>
    <SidebarNav v-if="isAuthenticated" />
    <v-main>
      <v-card flat class="mx-2 rounded-lg" height="100%">
        <v-card-title v-if="isAuthenticated">
          <v-icon @click="drawer = !drawer">mdi-menu</v-icon>
          <v-spacer></v-spacer>
          <p class="text-right text-subtitle-1">
            {{ date }}, {{ time }} {{ currentDate }}
          </p>
        </v-card-title>
        <v-divider v-if="isAuthenticated" />
        <v-card-text :class="isAuthenticated ? '' : 'main'">
          <router-view />
        </v-card-text>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout">
          {{ snackbar.message }}
        </v-snackbar>
      </v-card>
    </v-main>
    <FooterNav v-if="isAuthenticated" />
  </v-app>
</template>

<script lang="ts">
import SidebarNav from "./components/navigation/SidebarNav.vue";
import FooterNav from "./components/navigation/Footer.vue";
import { mapState, mapWritableState } from "pinia";
import { useUserStore } from "./stores/user";
import { useAppStore } from "./stores/app";
import { useSnackbarStore } from "@/stores/snackbar";
import moment from "moment";

export default {
  name: "App",

  components: {
    SidebarNav,
    FooterNav,
  },

  data() {
    return {
      time: "",
      date: "",
    };
  },

  computed: {
    ...mapState(useUserStore, ["isAuthenticated"]),
    ...mapWritableState(useAppStore, ["drawer"]),
    currentDate() {
      return moment(new Date()).format("A");
    },
  },

  methods: {
    showTime() {
      setInterval(() => {
        const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const cd = new Date();
        this.time =
          this.zeroPadding(cd.getHours(), 2) +
          ":" +
          this.zeroPadding(cd.getMinutes(), 2) +
          ":" +
          this.zeroPadding(cd.getSeconds(), 2);
        this.date = this.zeroPadding(cd.getDate(), 2) + " " + week[cd.getDay()];
      }, 1000);
    },
    zeroPadding(num: number, digit: number) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
  },

  mounted() {
    this.showTime();
  },

  setup() {
    const snackbar = useSnackbarStore();
    return { snackbar };
  },
};
</script>


<style scoped>
#app {
  background-color: aliceblue;
}
#outer {
  background-color: aliceblue;
  height: 100%;
}
.main {
  height: 100%;
}
</style>
