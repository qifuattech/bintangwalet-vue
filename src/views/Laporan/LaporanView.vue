<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">LAPORAN</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title class="py-3 d-flex justify-space-around">
            <v-menu
              v-model="periode.pickerTanggal1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Tanggal Awal"
                  :value="formatDate(periode.tanggal1)"
                  append-icon="mdi-calendar"
                  readonly
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  dense
                  outlined
                  background-color="light-blue lighten-5"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="periode.tanggal1"
                @input="periode.pickerTanggal1 = false"
              ></v-date-picker>
            </v-menu>

            <v-menu
              v-model="periode.pickerTanggal2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Tanggal Akhir"
                  :value="formatDate(periode.tanggal2)"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  dense
                  outlined
                  background-color="light-blue lighten-5"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="periode.tanggal2"
                @input="periode.pickerTanggal2 = false"
              ></v-date-picker>
            </v-menu>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Stok</div>
              <v-spacer></v-spacer>
              <download-excel
                :fetch="stokFetchData"
                :fields="stok_fields"
                worksheet="Data Stock"
                name="Data Stock.xls"
              >
                <v-btn color="success" rounded
                  >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
                >
              </download-excel>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Penerimaan</div>
              <v-spacer></v-spacer>
              <download-excel
                :fetch="labarugiFetchData"
                :fields="labarugi_fields"
                worksheet="Data Penerimaan"
                name="Data Penerimaan.xls"
              >
                <v-btn color="success" rounded
                  >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
                >
              </download-excel>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Penjualan</div>
              <v-spacer></v-spacer>
              <download-excel
                :fetch="labarugiFetchData"
                :fields="labarugi_fields"
                worksheet="Data Penjualan"
                name="Data Penjualan.xls"
              >
                <v-btn color="success" rounded
                  >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
                >
              </download-excel>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Laba Rugi</div>
              <v-spacer></v-spacer>
              <download-excel
                :fetch="labarugiFetchData"
                :fields="labarugi_fields"
                worksheet="Data Laba Rugi"
                name="Data Laba Rugi.xls"
              >
                <v-btn color="success" rounded
                  >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
                >
              </download-excel>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      periode: {
        pickerTanggal1: false,
        tanggal1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        pickerTanggal2: false,
        tanggal2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      },
      stok_fields: {
        "KODE BARANG": "kode_bahan",
        "NAMA BARANG": "nama_bahan",
        UNIT: "unit",
        UKURAN: "ukuran",
        "SALDO AWAL (QTY)": "saldo_awal_qty",
        "SALDO AWAL (RP)": "saldo_awal_rp",
        "TERIMA (QTY)": "terima_qty",
        "KELUAR (QTY)": "keluar_qty",
        "TOTAL (QTY)": "total_qty",
        "TERIMA (RP)": "terima_rp",
        "KELUAR (RP)": "keluar_rp",
        "TOTAL (RP)": "total_rp",
        "SALDO AKHIR (QTY)": "saldo_akhir_qty",
        "SALDO AKHIR (RP)": "saldo_akhir_rp",
        "HARGA JUAL": "rp_jual",
      },
      labarugi_fields: {
        "TGL NOTA": "tgl_update",
        "NO NOTA": "no_bukti",
        CUSTOMER: "nama",
        PEMBAYARAN: "pembayaran",
        KODE: "kode_bahan",
        "NAMA BARANG": "nama_bahan",
        JENIS: "nm_jenis",
        JUMLAH: "jumlah",
        "HARGA JUAL": "rp_jual",
        "HARGA HPP": "harga",
        "TOTAL JUAL": "tot_jual",
        "TOTAL HPP": "tot_hpp",
        LABA: "laba",
        "TOTAL LABA": "tot_laba",
      },
      loading: false,
    };
  },
  methods: {
    async stokFetchData() {
      //   this.loading = true;
      console.log(this.periode.tanggal1);
      const res = await axios.post("laporan/stok", {
        tanggal1: this.periode.tanggal1,
        tanggal2: this.periode.tanggal2,
      });
      //   this.loading = false;
      return res.data.data;
    },
    async labarugiFetchData() {
      //   this.loading = true;
      console.log(this.periode.tanggal1);
      const res = await axios.post("laporan/labarugi", {
        tanggal1: this.periode.tanggal1,
        tanggal2: this.periode.tanggal2,
      });
      //   this.loading = false;
      return res.data.data;
    },
  },
  computed: {
    tanggal1() {
      return this.periode.tanggal1;
    },
    tanggal2() {
      return this.periode.tanggal2;
    },
  },
  watch: {
    tanggal1: function (value1, value2) {
      if (this.periode.tanggal1 > this.periode.tanggal2) {
        alert("Tanggal Awal Melebihi Tanggal Akhir");
        this.periode.tanggal1 = value2;
      }
    },
    tanggal2: function (value1, value2) {
      if (this.periode.tanggal1 > this.periode.tanggal2) {
        alert("Tanggal Awal Melebihi Tanggal Akhir");
        this.periode.tanggal2 = value2;
      }
    },
  },
};
</script>

<style>
</style>