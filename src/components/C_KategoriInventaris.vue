<template>
  <v-container>
      <v-row>
          <v-col cols="12"></v-col>
    <v-card>
      <v-card-title> Input Kategori Inventaris </v-card-title>
      <v-card-text>
        <v-btn @click="showPilihKategori()" >Pilih Kategori Jika sudah ada</v-btn>
        <v-text-field
          label="Abbreviation (Singkatan) Kategori"
          v-model="form.abbrv_main"
          :readonly="sPilihKategori !== ''"
        ></v-text-field>
        <v-text-field
          label="Nama Kategori"
          v-model="form.kategori"
          :readonly="sPilihKategori !== ''"
        ></v-text-field>
        <v-text-field
          label="Abbreviation (Singkatan) Sub Kategori"
          v-model="form.abbrv_sub"
        ></v-text-field>
        <v-text-field
          label="Nama Sub Kategori"
          v-model="form.subkategori"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="simpanData()">Simpan</v-btn>
      </v-card-actions>

      <v-dialog v-model="dialogPilihKategori" max-width="500px">
        <v-card>
          <v-card-text>
            <v-select
              :items="selKategori"
              v-model="sPilihKategori"
              @change="setKategori()"
            ></v-select>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        abbrv_main: "",
        kategori: "",
        abbrv_sub: "",
        subkategori: "",
      },
      dialogPilihKategori: false,

      sPilihKategori: "",

      selKategori: [],
    };
  },
  methods: {
    async showPilihKategori() {
      this.dialogPilihKategori = true;
      await axios
        .get("inventaris/kategori")
        .then((res) => {
          console.log(res.data.data);
          if (res.data.success == true) {
            this.selKategori = res.data.data;
          } else {
            console.log(res.data.err);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    setKategori() {
      this.form.abbrv_main = this.sPilihKategori.substring(
        this.sPilihKategori.indexOf("(", 0) + 1,
        4
      );
      this.form.kategori = this.sPilihKategori.substring(
        this.sPilihKategori.indexOf(")", 4) + 2,
        100
      );
    },
    simpanData() {
      axios
        .post( "inventaris/tambahkategori", this.form)
        .then((res) => {
          console.log(res.data.message);
          if (res.data.success == true) {
            alert("Kategori BERHASIL disimpan");
          } else {
            alert("Kategori GAGAL disimpan");
            console.log(res.data.cek);
            console.log(res.data.err);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {},

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