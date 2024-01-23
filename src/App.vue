<template>
  <v-app style="-webkit-app-region: drag; background: #f7f7f7">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      expand-on-hover
      color="#f7f7f7"
      app
    >
      <v-list-item class="px-2 pt-1">
        <!-- <v-list-item-avatar tile>
          <v-img
            src="./assets/app-logo.png"
            alt="admin"
            @click.stop="mini = !mini"
            class="clickable"
            width="5px"
          />
        </v-list-item-avatar> -->

        <v-list-item-title class="mt-2 text-capitalize">
          <!-- <h3 style="color: grey">POS - BINTANG WALET</h3> -->
          <div>
            <v-btn
              color="success"
              v-if="$store.state.isOnline == true"
              rounded
              x-small
              >ON</v-btn
            >
            <v-btn color="error" v-else rounded x-small>OFF</v-btn>
          </div>
        </v-list-item-title>
      </v-list-item>
      <v-list shaped class="clickable">
        <template v-for="item in items">
          <v-list-group
            v-if="item.menu_detail"
            :key="item.name"
            v-model="item.model"
            :prepend-icon="item['iconctr']"
            active-class="primary--text"
          >
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="(child, i) in item.menu_detail"
              :key="i"
              route
              :to="child.route"
              active-class="primary--text"
              class="ml-5"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item
            v-else
            :key="item.name"
            active-class="blue--text"
            route
            :to="item.route"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      style="background-color: #182b3a;background-image: linear-gradient(315deg, #182b3a 0%, #20a4f3 74%);"
      dark
      dense
    >
      <v-app-bar-nav-icon
        @click.stop="mini = !mini"
        class="clickable"
      ></v-app-bar-nav-icon>
      <v-btn text @click="toogleFullscreen()"
        ><v-icon>mdi-overscan</v-icon></v-btn
      >
      <v-toolbar-title style="width: 250px" class="ml-0 pl-4">
        <!-- TITLE PERUSAHAAN -->
        <span class="hidden-sm-and-down">{{ $store.state.auth.company.name }}</span>
        <!-- END TITLE PERUSAHAAN -->
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="isLoggedIn">
        <v-btn light class="mr-5" text dark
          ><v-icon class="mr-2">mdi-account</v-icon> {{ user.name }} -
          {{ user.level }}</v-btn
        >
        <v-btn v-on:click="logout()" class="clickable" outlined rounded>
          <v-icon class="mr-2">mdi-logout</v-icon>Logout
        </v-btn>
      </template>

      <template v-else>
        <v-btn to="/login" class="clickable" light
          ><v-icon class="mr-2">mdi-account-outline</v-icon> LOG IN</v-btn
        >
        <!-- <v-btn to="/login" class="clickable" light ><v-icon right class="mr-2">mdi-account</v-icon> LOG IN</v-btn> -->
        <!-- <v-btn to="/register" class="clickable ml-5" outlined rounded>
          <v-icon class="mr-2">mdi-account-plus</v-icon>REGISTER - DAFTAR</v-btn
        > -->
      </template>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <router-view></router-view>
        </v-row>
      </v-container>
    </v-content>
    <v-btn
      v-scroll="onScroll"
      bottom
      color="pink"
      dark
      fab
      fixed
      right
      small
      @click="toTop"
      class="clickable mb-10"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  props: {
    sorce: String,
  },
  data: () => ({
    drawer: null,
    mini: false,
    tab: false,
  }),
  mounted() {
    this.loadCompany();
  },
  computed: {
    getApiServer() {
      return this.$store.state.apiServer;
    },
    getApiLokal() {
      return this.$store.state.apiLokal;
    },
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "user",
      items: "menu",
      company: "company"
    }),
  },
  methods: {
    async loadCompany() {
      await this.$store.dispatch('get_company').then(() => {
        this.document.title= this.company.name
      })
      
    },
    toogleFullscreen() {
      const elem = document.documentElement;

      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    logout: function () {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
  },
};
</script>

<style>
/* .v-data-table tbody td {
    font-size: 0.750rem !important;
}
.v-chip {
  font-size: 0.750rem !important;
}
.v-btn {
    font-size: 0.750rem !important;
    text-transform: capitalize !important;
} */
@font-face {
  font-family: "OpenSans";
  src: url(./assets/OpenSans.ttf) format("truetype");
}
.v-application {
  font-family: "OpenSans" !important;
}
html {
  font-size: 14px !important;
}

/* table th + th { border-left:1px solid #dddddd; }
table td + td { border-left:1px solid #dddddd; } */

.clickable {
  -webkit-app-region: no-drag;
}
::-webkit-scrollbar {
  /* width: 12px; */
  width: 0;
  background: transparent;
}

::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  /* border-radius: 10px; */
  width: 0;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  /* border-radius: 10px; */
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  width: 0;
  background: transparent;
}

.container {
  max-width: 100% !important;
}

.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 18px !important;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.v-dialog > .v-card > .v-card__text {
  padding: 0 24px 0px !important;
}
.v-list-item {
  min-height: 30px !important;
}
.v-list-item__action {
  margin-top: 8px !important;
  margin-bottom: 8px !important;
}
.v-list-item__title {
  font-size: 0.9rem !important;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  padding-top: 0px;
  margin-bottom: 0px !important;
}
</style>
