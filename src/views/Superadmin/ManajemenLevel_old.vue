<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>MANAJEMEN LEVEL USER</h1>
        <p>Pengelolaan Level User</p>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <!-- <v-row class="mt-2">
      <v-col class="d-flex justify-start" cols="3">
        <v-text-field v-model="cari" label="Pencarian" dense></v-text-field>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn small text color="primary" @click="showDialog()"
          ><v-icon>mdi-plus</v-icon>Tambah Menu</v-btn
        >
        <v-btn small text color="success"
          ><v-icon>mdi-refresh</v-icon>Refresh</v-btn
        >
      </v-col>
    </v-row> -->
    <v-row class="mt-0">
      <v-col cols="4">
        <v-card elevation="4">
          <v-card-title>
            <v-col class="d-flex justify-start" cols="auto"> Data Level </v-col>
            <v-col class="d-flex justify-end">
              <v-btn color="success" small @click="dialogTambahLevel = true"
                ><v-icon>mdi-plus-thick</v-icon></v-btn
              >
            </v-col></v-card-title
          >
          <v-card-text>
            <v-data-table
              :headers="gridHeaders"
              :items="arrData"
              class="elevetion-1"
              :search="cari"
              :items-per-page="20"
              dense
            >
              <template v-slot:[`item.icon`]="{ item }">
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.icon }}
              </template>
              <template v-slot:[`item.opsi`]="{ item }">
                <v-btn small text @click="showEdit(item.level_user)"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>
            <v-col class="d-flex justify-start" cols="auto">
              Set Akses Menu Level : {{ level }}
            </v-col>

            <v-col class="d-flex justify-end">
              <v-btn
                v-if="level.length > 0"
                color="success"
                small
                @click="(dialogTambahMenu = true), loadMenu()"
                ><v-icon>mdi-plus-thick</v-icon></v-btn
              >
            </v-col>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="gridHeadersDetail"
              :items="arrDetail"
              :search="cariDetail"
              dense
            >
              <template v-slot:[`item.icon`]="{ item }">
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.icon }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG TAMBAH LEVEL -->
    <v-dialog
      v-model="dialogTambahLevel"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>Tambah Level</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.level" label="Nama Level"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn small color="success" @click="simpanLevel()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END DIALOG TAMBAH LEVEL -->

    <!-- DIALOG TAMBAH MENU -->
    <v-dialog
      v-model="dialogTambahMenu"
      max-width="800px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title> Daftar Menu </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="cariMenu"
            label="Pencarian Menu"
          ></v-text-field>
          <v-data-table
            :headers="gridHeadersMenu"
            :items="arrDataMenu"
            class="elevation-1"
            :search="cariMenu"
            dense
          >
            <template v-slot:[`item.opsi`]="{ item }">
              <v-btn text color="primary" @click="pilihMenu(item.kode_menu)">
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- END DIALOG TAMBAH MENU -->
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      gridHeaders: [
        { text: "LEVEL", value: "level_user" },
        { text: "OPSI", value: "opsi" },
      ],
      gridHeadersDetail: [
        { text: "KODE MENU", value: "kode_menu" },
        { text: "NAMA MENU", value: "text" },
        { text: "ROUTE", value: "route" },
        { text: "ICON", value: "icon" },
        { text: "OPSI", value: "opsi" },
      ],
      gridHeadersMenu: [
        { text: "KODE MENU", value: "kode_menu" },
        { text: "NAMA MENU", value: "text" },
        { text: "ROUTE", value: "route" },
        { text: "IKON", value: "icon" },
        { text: "AKTIF", value: "flag_aktif" },
        { text: "OPSI", value: "opsi" },
      ],

      arrData: [],
      arrDetail: [],
      arrDataMenu: [],
      cari: "",
      cariDetail: "",
      cariMenu: "",
      level: "",
      staEdit: false,

      form: {
        level: "",
      },
      dialogTambahLevel: false,
      dialogTambahMenu: false,
    };
  },

  mounted() {
    this.loadData();
  },
  methods: {
    simpanLevel() {
      axios
        .post(this.$store.state.apiServer + "level/createlevel", this.form)
        .then((res) => {
          if (res.data.success == true) {
            this.loadData();
            this.dialogTambahLevel = false;
          } else {
            alert(res.data.message + " | " + res.data.data);
          }
        });
    },
    pilihMenu(kodeMenu) {
      axios
        .post(this.$store.state.apiServer + "level/tambahmenu", {
          level: this.level,
          kode_menu: kodeMenu,
        })
        .then((res) => {
          if (res.data.success == true) {
            this.loadDetail();
            this.dialogTambahMenu = false;
          } else {
            alert(res.data.message + " | " + res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showEdit(level) {
      this.level = level;
      this.loadDetail();
    },
    resetForm() {
      this.form.kode_menu = "";
      this.form.text = "";
      this.form.route = "";
      this.form.icon = "";
    },

    loadData() {
      axios
        .get(this.$store.state.apiServer + "level")
        .then((res) => {
          this.arrData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    loadDetail() {
      axios
        .get(this.$store.state.apiServer + "level/" + this.level)
        .then((res) => {
          if (res.data.success == true) {
            this.arrDetail = res.data.data;
          } else {
              if (res.data.message== 'notfound') {
                  this.arrDetail = []
                  return
              }
            console.log(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    loadMenu() {
      axios
        .get(this.$store.state.apiServer + "menu")
        .then((res) => {
          this.arrDataMenu = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
</style>