<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">LAPORAN</div>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row>
      <v-col cols="auto" lg="6" md="12" sm="12">
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
            -
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
            <!-- LAPORAN STOK2 -->
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Stok</div>
              <v-spacer></v-spacer>
              <v-btn color="success" rounded @click="stokDownload()"
                >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
              >
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- LAPORAN PENERIMAAN -->
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Penerimaan</div>
              <v-spacer></v-spacer>
              <v-btn color="success" rounded @click="penerimaanDownload()"
                >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
              >
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- LAPORAN PENJUALAN -->
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Penjualan</div>
              <v-spacer></v-spacer>

              <v-btn color="success" rounded @click="penjualanDownload()"
                >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
              >
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- LAPORAN PENJUALAN & LABA RUGI -->
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Laba Rugi</div>
              <v-spacer></v-spacer>
              <v-btn color="success" rounded @click="labarugiDownload()"
                >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
              >
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <!-- LAPORAN PIUTANG -->
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Piutang</div>
              <v-spacer></v-spacer>
              <v-btn color="success" rounded @click="piutangDownload()"
                >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
              >
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- LAPORAN HUTANG -->
            <div class="d-flex justify-space-around align-center">
              <div>Laporan Hutang</div>
              <v-spacer></v-spacer>
              <v-btn color="success" rounded @click="hutangDownload()"
                >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
              >
            </div>
            <v-divider class="my-2"></v-divider>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import ExcelJS from "exceljs";
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      periode: {
        pickerTanggal1: false,
        tanggal1:
          new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 7) + "-01",
        pickerTanggal2: false,
        tanggal2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
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

    // STOK DOWNLOAD
    async stokDownload() {
      try {
        // Make an API request to fetch data (replace 'apiEndpoint' with your actual API endpoint)
        const response = await axios.post("laporan/stok", {
          tanggal1: this.periode.tanggal1,
          tanggal2: this.periode.tanggal2,
        });
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();

        // SHEET KHUSUS REKAP
        const rekapsheet = workbook.addWorksheet("REKAP");
        const titleRow = rekapsheet.addRow([
          "LAPORAN REKAP STOK - PERIODE : " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " s/d " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
        ]);
        titleRow.font = { bold: true };
        rekapsheet.addRow([""]);
        const headerRow = rekapsheet.addRow([
          "KODE JENIS",
          "NAMA JENIS",
          "SALDO AWAL (QTY)",
          "SALDO AWAL (RP)",
          "TERIMA (QTY)",
          "KELUAR (QTY)",
          "TOTAL (QTY)",
          "TERIMA (RP)",
          "KELUAR (RP)",
          "TOTAL (RP)",
          "SALDO AKHIR (QTY)",
          "SALDO AKHIR (RP)",
        ]);
        headerRow.font = { bold: true };
        response.data.rekap.forEach((item) => {
          rekapsheet.addRow([
            item.kd_jenis,
            item.nm_jenis,
            item.saldo_awal_qty,
            item.saldo_awal_rp,
            item.terima_qty,
            item.keluar_qty,
            item.total_qty,
            item.terima_rp,
            item.keluar_rp,
            item.total_rp,
            item.saldo_akhir_qty,
            item.saldo_akhir_rp,
            item.rp_jual,
          ]);
        });
        // END SHEET KHUSUS REKAP

        const groupJenis = [
          ...new Set(response.data.data.map((item) => item.nm_jenis)),
        ];
        let worksheet = "";
        let filterData = [];
        for (let i = 0; i < groupJenis.length; i++) {
          worksheet = workbook.addWorksheet(groupJenis[i]);

          filterData = response.data.data.filter(function (el) {
            return el.nm_jenis == groupJenis[i];
          });
          const titleRow = worksheet.addRow([
            "LAPORAN STOK - PERIODE : " +
              moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
              " s/d " +
              moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
          ]);
          titleRow.font = { bold: true };
          worksheet.addRow([""]);

          const headerRow = worksheet.addRow([
            "KODE BARANG",
            "NAMA BARANG",
            "UNIT",
            "UKURAN",
            "SALDO AWAL (QTY)",
            "SALDO AWAL (RP)",
            "TERIMA (QTY)",
            "KELUAR (QTY)",
            "TOTAL (QTY)",
            "TERIMA (RP)",
            "KELUAR (RP)",
            "TOTAL (RP)",
            "SALDO AKHIR (QTY)",
            "SALDO AKHIR (RP)",
            "HARGA JUAL",
          ]);
          headerRow.font = { bold: true };
          // Add fetched data to the worksheet
          filterData.forEach((item) => {
            worksheet.addRow([
              item.kode_bahan,
              item.nama_bahan,
              item.unit,
              item.ukuran,
              item.saldo_awal_qty,
              item.saldo_awal_rp,
              item.terima_qty,
              item.keluar_qty,
              item.total_qty,
              item.terima_rp,
              item.keluar_rp,
              item.total_rp,
              item.saldo_akhir_qty,
              item.saldo_akhir_rp,
              item.rp_jual,
            ]);
          });
        }

        // Add data to the worksheet

        // Save the workbook to a file or download it
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            "Laporan Stok Periode : " +
            this.periode.tanggal1 +
            " - " +
            this.periode.tanggal1 +
            ".xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error fetching data from the API", error);
      }
    },

    // PENERIMAAN DONWLOAD
    async penerimaanDownload() {
      try {
        // Make an API request to fetch data (replace 'apiEndpoint' with your actual API endpoint)
        const response = await axios.post("laporan/penerimaan", {
          tanggal1: this.periode.tanggal1,
          tanggal2: this.periode.tanggal2,
        });
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();

        // SHEET KHUSUS REKAP
        const rekapsheet = workbook.addWorksheet("REKAP");
        const titleRow = rekapsheet.addRow([
          "LAPORAN REKAP PENERIMAAN STOK - PERIODE : " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " s/d " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
        ]);
        titleRow.font = { bold: true };
        rekapsheet.addRow([""]);
        const headerRow = rekapsheet.addRow([
          "KODE JENIS",
          "NAMA JENIS",
          "TOTAL (QTY)",
          "TOTAL (RP)",
        ]);
        headerRow.font = { bold: true };
        response.data.rekap.forEach((item) => {
          rekapsheet.addRow([
            item.kd_jenis,
            item.nm_jenis,
            item.tot_qty,
            item.tot_rp,
          ]);
        });
        // END SHEET KHUSUS REKAP

        const groupJenis = [
          ...new Set(response.data.data.map((item) => item.nm_jenis)),
        ];
        let worksheet = "";
        let filterData = [];
        for (let i = 0; i < groupJenis.length; i++) {
          worksheet = workbook.addWorksheet(groupJenis[i]);

          filterData = response.data.data.filter(function (el) {
            return el.nm_jenis == groupJenis[i];
          });

          // TITLE
          const titleRow = worksheet.addRow([
            "LAPORAN PENERIMAAN - PERIODE : " +
              moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
              " s/d " +
              moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
          ]);
          titleRow.font = { bold: true };
          worksheet.addRow([""]);

          // HEADER
          const headerRow = worksheet.addRow([
            "TANGGAL",
            "NO BUKTI",
            "NO PO",
            "KODE",
            "NAMA BARANG",
            "UKURAN",
            "NAMA JENIS",
            "HARGA",
            "JUMLAH",
            "TOTAL",
            "SUPPLIER",
            "NO SJ",
            "TGL SJ",
            "KETERANGAN",
          ]);
          headerRow.font = { bold: true };

          //FETCH DETAIL
          filterData.forEach((item) => {
            worksheet.addRow([
              item.tgl_terima,
              item.no_bukti,
              item.no_po,
              item.kode_bahan,
              item.nama_bahan,
              item.ukuran,
              item.nm_jenis,
              item.jml_terima,
              item.harga,
              item.subtotal,
              item.nama,
              item.no_sj,
              item.tgl_sj,
              item.keterangan,
            ]);
          });
        }

        // Add data to the worksheet

        // Save the workbook to a file or download it
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            "Laporan Penerimaan Periode " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " - " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY") +
            ".xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error fetching data from the API", error);
      }
    },

    // PENJUALAN
    async penjualanDownload() {
      try {
        // Make an API request to fetch data (replace 'apiEndpoint' with your actual API endpoint)
        const response = await axios.post("laporan/penjualan", {
          tanggal1: this.periode.tanggal1,
          tanggal2: this.periode.tanggal2,
        });
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("DETAIL");

        // TITLE
        const titleRow = worksheet.addRow([
          "LAPORAN PENJUALAN - PERIODE : " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " s/d " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
        ]);
        titleRow.font = { bold: true };
        worksheet.addRow([""]);

        // HEADER
        const headerRow = worksheet.addRow([
          "TGL NOTA",
          "NO NOTA",
          "CUSTOMER",
          "PEMBAYARAN",
          "KODE BARANG",
          "NAMA BARANG",
          "UKURAN",
          "UNIT",
          "NAMA JENIS",
          "HARGA JUAL",
          "DISKON",
          "SUBTOTAL",
        ]);
        headerRow.font = { bold: true };

        //FETCH DETAIL
        response.data.data.forEach((item) => {
          worksheet.addRow([
            moment(String(item.tanggal)).format("DD-MM-YYYY"),
            item.no_bukti,
            item.nama,
            item.pembayaran,
            item.kode_bahan,
            item.nama_bahan,
            item.ukuran,
            item.unit,
            item.nm_jenis,
            item.rp_jual,
            item.diskon,
            item.subtotal,
          ]);
        });

        // Save the workbook to a file or download it
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            "Laporan Penerimaan Periode " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " - " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY") +
            ".xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error fetching data from the API", error);
      }
    },

    // LABARUGI DONWLOAD
    async labarugiDownload() {
      try {
        // Make an API request to fetch data (replace 'apiEndpoint' with your actual API endpoint)
        const response = await axios.post("laporan/labarugi", {
          tanggal1: this.periode.tanggal1,
          tanggal2: this.periode.tanggal2,
        });
        console.log(response.data.data);
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();

        // SHEET KHUSUS REKAP
        const rekapsheet = workbook.addWorksheet("REKAP");
        const titleRow = rekapsheet.addRow([
          "LAPORAN REKAP PENJUALAN & LABA RUGI - PERIODE : " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " s/d " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
        ]);
        titleRow.font = { bold: true };
        rekapsheet.addRow([""]);
        const headerRow = rekapsheet.addRow([
          "KODE JENIS",
          "NAMA JENIS",
          "TOTAL (QTY)",
          "TOTAL JUAL (RP)",
          "TOTAL HPP (RP)",
          "TOTAL LABA (RP)",
        ]);
        headerRow.font = { bold: true };
        response.data.rekap.forEach((item) => {
          rekapsheet.addRow([
            item.kd_jenis,
            item.nm_jenis,
            item.tot_qty,
            item.tot_jual,
            item.tot_hpp,
            item.tot_laba,
          ]);
        });
        // END SHEET KHUSUS REKAP

        const groupJenis = [
          ...new Set(response.data.data.map((item) => item.nm_jenis)),
        ];
        let worksheet = "";
        let filterData = [];
        for (let i = 0; i < groupJenis.length; i++) {
          worksheet = workbook.addWorksheet(groupJenis[i]);

          filterData = response.data.data.filter(function (el) {
            return el.nm_jenis == groupJenis[i];
          });

          // TITLE
          const titleRow = worksheet.addRow([
            "LAPORAN PENJUALAN & LABA RUGI - PERIODE : " +
              moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
              " s/d " +
              moment(String(this.periode.tanggal2)).format("DD-MM-YYYY"),
          ]);
          titleRow.font = { bold: true };
          worksheet.addRow([""]);

          // HEADER
          const headerRow = worksheet.addRow([
            "TGL NOTA",
            "NO NOTA",
            "CUSTOMER",
            "PEMBAYARAN",
            "KODE",
            "NAMA BARANG",
            "JENIS",
            "JUMLAH",
            "HARGA JUAL",
            "HARGA HPP",
            "TOTAL JUAL",
            "TOTAL HPP",
            "LABA",
            "TOTAL LABA",
          ]);
          headerRow.font = { bold: true };

          //FETCH DETAIL
          filterData.forEach((item) => {
            worksheet.addRow([
              item.tgl_update,
              item.no_bukti,
              item.nama,
              item.pembayaran,
              item.kode_bahan,
              item.nama_bahan,
              item.nm_jenis,
              item.jumlah,
              item.rp_jual,
              item.harga,
              item.tot_jual,
              item.tot_hpp,
              item.laba,
              item.tot_laba,
            ]);
          });
        }

        // Add data to the worksheet

        // Save the workbook to a file or download it
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            "Laporan Laba Rugi Periode " +
            moment(String(this.periode.tanggal1)).format("DD-MM-YYYY") +
            " - " +
            moment(String(this.periode.tanggal2)).format("DD-MM-YYYY") +
            ".xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error fetching data from the API", error);
      }
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