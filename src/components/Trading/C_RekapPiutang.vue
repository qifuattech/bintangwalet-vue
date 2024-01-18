<template>
  <v-container>
    <v-row>
      <v-col cols="9" class="pa-0 pr-3">
        <v-card>
          <v-progress-linear
            :indeterminate="progressRekap"
            v-if="progressRekap"
          >
          </v-progress-linear>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(item, index) in arrData"
                :key="index"
                cols="4"
                class="px-6"
              >
                <v-card elevation="0" outlined>
                  <v-card-title class="py-1 d-flex justify-center">
                    {{ item.nama_jenis }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="py-2">
                    <v-row>
                      <!-- PEMASUKAN -->
                      <v-col cols="6 px-1">
                        <v-card color="success" dark>
                          <v-card-title
                            class="py-1 d-flex justify-center header-mutasi"
                            >Pemasukan</v-card-title
                          >
                          <v-divider></v-divider>
                          <v-card-text class="d-flex justify-center py-0">
                            <v-btn text @click="showDataPemasukan(item.alias)"
                              ><h4>
                                {{ getFormatNumber(item.pemasukan) }}
                              </h4></v-btn
                            >
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <!-- PENGELUARAN -->
                      <v-col cols="6 px-1">
                        <v-card color="warning" dark>
                          <v-card-title
                            class="py-1 d-flex justify-center header-mutasi"
                            >Penjualan</v-card-title
                          >
                          <v-divider></v-divider>
                          <v-card-text class="d-flex justify-center py-0">
                            <v-btn text @click="showDataPenjualan(item.alias)"
                              ><h4>{{ getFormatNumber(item.penjualan) }}</h4>
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-divider vertical></v-divider> -->

      <!-- TOTAL -->
      <v-col cols="3" class="pa-0">
        <v-card>
          <v-card-title class="py-2 d-flex justify-center">
            <strong>TOTAL</strong>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-1">
            <!-- SALDO AWAL -->
            <v-col cols="12">
              <v-card color="primary" dark>
                <v-card-title class="py-2 d-flex justify-center"
                  >Saldo Awal</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="py-2 d-flex justify-center">
                  <v-progress-circular
                    :indeterminate="progressRekap"
                    v-if="progressRekap"
                  ></v-progress-circular>
                  <v-btn text v-if="!progressRekap"
                    ><h2>
                      {{ getFormatNumber(totalRpSaldoAwal(arrData)) }}
                    </h2></v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>

            <!-- PEMASUKAN -->
            <v-col cols="12">
              <v-card color="success" dark>
                <v-card-title class="py-2 d-flex justify-center"
                  >Total Pemasukan</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="py-2 d-flex justify-center">
                  <v-progress-circular
                    :indeterminate="progressRekap"
                    v-if="progressRekap"
                  ></v-progress-circular>
                  <v-btn
                    text
                    @click="showDataPemasukan('0')"
                    v-if="!progressRekap"
                    ><h2>
                      {{ getFormatNumber(totalRpPemasukan(arrData)) }}
                    </h2></v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>

            <!-- PENGELUARAN -->
            <v-col cols="12">
              <v-card color="warning" dark>
                <v-card-title class="py-2 d-flex justify-center"
                  >Total Penjualan</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="py-2 d-flex justify-center">
                  <v-progress-circular
                    :indeterminate="progressRekap"
                    v-if="progressRekap"
                  ></v-progress-circular>
                  <v-btn
                    text
                    @click="showDataPenjualan('0')"
                    v-if="!progressRekap"
                    ><h2>
                      {{ getFormatNumber(totalRpPenjualan(arrData)) }}
                    </h2></v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>

            <!-- SALDO AKHIR -->
            <v-col cols="12">
              <v-card color="primary" dark>
                <v-card-title class="py-2 d-flex justify-center"
                  >Saldo Akhir</v-card-title
                >
                <v-divider></v-divider>
                <v-card-text class="py-2 d-flex justify-center">
                  <v-progress-circular
                    :indeterminate="progressRekap"
                    v-if="progressRekap"
                  ></v-progress-circular>
                  <v-btn text v-if="!progressRekap"
                    ><h2>
                      {{ getFormatNumber(totalRpSaldoAkhir(arrData)) }}
                    </h2></v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- PEMASUKAN -->
    <v-dialog
      v-model="dialogPemasukan"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card class="py-5">
        <v-card-title>
          <v-col>
            <div class="d-flex justify-space-between">
              Detail Pemasukan
              <download-excel
                :data="arrDataPemasukan"
                :fields="json_fields"
                worksheet="DetailPemasukan"
                name="DetailPemasukan.xls"
              >
                <v-btn color="success" text
                  ><v-icon>mdi-file-excel</v-icon
                  ><v-icon>mdi-download</v-icon>Download Detail Pemasukan</v-btn
                >
              </download-excel>
            </div>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="cariPemasukan"
            label="Pencarian"
          ></v-text-field>

          <v-data-table
            :headers="gridHeaderPemasukan"
            :items="arrDataPemasukan"
            :loading="progressPemasukan"
            :search="cariPemasukan"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PENJUALAN -->
    <v-dialog
      v-model="dialogPenjualan"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card class="py-5">
        <v-card-title>
          <v-col class="d-flex justify-space-between">
            Detail Penjualan

            <download-excel
              :data="arrDataPenjualan"
              :fields="json_fields"
              worksheet="DetailPenjualan"
              name="DetailPenjualan.xls"
            >
              <v-btn color="success" text
                ><v-icon>mdi-file-excel</v-icon
                ><v-icon>mdi-download</v-icon>Download Detail Penjualan</v-btn
              >
            </download-excel>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="cariPenjualan"
            label="Pencarian"
          ></v-text-field>
          <v-data-table
            :headers="gridHeaderPenjualan"
            :items="arrDataPenjualan"
            :loading="progressPenjualan"
            :search="cariPenjualan"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <v-row>
      <v-col>
        <v-card>
          <v-card-title> REKAP PIUTANG {{ periode }}</v-card-title>
          <v-card-title>
            <v-data-table
              :headers="gridHeaders"
              :items="arrData"
              elevation-1
              hide-default-footer
              dense
              :loading="progress"
            >
              <template v-slot:[`item.nama_jenis`]="{ item }">
                <strong>{{ item.nama_jenis }}</strong>
              </template>
              <template v-slot:[`item.saldo_awal`]="{ item, index }">
                <div v-if="index == arrData.length - 1" class="py-3">
                  <v-chip
                    color="successs"
                    outlined
                    @click="showDetail(item.alias)"
                  >
                    <strong>
                      {{ getFormatNumber(item.saldo_awal) }}</strong
                    ></v-chip
                  >
                </div>
                <div v-else>
                  <v-chip
                    small
                    color="white"
                    @click="showDetail(item.alias, saldo_awal)"
                  >
                    {{ getFormatNumber(item.saldo_awal) }}</v-chip
                  >
                </div>
              </template>
              <template v-slot:[`item.pemasukan`]="{ item, index }">
                <div v-if="index == arrData.length - 1" class="py-2">
                  <v-chip
                    color="successs"
                    outlined
                    @click="showDetail(item.alias)"
                  >
                    <strong>
                      {{ getFormatNumber(item.pemasukan) }}</strong
                    ></v-chip
                  >
                </div>
                <div v-else>
                  <v-chip small color="white" @click="showDetail(item.alias)">
                    {{ getFormatNumber(item.pemasukan) }}</v-chip
                  >
                </div>
              </template>
              <template v-slot:[`item.penjualan`]="{ item, index }">
                <div v-if="index == arrData.length - 1" class="py-2">
                  <v-chip
                    color="successs"
                    outlined
                    @click="showDetail(item.alias)"
                  >
                    <strong>
                      {{ getFormatNumber(item.penjualan) }}</strong
                    ></v-chip
                  >
                </div>
                <div v-else>
                  <v-chip small color="white" @click="showDetail(item.alias)">
                    {{ getFormatNumber(item.penjualan) }} {{ index }}</v-chip
                  >
                </div>
              </template>
              <template v-slot:[`item.saldo_akhir`]="{ item, index }">
                <div v-if="index == arrData.length - 1" class="py-2">
                  <v-chip
                    color="successs"
                    outlined
                    @click="showDetail(item.alias)"
                  >
                    <strong>
                      {{ getFormatNumber(item.saldo_akhir) }}</strong
                    ></v-chip
                  >
                </div>
                <div v-else>
                  <v-chip small color="white" @click="showDetail(item.alias)">
                    {{ getFormatNumber(item.saldo_akhir) }}</v-chip
                  >
                </div>
              </template>
            </v-data-table>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>DETAIL REKAP {{ jenisTrans }}</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="gridDetailHeaders"
              :items="arrDetail"
              class="elevation-1"
              :loading="progressDetail"
              dense
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
import numeral from "numeral";

export default {
  props: ["periode"],
  data() {
    return {
      gridHeaders: [
        { text: "MARKETPLACE", value: "nama_jenis" },
        { text: "SALDO AWAL", value: "saldo_awal", align: "right" },
        { text: "PEMASUKAN", value: "pemasukan", align: "right" },
        { text: "PENJUALAN", value: "penjualan", align: "right" },
        { text: "SALDO AKHIR", value: "saldo_akhir", align: "right" },
      ],

      gridDetailHeaders: [
        { text: "TANGGAL", value: "tanggal" },
        { text: "NO. BUKTI", value: "no_bukti" },
        { text: "KETERANGAN", value: "keterangan" },
        { text: "NAMA", value: "nama" },
        { text: "MARKETPLACE", value: "jenis_penjualan" },
        { text: "RP.", value: "pemasukan", align: "right" },
      ],

      gridHeaderPemasukan: [
        { text: "TANGGAL", value: "tgl_faktur" },
        { text: "NO. BUKTI", value: "no_faktur" },
        { text: "NO. PO", value: "no_po" },
        { text: "JENIS PENJUALAN", value: "jenis_penjualan" },
        { text: "CUSTOMER", value: "nama_customer" },
        { text: "BO", value: "nama_bo" },
        { text: "RP.", value: "pemasukan", align: "right" },
        { text: "STATUS LUNAS", value: "sta_lunas" },
      ],

      gridHeaderPenjualan: [
        { text: "TANGGAL", value: "tgl_faktur" },
        { text: "NO. BUKTI", value: "no_faktur" },
        { text: "NO. PO", value: "no_po" },
        { text: "JENIS PENJUALAN", value: "jenis_penjualan" },
        { text: "CUSTOMER", value: "nama_customer" },
        { text: "BO", value: "nama_bo" },
        { text: "RP.", value: "rp_faktur", align: "right" },
        { text: "STATUS LUNAS", value: "sta_lunas" },
      ],

      json_fields: {
        TANGGAL: "tgl_faktur",
        "NO. BUKTI": "no_faktur",
        "NO. PO": "no_po",
        "JENIS PENJUALAN": "jenis_penjualan",
        CUSTOMER: "nama_customer",
        BO: "nama_bo",
        "RUPIAH.": "rp_faktur",
        STATUS: "sta_lunas",
      },
      arrData: [],
      arrDetail: [],

      arrDataPemasukan: [],
      arrDataPenjualan: [],
      progress: true,
      progressDetail: true,

      progressRekap: true,

      progressPemasukan: true,
      progressPenjualan: true,
      jenisTrans: "",

      dialogPemasukan: false,
      dialogPenjualan: false,

      cariPemasukan: "",
      cariPenjualan: "",
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    showDataPemasukan(jenisPenjualan) {
      this.dialogPemasukan = true;
      this.progressPemasukan = true;
      this.arrDataPemasukan = [];
      axios
        .get("transaksitrading/detailpemasukan/" + jenisPenjualan + "/3/2022")
        .then((res) => {
          this.arrDataPemasukan = res.data.data;
          this.progressPemasukan = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showDataPenjualan(jenisPenjualan) {
      this.dialogPenjualan = true;
      this.progressPenjualan = true;
      this.arrDataPenjualan = [];
      axios
        .get("transaksitrading/detailpenjualan/" + jenisPenjualan + "/3/2022")
        .then((res) => {
          this.arrDataPenjualan = res.data.data;
          this.progressPenjualan = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showDetail(alias) {
      this.progressDetail = true;
      this.loadDetail(alias);
    },
    async loadDetail(alias) {
      console.log(alias);
      await axios
        .get(
          this.$store.state.apiServer +
            "transaksitrading/detailrekappiutang/pemasukan/splh/03/2022"
        )
        .then((res) => {
          console.log(res.data.data);
          this.arrDetail = res.data.data;
          this.progressDetail = false;
        })
        .catch((err) => {
          console.log(err.data.data);
        });
    },
    getFormatNumber(rp) {
      return numeral(rp).format("0,2");
    },
    totalRpSaldoAwal(items) {
      let sum = 0;
      for (let value in items) {
        sum += parseInt(items[value]["saldo_awal"]);
      }
      return sum;
    },
    totalRpPemasukan(items) {
      let sum = 0;
      for (let value in items) {
        sum += parseInt(items[value]["pemasukan"]);
      }
      return sum;
    },
    totalRpPenjualan(items) {
      let sum = 0;
      for (let value in items) {
        sum += parseInt(items[value]["penjualan"]);
      }
      return sum;
    },
    totalRpSaldoAkhir(items) {
      let sum = 0;
      for (let value in items) {
        sum += parseInt(items[value]["saldo_akhir"]);
      }
      return sum;
    },
    loadData() {
      this.progressRekap = true;
      axios
        .get(
          this.$store.state.apiServer +
            "transaksitrading/monpiutang-jenispenjualan/3/2022"
        )
        .then((res) => {
          console.log(res.data.data);
          this.arrData = res.data.data;
          this.progress = false;
          this.progressDetail = false;
          this.progressRekap = false;
          // this.arrData.push({
          //   ...{
          //     nama_jenis: "TOTAL",
          //     saldo_awal: this.totalRpSaldoAwal(this.arrData),
          //     pemasukan: this.totalRpPemasukan(this.arrData),
          //     penjualan: this.totalRpPenjualan(this.arrData),
          //     saldo_akhir: this.totalRpSaldoAkhir(this.arrData),
          //   },
          // });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    totalRpSaldoAkhir_2() {
      let sum = 0;
      for (let value in this.arrData) {
        sum += parseInt(this.arrData[value]["saldo_akhir"]);
      }
      return sum;
    },
  },
};
</script>

<style>
.header-mutasi {
  font-size: 1rem;
}
</style>