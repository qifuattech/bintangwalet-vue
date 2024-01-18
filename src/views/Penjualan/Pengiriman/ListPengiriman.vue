<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>LIST PENGIRIMAN</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn color="success" rounded to="/penjualan/pengiriman/input"
                >Tambah Data<v-icon>mdi-plus-thick</v-icon></v-btn
              >
            </div>
            <div>
              <v-text-field
                name="name"
                label="Pencarian"
                outlined
                dense
                hide-details
                v-model="data.search"
              ></v-text-field>
            </div>
            <v-spacer></v-spacer>
            <div>
              <download-excel
                class="btn btn-default"
                worksheet="Data Pengiriman"
                name="Data Pengiriman.xls"
              >
                <v-btn color="success" text
                  >Excel<v-icon>mdi-table-arrow-down</v-icon></v-btn
                >
              </download-excel>
            </div>
            <div>
              <v-btn color="primary" text @click="loadData()"
                >REFRESH<v-icon>mdi-refresh</v-icon></v-btn
              >
            </div>
          </v-card-title>
          <v-card-text>
            <v-card outlined class="mt-2">
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
                <template v-slot:[`item.tanggal`]="{ item }">
                  {{ formatDate(item.tanggal) }}
                </template>
                <template v-slot:[`item.opsi`]="{ item }">
                  <div class="d-flex justify-center">
                    <v-btn
                      color="primary"
                      small
                      class="mr-3"
                      @click="printSj(item.no_sj)"
                      ><v-icon small class="mr-2">mdi-printer</v-icon>SJ</v-btn
                    >
                    <v-btn
                      color="indigo"
                      dark
                      small
                      @click="printInvoice(item.no_bukti)"
                      ><v-icon small class="mr-2">mdi-printer</v-icon
                      >Nota</v-btn
                    >
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- CETAK SURAT JALAN -->
    <v-dialog
      v-model="suratjalan.dialog"
      scrollable
      fullscreen
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card elevation="0">
        <v-col class="pa-0">
          <v-card-title class="py-1 d-flex justify-space-around">
            <div class="text-h4"><strong>BINTANG WALET</strong></div>
            <v-spacer></v-spacer>
            <v-chip label outlined color="black" large
              ><div class="text-h5">SURAT JALAN</div></v-chip
            >
          </v-card-title>
          <hr />
          <v-card-text>
            <!-- HEADER -->
            <table>
              <tr>
                <td>No. Nota</td>
                <td>: {{ suratjalan.items.no_sj }}</td>
              </tr>
              <tr>
                <td>Customer</td>
                <td>: {{ suratjalan.items.nama }}</td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>: {{ formatDate(suratjalan.items.tgl_kirim) }}</td>
              </tr>
            </table>

            <!-- <v-divider class="my-2"></v-divider> -->
            <!-- DETAIL -->
            <table width="100%" class="tabledetail mt-4">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Barang</th>
                  <th>Unit</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in suratjalan.items.detail"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.nama_bahan }}</td>

                  <td align="right">{{ item.unit }}</td>
                  <td align="right">{{ formatNumber(item.jumlah) }}</td>
                </tr>
                <tr>
                  <td align="right" colspan="3">Total Qty</td>
                  <td align="right">
                    <strong>
                      {{ formatNumber(suratjalan.items.tot_qty) }}</strong
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- TOTAL -->

            <div class="d-flex justify-end">
              <v-col cols="3">
                <div class="d-flex justify-center">Admin</div>
                <v-spacer class="my-12"></v-spacer>
                <div class="d-flex justify-center">
                  <u
                    ><strong> {{ invoice.items[0].user }}</strong></u
                  >
                </div>
              </v-col>
            </div>
            <v-divider class="my-2"></v-divider>
          </v-card-text>
        </v-col>
      </v-card>
    </v-dialog>
    <!-- CETAK SURAT JALAN -->

    <!-- CETAK INVOICE -->
    <v-dialog
      v-model="invoice.dialog"
      scrollable
      fullscreen
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card elevation="0">
        <v-col class="pa-0">
          <v-card-title class="py-1 d-flex justify-space-around">
            <div class="text-h4"><strong>BINTANG WALET</strong></div>
            <v-spacer></v-spacer>
            <v-chip label outlined color="black" large
              ><div class="text-h5">NOTA PENJUALAN</div></v-chip
            >
          </v-card-title>
          <hr />
          <v-card-text>
            <!-- HEADER -->
            <table>
              <tr>
                <td>No. Nota</td>
                <td>: {{ invoice.items[0].no_bukti }}</td>
              </tr>
              <tr>
                <td>Pembayaran</td>
                <td>: {{ invoice.items[0].pembayaran.toUpperCase() }}</td>
              </tr>
              <tr>
                <td>Customer</td>
                <td>: {{ invoice.items[0].nama }}</td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>: {{ formatDateTime(invoice.items[0].tgl_update) }}</td>
              </tr>
            </table>

            <!-- <v-divider class="my-2"></v-divider> -->
            <!-- DETAIL -->
            <table width="100%" class="tabledetail mt-4">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Diskon Item</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in invoice.items" :key="item.urut">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.nama_bahan }}</td>
                  <td align="right">{{ formatNumber(item.jumlah) }}</td>
                  <td align="right">{{ formatNumber(item.rp_jual) }}</td>
                  <td align="right">{{ formatNumber(item.diskon_item) }}</td>
                  <td align="right">{{ formatNumber(item.total_item_net) }}</td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Subtotal</td>
                  <td align="right">
                    <strong> {{ formatNumber(invoice.items[0].total) }}</strong>
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Potongan</td>
                  <td align="right">
                    <strong>{{
                      formatNumber(invoice.items[0].potongan)
                    }}</strong>
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Total</td>
                  <td align="right">
                    <strong>{{
                      formatNumber(invoice.items[0].total_net)
                    }}</strong>
                  </td>
                </tr>
                <!-- <tr>
                  <td align="right" colspan="5">Bayar</td>
                  <td align="right">{{ formatNumber(invoice.items[0].bayar) }}</td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Kembali</td>
                  <td align="right">{{ formatNumber(invoice.items[0].total) }}</td>
                </tr> -->
              </tbody>
            </table>
            <!-- TOTAL -->

            <div class="d-flex justify-end">
              <v-col cols="3">
                <div class="d-flex justify-center">Kasir/Admin</div>
                <v-spacer class="my-12"></v-spacer>
                <div class="d-flex justify-center">
                  <u
                    ><strong> {{ invoice.items[0].user }}</strong></u
                  >
                </div>
              </v-col>
            </div>
            <v-divider class="my-2"></v-divider>
          </v-card-text>
        </v-col>
      </v-card>
    </v-dialog>
    <!-- END CETAK INVOICE -->
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: {
        headers: [
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NO SJ", value: "no_sj", divider: true },
          { text: "NO PENJUALAN", value: "no_bukti", divider: true },
          { text: "CUSTOMER", value: "nama", divider: true },
          { text: "JUMLAH", value: "jumlah", divider: true },
          { text: "OPSI", value: "opsi", divider: true },
        ],
        items: [],
        loading: false,
        search: "",
      },
      suratjalan: {
        dialog: false,
        items: [
          {
            no_bukti: "",
            pembayaran: "",
            user: "",
            tgl_update: "",
            total: "",
            diskon: "",
            bayar: "",
            kembali: "",
          },
        ],
      },
      invoice: {
        dialog: false,
        items: [
          {
            no_bukti: "",
            pembayaran: "",
            user: "",
            tgl_update: "",
            total: "",
            diskon: "",
            bayar: "",
            kembali: "",
          },
        ],
      },
      saved: {
        status: false,
        noSj: "",
        noTransaksi: "",
      },
    };
  },
  mounted() {
    this.loadData(0);
  },
  methods: {
    async loadData() {
      this.data.loading = true;
      await axios.post("penjualan/pengiriman").then((res) => {
        if (res.status != 200) {
          this.$notify({ type: "error", text: res.data.error });
          return;
        }
        this.data.items = res.data.data;
      });
      this.data.loading = false;
    },
    printSj(noSj) {
      this.saved.noSj = noSj;
      this.suratjalan.dialog = true;
      this.loadPrintSj();
    },
    async loadPrintSj() {
      console.log("LOAD PRINT SJ");
      await axios
        .post("penjualan/pengiriman/bysj", {
          noSj: this.saved.noSj,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({
              type: "error",
              text: res.data.message,
            });
            return;
          }
          this.suratjalan.items = res.data.data;
          setTimeout(() => {
            window.print();
          }, 1000);
          setTimeout(() => {
            this.suratjalan.dialog = false;
          }, 1000);
        });
    },
    printInvoice(noBukti) {
      this.saved.noTransaksi = noBukti;
      this.invoice.dialog = true;
      this.loadPrintInvoice();
    },
    async loadPrintInvoice() {
      await axios
        .post("penjualan/transaksi/print", {
          noBukti: this.saved.noTransaksi,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({
              type: "error",
              text: res.data.message,
            });
            return;
          }
          this.invoice.items = res.data.data;
          setTimeout(() => {
            window.print();
          }, 1000);
          setTimeout(() => {
            this.invoice.dialog = false;
          }, 1000);
        });
    },
  },
};
</script>

<style scoped>
.tabledetail {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  min-width: 400px;
  border-radius: 5px 5px 0 0;
}

.tabledetail thead tr,
th {
  background-color: #f1f1f1;
  color: #1a1919;
  text-align: center;
  font-weight: bold;
  border-top: 1px solid #303030;
  border-left: 1px solid #303030;
  border-right: 1px solid #303030;
  border-bottom: 1px solid #8b8b8b;
}
.tabledetail th,
.tabledetail td {
  padding: 10px 12px;
}
.tabledetail tbody tr td {
  border-bottom: 1px solid #303030;
  border-left: 1px solid #303030;
  border-right: 1px solid #303030;
}
/* .tabledetail tbody tr:nth-of-type(even) {
  background: #f3f3f3;
} */
.tabledetail tbody tr:last-of-type {
  border-bottom: 2px solid #525252;
}
</style>