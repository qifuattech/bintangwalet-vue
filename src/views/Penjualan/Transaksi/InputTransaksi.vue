<template>
  <v-container>
    <!-- INPUT DOC -->
    <v-row>
      <v-col>
        <h2>INPUT TRANSAKSI PENJUALAN</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-0">
      <!-- FORM DOC (TANGGAL, KASIR, CUSTOMER) -->
      <v-col lg="4">
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col>
                <!-- <div class="d-flex justify-space-around">
                  <v-text-field
                    name="name"
                    label="No. Nota"
                    id="id"
                    dense
                    outlined
                    class="mr-2"
                    readonly
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-btn><v-icon>mdi-eye</v-icon></v-btn>
                </div> -->
                <div class="d-flex justify-space-around">
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
                        class="mr-2"
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
                  <v-text-field
                    :value="$store.state.auth.user.name.toUpperCase()"
                    label="Admin"
                    id="id"
                    dense
                    outlined
                    readonly
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                </div>
                <div class="d-flex justify-space-around">
                  <v-text-field
                    :value="data.namaCustomer + ' - ' + data.kodeCustomer"
                    name="name"
                    label="Customer"
                    id="id"
                    dense
                    outlined
                    class="mr-2"
                    readonly
                    background-color="blue-grey lighten-5"
                    hide-details
                  ></v-text-field>
                  <v-btn @click="showCustomer()" color="light-blue lighten-4"
                    ><v-icon>mdi-magnify</v-icon></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- END FORM DOC (TANGGAL, KASIR, CUSTOMER)-->

      <!-- PILIH JENIS PEMBAYARAN -->
      <v-col lg="4">
        <v-card outlined class="fill-height">
          <v-card-text>
            <!-- <div class="text-h6">PEMBAYARAN</div>
            <v-divider></v-divider> -->
            <v-card elevation="0">
              <v-card-text class="py-0">
                <v-radio-group
                  dense
                  mandatory
                  v-model="data.jenisBayar"
                  value="tunai"
                >
                  <v-row>
                    <v-col cols="6">
                      <v-radio label="TUNAI" value="tunai" dense></v-radio>
                      <v-radio label="KREDIT" value="kredit" dense></v-radio>
                    </v-col>
                    <v-col cols="6">
                      <v-radio
                        label="TRANSFER"
                        value="transfer"
                        dense
                      ></v-radio>
                      <v-radio label="EDC" value="edc" dense></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- END PILIH JENIS PEMBAYARAN -->

      <!-- TOTAL TRANSAKSI -->
      <v-col lg="4">
        <v-card outlined rounded="xl">
          <v-card-text>
            <v-row>
              <v-col>
                <v-card elevation="0" class="text-h3 font-weight-bold pa-3">
                  <div class="d-flex justify-space-around">
                    <div>Rp.</div>
                    <v-spacer></v-spacer>
                    <div>{{ formatNumber(totalBersihTransaksi()) }}</div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- END TOTAL TRANSAKSI -->
    </v-row>
    <!-- END INPUT DOC -->

    <!-- FORM DETAIL (LIST ITEM, FOOTER) -->
    <v-row class="mt-0">
      <!-- FORM DETAIL -->
      <v-col cols="4">
        <v-card outlined>
          <v-card-text>
            <div class="d-flex justify-space-around">
              <v-text-field
                v-model="form.barcode"
                label="Scan Barcode"
                :hint="form.nama_bahan + ' - ' + form.kode_bahan"
                persistent-hint
                dense
                outlined
                class="mr-2"
                v-on:keyup.13="loadScan"
                ref="inputScan"
                background-color="light-blue lighten-5"
                prepend-inner-icon="mdi-barcode-scan"
              ></v-text-field>
              <v-btn @click="showBarang()" color="light-blue lighten-4"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
            </div>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Jumlah"
                  v-model="form.jumlah"
                  append-icon="mdi-pencil-outline"
                  @input="proteksiStok()"
                  type="number"
                  dense
                  outlined
                  v-on:keyup.13="$refs.inputRpJual.focus()"
                  ref="inputJumlah"
                  background-color="light-blue lighten-5"
                ></v-text-field>
                <v-text-field
                  label="Stock"
                  :value="form.stok"
                  type="number"
                  readonly
                  dense
                  outlined
                  background-color="blue-grey lighten-5"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Harga"
                  v-model="form.rp_jual"
                  ref="inputRpJual"
                  v-on:keyup.13="$refs.inputDiskonPersen.focus()"
                  type="number"
                  dense
                  outlined
                  background-color="light-blue lighten-5"
                ></v-text-field>
                <v-text-field
                  label="Subtotal"
                  :value="form.jumlah * form.rp_jual"
                  type="number"
                  dense
                  outlined
                  readonly
                  background-color="blue-grey lighten-5"
                ></v-text-field>
                <!-- <v-text-field
                  label="Harga Up"
                  v-model="form.harga_up"
                  type="number"
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Jumlah Up"
                  v-model="form.jumlah_up"
                  type="number"
                  dense
                  outlined
                ></v-text-field> -->
              </v-col>
            </v-row>

            <v-divider class="mb-4"></v-divider>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Diskon %"
                  v-model="form.diskon_persen"
                  dense
                  outlined
                  type="number"
                  ref="inputDiskonPersen"
                  v-on:keyup.13="tambahItem(), $refs.inputScan.focus()"
                  append-icon="mdi-percent"
                  background-color="light-blue lighten-5"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Diskon Item"
                  v-model="form.diskon"
                  dense
                  outlined
                  readonly
                  type="number"
                  background-color="blue-grey lighten-5"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="mb-4"></v-divider>
            <div class="d-flex justify-end">
              <v-btn
                v-if="form.staEdit"
                color="warning"
                
                small
                rounded
                @click="updateItem()"
                >UPDATE <v-icon small>mdi-pen</v-icon></v-btn
              >
              <v-btn
                v-else
                color="success"
                small
                rounded
                @click="tambahItem()"
                outlined
                >TAMBAHKAN <v-icon small>mdi-plus-thick</v-icon></v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- END FORM DETAIL -->

      <v-col cols="8">
        <!--LIST ITEMS -->
        <v-card outlined>
          <v-data-table
            :headers="data.headers"
            :items="data.items"
            :loading="data.loading"
            :search="data.search"
            dense
            hide-default-footer
            :items-per-page="100"
          >
            <template v-slot:[`item.subtotal`]="{ item }">
              {{ item.jumlah * item.rp_jual }}
            </template>
            <template v-slot:[`item.subtotal_up`]="{ item }">
              {{ item.jumlah_up * item.harga_up }}
            </template>
            <template v-slot:[`item.diskon_fix`]="{ item }">
              {{ item.diskon }}
            </template>
            <template v-slot:[`item.opsi`]="{ index }">
              <div class="d-flex justify-start">
                <v-btn color="primary" text @click="editItem(index)" x-small
                  ><v-icon small>mdi-pen</v-icon></v-btn
                >
                <v-btn color="error" text @click="deleteItem(index)" x-small
                  ><v-icon small>mdi-trash-can-outline</v-icon></v-btn
                >
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- END LIST ITEMS -->
        <!-- FOOTER -->
        <v-row class="mt-0">
          <v-col>
            <v-card outlined>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      label="Total"
                      :value="formatNumber(totalKotorTransaksi())"
                      readonly
                      dense
                      outlined
                      background-color="blue-grey lighten-5"
                    ></v-text-field>
                    <!-- <v-text-field
                      label="Potongan"
                      v-model="data.potongan"
                      dense
                      outlined
                      background-color="light-blue lighten-5"
                    ></v-text-field> -->
                    <v-text-field
                      label="Diskon Total"
                      :value="formatNumber(totalDiskon())"
                      dense
                      outlined
                      readonly
                      background-color="blue-grey lighten-5"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="Grand Total"
                      :value="formatNumber(totalBersihTransaksi())"
                      dense
                      outlined
                      readonly
                      class="text-h5"
                      background-color="blue-grey lighten-5"
                    ></v-text-field>
                    <div class="d-flex justify-space-aorund">
                      <v-text-field
                        label="Bayar"
                        v-model="data.bayar"
                        dense
                        outlined
                        type="number"
                        class="text-h5"
                        :disabled="!staTunai()"
                        background-color="light-blue lighten-5"
                      ></v-text-field>
                    </div>
                    <v-text-field
                      label="Kembalian"
                      :value="formatNumber(kembalian())"
                      readonly
                      dense
                      outlined
                      class="text-h5"
                      background-color="blue-grey lighten-5"
                    ></v-text-field>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col cols="4">
                    <div class="mb-2 d-flex justify-center">
                      <v-btn large @click="resetAll()"
                        >RESET <v-icon>mdi-refresh-circle</v-icon></v-btn
                      >
                    </div>
                    <div class="d-flex justify-center">
                      <v-btn
                        color="success"
                        large
                        @click="createData()"
                        :disabled="!isValid"
                        :loading="data.loading"
                        >SIMPAN<v-icon>mdi-floppy</v-icon></v-btn
                      >
                    </div>
                    <!-- <div>
                      <v-btn rounded @click="devCreate()"
                        ><v-icon>mdi-printer</v-icon></v-btn
                      >
                    </div> -->
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- END FOOTER -->
      </v-col>
    </v-row>
    <!-- END FORM DETAIL (LIST ITEMS, FOOTER)-->

    <!-- SHOW BARANG -->
    <v-dialog
      v-model="barang.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <barang-view
          jenis="keluar"
          :staPilih="true"
          @barang="getBarang"
        ></barang-view>
      </v-card>
    </v-dialog>
    <!-- END SHOW BARANG -->

    <!-- SHOW CUSTOMER -->
    <v-dialog
      v-model="customer.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <customer-view :staPilih="true" @customer="getCustomer"></customer-view>
      </v-card>
    </v-dialog>
    <!-- END SHOW CUSTOMER -->

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
import BarangView from "../../Master/BarangView.vue";
import CustomerView from "../../Master/CustomerView.vue";
import swal from "sweetalert";
// import numeral from 'numeral'
export default {
  components: {
    BarangView,
    CustomerView,
  },
  data() {
    return {
      data: {
        headers: [
          { text: "KODE", value: "kode_bahan", divider: true, sortable: false },
          {
            text: "NAMA BARANG",
            value: "nama_bahan",
            divider: true,
            sortable: false,
          },
          {
            text: "JUMLAH (QTY)",
            value: "jumlah",
            divider: true,
            align: "right",
            sortable: false,
          },
          {
            text: "HARGA (Rp.)",
            value: "rp_jual",
            divider: true,
            align: "right",
            sortable: false,
          },
          {
            text: "SUBTOTAL (Rp.)",
            value: "subtotal",
            divider: true,
            align: "right",
            sortable: false,
          },
          {
            text: "DISKON ITEM",
            value: "diskon_fix",
            divider: true,
            align: "right",
            sortable: false,
          },
          { text: "KETERANGAN", value: "kode", divider: true, sortable: false },
          { text: "OPSI", value: "opsi", sortable: false },
        ],
        items: [],
        loading: false,
        search: "",
        kodeCustomer: "",
        namaCustomer: "",
        jenisBayar: "tunai",
        total_bersih: "",
        diskon: "",
        bayar: "",
        pickerTanggal: false,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        user: "",
        noBukti: "",
      },
      barang: {
        dialog: false,
        loading: false,
      },
      customer: {
        dialog: false,
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
      cash: {
        dialog: false,
        items: [{ value: 1000 }],
      },
      form: {
        kode_bahan: "",
        barcode: "",
        nama_bahan: "",
        stok: "0",
        rp_jual: "0",
        jumlah: "0",
        subtotal: "0",
        harga_up: "0",
        jumlah_up: "0",
        diskon_persen: "0",
        diskon: "0",
        staEdit: false,
        indexEdit: "",
        keterangan: "",
      },
    };
  },
  mounted() {
    this.$refs.inputScan.focus();
    // this.loadPrint();
  },
  methods: {
    proteksiStok() {
      if (
        this.form.jumlah > this.form.stok ||
        this.form.jumlah < 0 ||
        isNaN(this.form.jumlah)
      ) {
        this.form.jumlah = 0;
      }
    },
    async loadScan() {
      this.barang.loading = true;
      await axios
        .post("master/barang/bybarcode", {
          barcode: this.form.barcode,
        })
        .then((res) => {
          console.log(res.data.error);
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            if (res.status == 203) {
              this.showBarang();
            }
            return;
          }
          if (res.data.data.masuk - res.data.data.keluar <= 0) {
            this.$notify({
              type: "error",
              text: "Stok  Habis",
            });

            this.form.barcode = "";
            return;
          }
          this.form.jumlah = 1;
          this.form.jumlah_up = 1;
          this.form.kode_bahan = res.data.data.kode_bahan;
          this.form.nama_bahan = res.data.data.nama_bahan;
          this.form.stok = res.data.data.masuk - res.data.data.keluar;
          this.form.rp_jual = res.data.data.rp_jual;
          this.form.harga_up = res.data.data.rp_jual;
          this.form.diskon = 0;
          this.tambahItem();
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          console.log(err);
        });
      this.barang.loading = false;
    },
    produkInfo() {
      if (this.form.barcode == "") {
        return "";
      } else {
        return (
          this.form.barcode +
          " - " +
          this.form.nama_bahan +
          " - " +
          this.form.kode_bahan
        );
      }
    },
    editItem(i) {
      this.form.kode_bahan = this.data.items[i].kode_bahan;
      this.form.barcode = this.data.items[i].barcode;
      this.form.nama_bahan = this.data.items[i].nama_bahan;
      this.form.stok = this.data.items[i].stok;
      this.form.rp_jual = this.data.items[i].rp_jual;
      this.form.jumlah = this.data.items[i].jumlah;
      this.form.subtotal = this.data.items[i].subtotal;
      this.form.harga_up = this.data.items[i].harga_up;
      this.form.jumlah_up = this.data.items[i].jumlah_up;
      this.form.diskon = this.data.items[i].diskon;
      this.form.keterangan = this.data.items[i].keterangan;
      this.form.staEdit = true;
      this.form.indexEdit = i;
      this.$refs.inputJumlah.focus();
    },
    updateItem() {
      let i = this.form.indexEdit;
      this.data.items[i].kode_bahan = this.form.kode_bahan;
      this.data.items[i].nama_bahan = this.form.nama_bahan;
      this.data.items[i].stok = this.form.stok;
      this.data.items[i].rp_jual = this.form.rp_jual;
      this.data.items[i].jumlah = this.form.jumlah;
      this.data.items[i].subtotal = this.form.subtotal;
      this.data.items[i].harga_up = this.form.harga_up;
      this.data.items[i].jumlah_up = this.form.jumlah_up;
      this.data.items[i].diskon = this.form.diskon;
      this.form.staEdit = false;
      this.form.indexEdit = "";
      this.resetForm();
    },
    deleteItem(i) {
      this.data.items.splice(i, 1);
    },
    showCustomer() {
      this.customer.dialog = true;
    },
    getCustomer(value) {
      this.data.kodeCustomer = value.kode;
      this.data.namaCustomer = value.nama;
      this.customer.dialog = false;
    },
    showBarang() {
      this.barang.dialog = true;
    },
    getBarang(value) {
      for (let i = 0; i < this.data.items.length; i++) {
        if (value.kode_bahan == this.data.items[i].kode_bahan) {
          this.$notify({
            type: "error",
            text: "Barang Sudah Ada, mohon koreksi kembali",
          });
          return;
        }
      }
      this.form.kode_bahan = value.kode_bahan;
      this.form.barcode = value.barcode;
      this.form.nama_bahan = value.nama_bahan;
      this.form.stok = value.stok;
      this.form.rp_jual = value.rp_jual;
      this.form.harga_up = value.rp_jual;
      this.form.jumlah_up = value.stok;
      this.barang.dialog = false;
      setTimeout(() => {
        this.$refs.inputJumlah.focus();
      }, 100);
    },
    tambahItem() {
      if (this.form.kode_bahan == "") {
        this.$notify({
          type: "warning",
          text: "Silahkan pilih barang dahulu",
        });
        return
      }
      if (this.form.jumlah == 0) {
        this.$notify({
          type: "warning",
          text: "Jumlah harus lebih dari 0",
        });
        return
      }
      

      if (this.form.jumlah > this.form.stok || this.form.jumlah < 0) {
        this.$notify({
          type: "warning",
          text: "Mohon Cek Kembali Jumlah",
        });
        this.form.jumlah = 0;
        return;
      }
      this.data.items.push({ ...this.form });
      this.resetForm();
    },

    async createData() {
      this.data.loading = true;
      this.data.user = this.$store.state.auth.user.name.toUpperCase();
      await axios
        .post("penjualan/transaksi/create", this.data)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.error, "error");
            return;
          }
          this.data.noBukti = res.data.no_bukti;
          swal("Sukses", res.data.message, "success");
          // swal("Sukses", res.data.message, "success", {
          //   buttons: {
          //     cetak: true,
          //   },
          // }).then((value) => {
          //   switch (value) {
          //     case "cetak":
          //       this.print();
          //       break;

          //     default:
          //       this.print();
          //       break;
          //   }
          // });
          this.resetAll();
        })
        .catch((err) => {
          swal("Gagal", "Simpan Transaksi Gagal : " + err, "error");
        });
      this.data.loading = false;
    },
    devCreate() {
      swal("Sukses", "TEST", "success", {
        buttons: {
          cetak: "Cetak",
        },
      }).then((value) => {
        switch (value) {
          case "cetak":
            this.print();
            break;

          default:
            this.print();
            break;
        }
      });
    },
    print() {
      this.invoice.dialog = true;
      this.loadPrint();
      setTimeout(() => {
        window.print();
      }, 1000);
      setTimeout(() => {
        this.invoice.dialog = false;
      }, 1000);
    },
    async loadPrint() {
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

    resetForm() {
      this.form.kode_bahan = "";
      this.form.barcode = "";
      this.form.nama_bahan = "";
      this.form.stok = "";
      this.form.rp_jual = "";
      this.form.jumlah = "";
      this.form.subtotal = "";
      this.form.diskon_persen = "0";
      this.form.diskon = "0";
      this.form.staEdit = false;
      this.form.indexEdit = "";
    },
    resetAll() {
      this.data.items = [];
      this.data.loading = false;
      this.data.search = "";
      this.data.kodeCustomer = "";
      this.data.namaCustomer = "";
      this.data.bayar = "";
      this.data.pickerTanggal = false;
      this.data.tanggal = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.resetForm();
    },
    totalKotorTransaksi() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + this.data.items[i].jumlah * this.data.items[i].rp_jual;
      }
      this.data.total_kotor = a;
      return a;
    },
    totalBersihTransaksi() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a =
          a +
          (this.data.items[i].jumlah * this.data.items[i].rp_jual -
            this.data.items[i].jumlah * this.data.items[i].diskon);
      }
      this.data.total_bersih = a;
      return a;
    },
    totalDiskon() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + this.data.items[i].jumlah * this.data.items[i].diskon;
      }
      this.data.diskon = a;
      return a;
    },
    kembalian() {
      if (this.data.jenisBayar != "tunai") {
        this.data.bayar = 0;
        return 0;
      } else {
        return this.data.bayar - this.totalBersihTransaksi();
      }
    },
    staTunai() {
      if (this.data.jenisBayar != "tunai") {
        return false;
      } else {
        return true;
      }
    },
  },
  computed: {
    isValid() {
      if (
        this.data.items.length > 0 &&
        this.data.kodeCustomer != "" &&
        this.data.jenisBayar != "" &&
        this.kembalian() >= 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    diskonPersen() {
      return this.form.diskon_persen;
    },
  },
  watch: {
    diskonPersen() {
      if (this.form.diskon_persen > 100) {
        alert("Tidak Boleh Melebihi 100%");
        this.form.diskon_persen = 0;
        return;
      }
      if (this.form.diskon_persen < 0) {
        alert("Tidak Boleh Kurang 0%");
        this.form.diskon_persen = 0;
        return;
      }
      this.form.diskon = (this.form.diskon_persen / 100) * this.form.rp_jual;
    },
  },
};
</script>


