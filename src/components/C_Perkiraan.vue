<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Data Perkiraan </v-card-title>
          <v-card-text>
            <v-text-field label="Pencarian" v-model="cari"></v-text-field>
            <v-data-table
              :headers="gridHeaders"
              :items="arrData"
              class="elevation-1"
              :search="cari"
            >
              <template v-slot:[`item.opsi`]="{ item }">
                <v-btn color="info" small @click="pilihPerkiraan(item.kode, item.nama)">Pilih</v-btn>
              </template></v-data-table
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      arrData: [],
      gridHeaders: [
        { text: "Kode Perkiraan", value: "kode" },
        { text: "Nama Perkiraan", value: "nama" },
        { text: "Opsi", value: "opsi" },
      ],
      cari: "",
      objPerkiraan: {
          kode: "",
          nama: ""
      }
    };
  },
  mounted() {
    axios
      .get(this.$store.state.apiServer + "perkiraan")
      .then((res) => {
        this.arrData = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
      pilihPerkiraan(kode, nama) {
          this.objPerkiraan.kode = kode
          this.objPerkiraan.nama = nama
          this.$emit('dataPerkiraan', this.objPerkiraan)
          console.log(this.objPerkiraan);
      }
  },
};
</script>

<style>
</style>