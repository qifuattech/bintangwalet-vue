<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-start">
        <div>
          <v-btn color="primary" text to="/penjualan/pengiriman" class="mr-3"
            ><v-icon large>mdi-arrow-left-bold</v-icon></v-btn
          >
        </div>
        <!-- <div class="text-h5 mt-1">INPUT PENGIRIMAN</div> -->
        <h2 class="mt-1">INPUT PENGIRIMAN</h2>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row>
      <v-col cols="auto" lg="6">
        <v-card outlined>
          <v-card-text>
            <v-text-field
              label="No. Pengiriman (Otomatis)"
              dense
              outlined
              append-icon="mdi-truck"
              readonly
              background-color="blue-grey lighten-5"
            ></v-text-field>
            <v-menu
              v-model="data.pickerTanggal"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Tanggal"
                  :value="formatDate(data.tanggal)"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  dense
                  outlined
                  background-color="light-blue lighten-5"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="data.tanggal"
                @input="data.pickerTanggal = false"
              ></v-date-picker>
            </v-menu>
            <div class="d-flex justify-space-around">
              <v-text-field
                label="No. Transaksi"
                dense
                outlined
                class="mr-2"
                readonly
                :value="data.noTransaksi"
              ></v-text-field>
              <v-btn color="light-blue lighten-4" @click="showTransaksi()"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="auto" lg="6">
        <v-card outlined>
          <v-card-text>
            <v-text-field
              label="Customer"
              :value="data.namaCustomer"
              dense
              outlined
              append-icon="mdi-account"
              readonly
              background-color="blue-grey lighten-5"
            ></v-text-field>
            <v-text-field
              label="Alamat Customer"
              :value="data.alamatCustomer"
              dense
              outlined
              append-icon="mdi-map-marker"
              readonly
              background-color="blue-grey lighten-5"
            ></v-text-field>
            <v-text-field
              label="Tanggal Transaksi"
              :value="formatDate(data.tanggalTrans)"
              dense
              outlined
              append-icon="mdi-calendar-blank-outline"
              readonly
              background-color="blue-grey lighten-5"
            ></v-text-field>
            <!-- <v-text-field
              label="Alamat"
              dense
              outlined
              append-icon="mdi-calendar-blank-outline"
              readonly
              background-color="blue-grey lighten-5"
            ></v-text-field> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-card outlined>
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
              </v-data-table>
            </v-card>
            <div class="d-flex justify-end mt-4">
              <v-btn
                color="primary"
                @click="printSj()"
                class="mr-3"
                v-if="saved.status"
                ><v-icon class="mr-2">mdi-printer-check</v-icon> Cetak Surat
                Jalan</v-btn
              >
              <v-btn
                color="primary"
                @click="printInvoice()"
                class="mr-3"
                v-if="saved.status"
                ><v-icon class="mr-2">mdi-printer-check</v-icon>Cetak
                Invoice</v-btn
              >
              <v-btn color="success" @click="create()" :disabled="!isValid"
                ><v-icon class="mr-2">mdi-floppy</v-icon> SIMPAN</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="transaksi.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card class="pb-4">
        <v-card-title> LIST TRANSAKSI PENJUALAN </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-card outlined>
            <v-data-table
              :headers="transaksi.headers"
              :items="transaksi.items"
              :loading="transaksi.loading"
              :search="transaksi.search"
              dense
            >
              <template v-slot:[`item.tanggal`]="{ item }">
                {{ formatDate(item.tanggal) }}
              </template>
              <template v-slot:[`item.opsi`]="{ item }">
                <v-btn
                  text
                  @click="pilihTransaksi(item.no_bukti)"
                  color="primary"
                  ><v-icon>mdi-check-bold</v-icon></v-btn
                >
              </template>
            </v-data-table>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

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
                    <strong> {{ formatNumber(suratjalan.items.tot_qty)}}</strong>
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
                  <td align="right">
                    {{ formatNumber(item.jumlah * item.rp_jual) }}
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Total</td>
                  <td align="right">
                    <strong>
                      {{ formatNumber(invoice.items[0].total_kotor) }}</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Total Diskon</td>
                  <td align="right">
                    <strong>{{ formatNumber(invoice.items[0].diskon) }}</strong>
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="5">Total Bersih</td>
                  <td align="right">
                    <strong>{{
                      formatNumber(invoice.items[0].total_net)
                    }}</strong>
                  </td>
                </tr>
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

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      data: {
        headers: [
          { text: "KODE BARANG", value: "kode_bahan", divider: true },
          { text: "NAMA BARANG", value: "nama_bahan", divider: true },
          { text: "JUMLAH", value: "jumlah" },
        ],
        items: [],
        loading: false,
        search: "",
        pickerTanggal: false,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        kodeCustomer: "",
        namaCustomer: "",
        alamatCustomer: "",
        tanggalTrans: "",
        noTransaksi: "",
        jenisBayar: "",
        total_net: "",
        total: "",
        totalUp: "",
        diskon: "",
        bayar: "",
        potongan: "",
        user: this.$store.state.auth.user.name,
      },
      transaksi: {
        dialog: false,
        headers: [
          { text: "NO. TRANS", value: "no_bukti", divider: true },
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NAMA CUST.", value: "nama", divider: true },
          { text: "ALAMAT", value: "alamat", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
        noBukti: "",
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
            total_kotor: "",
            total_net: "",
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
  methods: {
    showTransaksi() {
      this.transaksi.dialog = true;
      this.loadTransaksi();
    },
    async loadTransaksi() {
      this.data.items = [];
      this.data.loading = true;
      await axios.post("penjualan/transaksi/forpengiriman").then((res) => {
        if (res.status != 200) {
          this.$notify({ type: "error", text: res.data.error });
          return;
        }
        this.transaksi.items = res.data.data;
      });
      this.data.loading = false;
    },
    pilihTransaksi(noBukti) {
      this.transaksi.noBukti = noBukti;
      this.transaksi.dialog = false;
      this.loadTransaksiDetail();
    },
    async loadTransaksiDetail() {
      await axios
        .post("penjualan/transaksi/bytransaksi", {
          noBukti: this.transaksi.noBukti,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.data.items = res.data.data.detail;
          this.data.noTransaksi = res.data.data.no_bukti;
          this.data.kodeCustomer = res.data.data.kd_customer;
          this.data.namaCustomer = res.data.data.nama;
          this.data.alamatCustomer = res.data.data.alamat;
          this.data.tanggalTrans = res.data.data.tgl_update;
          this.data.jenisBayar = res.data.data.pembayaran;
          this.data.total_net = res.data.data.total_net;
        });
    },
    async create() {
      await axios.post("penjualan/pengiriman/create", this.data).then((res) => {
        if (res.status != 200) {
          swal("Gagal", res.data.message, "error");
          return;
        }
        swal("Sukses", res.data.message, "success");
        this.saved.status = true;
        this.saved.noSj = res.data.no_bukti;
        this.saved.noTransaksi = this.data.noTransaksi;
        this.resetAll();
        // swal("Sukses", res.data.message, "success", {
        //   buttons: {
        //     cetak: true,
        //   },
        // }).then((value) => {
        //   switch (value) {
        //     case "cetak":
        //       this.printSj();
        //       this.printInvoice();
        //       break;

        //     default:
        //       this.printSj();
        //       this.printInvoice();
        //       break;
        //   }
        // });
      });
    },
    printSj() {
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
    printInvoice() {
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
    resetAll() {
      this.data.kodeCustomer = "";
      this.data.namaCustomer = "";
      this.data.alamatCustomer = "";
      this.data.tanggalTrans = "";
      this.data.noTransaksi = "";
      this.data.items = [];
    },

  },
  computed: {
    isValid() {
      if (
        this.data.items.length > 0 &&
        this.data.kodeCustomer != "" &&
        this.data.noTransaksi != ""
      ) {
        return true;
      } else {
        return false;
      }
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