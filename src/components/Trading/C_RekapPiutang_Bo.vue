<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Data Piutang BO </v-card-title>
          <v-card-text>
            <v-text-field v-model="cari" label="Pencarian"></v-text-field>
            <v-data-table
              :headers="gridHeader"
              :items="arrData"
              class="pa-2"
              :loading="progress"
              :search="cari"
            >
            </v-data-table>
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
      gridHeader: [
        { text: "KODE", value: "kode_bo" },
        { text: "NAMA", value: "nama_bo" },
        { text: "PENJUALAN", value: "penjualan" },
        { text: "PEMASUKAN", value: "pemasukan" },
        { text: "SALDO", value: "saldo" },
      ],
      arrData: [],
      progress: true,
      cari: "",
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      axios
        .get("transaksitrading/monpiutang-bo/3/2022")
        .then((res) => {
          this.arrData = res.data.data;
          this.progress = false;
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