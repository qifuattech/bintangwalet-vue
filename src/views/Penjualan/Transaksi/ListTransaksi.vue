<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>LIST TRANSAKSI PENJUALAN</h2>
        <!-- <div class="text-h5">LIST TRANSAKSI PENJUALAN</div> -->
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card elevation="0" rounded="lg">
          <v-card-text>
            <div class="d-flex justify-space-between">
              <div class="mr-4">
                <v-btn color="success" rounded to="/penjualan/transaksi/input"
                  ><v-icon>mdi-plus-thick</v-icon>Tambah Penjualan</v-btn
                >
              </div>
              <div class="mr-2">
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
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periode.tanggal1"
                    @change="loadData()"
                    @input="periode.pickerTanggal1 = false"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div class="mr-2">
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
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="periode.tanggal2"
                    @change="loadData()"
                    @input="periode.pickerTanggal2 = false"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div>
                <v-text-field
                  v-model="data.search"
                  label="Pencarian"
                  clearable
                  dense
                  outlined
                  class="mr-2"
                  append-icon="mdi-magnify"
                ></v-text-field>
              </div>
              <v-spacer></v-spacer>
              <v-btn color="success" text
                >Excel <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn color="primary" text @click="loadData()"
                >Refresh <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>

            <v-card outlined>
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
                <template v-slot:[`item.tanggal`]="{ item }">
                  {{ formatDateTime2(item.tgl_update) }}
                </template>
                <template v-slot:[`item.pembayaran`]="{ item }">
                  {{ item.pembayaran.toUpperCase() }}
                </template>
                <template v-slot:[`item.detail`]="{ item }">
                  <v-list-item
                    two-line
                    v-for="(detail, index) in item.detail"
                    :key="index"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{
                        detail.nama_bahan
                      }}</v-list-item-title>
                      <v-list-item-subtitle class="d-flex justify-space-around"
                        >{{ detail.jumlah }} x {{ detail.rp_jual }} Disc.
                        {{ detail.diskon_item }} <v-spacer></v-spacer> 
                        {{
                          formatNumber(detail.jumlah * (detail.rp_jual - detail.diskon_item)) 
                        }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-slot:[`item.total_kotor`]="{ item }">
                  {{ formatNumber(item.total_kotor) }}
                </template>

                <template v-slot:[`item.diskon`]="{ item }">
                  {{ formatNumber(item.diskon) }}
                </template>
                <template v-slot:[`item.total_net`]="{ item }">
                  {{ formatNumber(item.total_net) }}
                </template>
                <template v-slot:[`item.bayar`]="{ item }">
                  {{ formatNumber(item.bayar) }}
                </template>
                <template v-slot:[`item.kembali`]="{ item }">
                  {{ formatNumber(item.kembali) }}
                </template>
                <template v-slot:[`item.opsi`]="{ item }">
                  <v-btn color="primary" text @click="print(item.no_bukti)"
                    ><v-icon>mdi-receipt</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
                  <th>Satuan</th>
                  <th>Jumlah</th>
                  <th>Harga Satuan</th>
                  <th>Subtotal</th>
                  <th>Diskon</th>
                  
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in invoice.items" :key="item.urut">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.nama_bahan }}</td>
                  <td>{{ item.unit }}</td>
                  <td align="right">{{ formatNumber(item.jumlah) }}</td>
                  <td align="right">{{ formatNumber(item.rp_jual) }}</td>
                  <td align="right">
                    {{ formatNumber(item.jumlah * item.rp_jual) }}
                  </td>
                  <td align="right">
                    <!-- {{ formatNumber(item.jumlah * item.diskon_item) }} -->
                    <!-- @{{ formatNumber(item.diskon_item) }} = -->
                    {{ formatNumber(item.jumlah * item.diskon_item) }}
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="6">Total Rp.</td>
                  <td align="right">
                    <strong>
                      {{ formatNumber(invoice.items[0].total_kotor) }}</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="6">Total Diskon Rp.</td>
                  <td align="right">
                    <strong>{{ formatNumber(invoice.items[0].diskon) }}</strong>
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="6">Total Pembayaran Rp.</td>
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
  </v-container>
</template>

<script>
import axios from "axios";
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
      data: {
        headers: [
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NO. BUKTI", value: "no_bukti", divider: true },
          { text: "METODE", value: "pembayaran", divider: true },
          { text: "CUSTOMER", value: "nama", divider: true },
          { text: "DETAIL", value: "detail", divider: true },
          // {
          //   text: "JUMLAH BARANG",
          //   value: "jumlah_brg",
          //   align: "right",
          //   divider: true,
          // },
          // {
          //   text: "JUMLAH QTY",
          //   value: "jumlah_qty",
          //   align: "right",
          //   divider: true,
          // },
          {
            text: "TOTAL TRANSAKSI",
            value: "total_kotor",
            align: "right",
            divider: true,
          },
          {
            text: "TOTAL DISKON",
            value: "diskon",
            align: "right",
            divider: true,
          },
          {
            text: "TOTAL BERSIH",
            value: "total_net",
            align: "right",
            divider: true,
          },
          {
            text: "BAYAR",
            value: "bayar",
            align: "right",
            divider: true,
          },
          // {
          //   text: "KEMBALI",
          //   value: "kembali",
          //   align: "right",
          //   divider: true,
          // },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
        noBukti: "",
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
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.data.loading = true;
      await axios
        .post("penjualan/transaksi", {
          tanggal1 : this.periode.tanggal1,
          tanggal2 : this.periode.tanggal2,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.message });
            return;
          }
          this.data.items = res.data.data;
          this.$notify({ type: "succcess", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });
      this.data.loading = false;
    },
    print(noBukti) {
      this.data.noBukti = noBukti;
      this.invoice.dialog = true;
      this.loadPrint();
      setTimeout(() => {
        window.print();
      }, 1000);
      setTimeout(() => {
        this.invoice.dialog = false;
      }, 1000);
    },
    resetItems() {
      this.invoice.items = [
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
      ];
    },
    async loadPrint() {
      this.resetItems();
      await axios
        .post("penjualan/transaksi/print", {
          noBukti: this.data.noBukti,
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
  padding: 12px 15px;
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