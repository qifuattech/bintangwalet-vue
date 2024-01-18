<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="4" v-for="(item, index) in arrData" :key="index">
        <v-card >
          <v-card-text>
            <div>{{ item.kode_perk }}</div>
            <p class="text-h6 text--primary">{{ item.nama }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
    <v-progress-linear
      v-if="progress == true"
      :indeterminate="progress"
    ></v-progress-linear>
    <v-alert v-else type="success" :value="alert" dense outlined dismissible>
      Data Berhasil Di-Load
    </v-alert>

    <v-row>
      <v-col cols="6" v-for="item in arrJoinData" :key="item.index">
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">
              {{ item.nama }} ({{ item.kode_perk }})
            </h3>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="gridHeadersDetail"
              :items="item.detail"
              hide-default-footer
              dense
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title> Distinct </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="gridDistinctHeaders"
              :items="arrDistinctData"
              :search="cariDistinct"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title> Data </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="gridHeaders"
              :items="arrData"
              :search="cari"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cariDistinct: "",
      cari: "",
      arrDistinctData: [],
      arrData: [],

      gridHeaders: [
        { text: "Tanggal", value: "tanggal" },
        { text: "No. Bukti", value: "no_bukti" },
        { text: "No. PO", value: "no_po" },
        { text: "Keterangan", value: "keterangan" },
        { text: "Kode Perkiraan", value: "kode_perk" },
        { text: "Nama Perkiraan", value: "nama" },
        { text: "Debit", value: "debit" },
        { text: "Kredit", value: "kredit" },
      ],
      gridDistinctHeaders: [
        { text: "Nama Perkiraaan", value: "nama" },
        { text: "Kode Perkiraan", value: "kode_perk" },
      ],
      gridHeadersDetail: [
        { text: "TANGGAL", value: "tanggal" },
        { text: "KETERANGAN", value: "keterangan" },
        { text: "DEBIT", value: "debit" },
        { text: "KREDIT", value: "kredit" },
      ],
      arrJoinData: [],
      progress: true,
      alert: true,
    };
  },

  mounted() {
    this.loadDistinctData();
    this.loadData();
  },
  methods: {
    joinData() {
      for (let i = 0; i < this.arrDistinctData.length; i++) {
        this.arrJoinData.push({ ...this.arrDistinctData[i] });
        this.arrJoinData[i].detail = [];
        for (let j = 0; j < this.arrData.length; j++) {
          if (this.arrDistinctData[i].kode_perk == this.arrData[j].kode_perk) {
            this.arrJoinData[i].detail.push({ ...this.arrData[j] });
          }
        }
      }
    },

    loadDistinctData() {
      axios
        .get(
          this.$store.state.apiServer +
            "transaksitrading/distinctkartupiutang/1/2022"
        )
        .then((res) => {
          this.arrDistinctData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async loadData() {
      await axios
        .get(
          this.$store.state.apiServer +
            "transaksitrading/datakartupiutang/1/2022"
        )
        .then((res) => {
          this.arrData = res.data.data;
          this.joinData();
          this.progress = false;
          setTimeout(() => {
            this.alert = false;
          }, 10000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    getLengthJoinData() {
      return this.arrJoinData.length;
    },
    // uniqueQuestions() {
    //   return this.arrData.reduce((seed, current) => {
    //     return Object.assign(seed, {
    //       [current.kode_perk]: current.kode_perk,
    //     });
    //   }, {});
    // },
    // distinct() {
    //   return this.arrData.reduce((seed, current) => {
    //     return this..push({ ...this.form });
    //   }, {});
    // },
  },
};
</script>

<style>
</style>