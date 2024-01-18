<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="1">
          <v-card-title primary-title> Daftar Menu </v-card-title>
          <v-card v-for="item in arrData" :key="item.id_menu">
            <v-icon small>{{ item.icon }}</v-icon>
            {{ item.text }}
            <v-btn @click="revisiData(item.id_menu, item.text, item.route, item.icon)" small><v-icon small>mdi-pen</v-icon></v-btn>
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title primary-title> Tambah Menu </v-card-title>
          <v-card-text>
            <v-text-field
              label="ID Menu"
              v-model="form.id_menu"
              outlined
              readonly
              dense
            ></v-text-field>
            <v-text-field
              label="Nama Menu"
              v-model="form.text"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              label="Route Menu"
              v-model="form.route"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              label="Pilih Icon"
              v-model="form.icon"
              outlined
              dense
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn v-if="isRevisi !== true" color="success" @click="simpanData()">Simpan</v-btn>
            <v-btn v-else color="success" @click="updateData()">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      arrData: [],
      form: {
        id_menu: "",
        text: "",
        route: "",
        icon: "",
      },
      isRevisi: false,
    };
  },

  mounted() {
    axios
      .get( "menu")
      .then((res) => {
        console.log(res.data.data);
        this.arrData = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    simpanData() {
      axios
        .post( "menu/addmenu", this.form)
        .then((res) => {
          console.log(res.data.message);
          if (res.data.success == true) {
            this.form.text = "";
            this.form.route = "";
            this.form.icon = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    revisiData(idMenu, text, route, icon) {
        this.form.id_menu = idMenu;
        this.form.text = text;
        this.form.route = route;
        this.form.icon = icon;
        this.isRevisi = true;
    },
    updateData() {
        axios.post( "menu/updatemenu", this.form)
        .then((res) => {
            console.log(res.data.message);
            this.form.text = "";
            this.form.route = "";
            this.form.icon = "";
            this.form.id_menu = "";
            this.isRevisi = false;
        })
        .catch((err) => {
            console.log(err);
        })
    },
    loadData() {
      axios
        .get( "menu")
        .then((res) => {
          console.log(res.data.data);
          this.arrData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
    }),
  },
};
</script>

<style>
</style>