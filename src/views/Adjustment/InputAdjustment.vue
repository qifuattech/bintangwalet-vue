<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-start">
        <div>
          <v-btn color="primary" text to="/adjustment" class="mr-3"
            ><v-icon large>mdi-arrow-left-bold</v-icon></v-btn
          >
        </div>
        <h2 class="mt-1">
          INPUT ADJUSTMENT (PEMASUKAN/PENGELUARAN) - {{ data.noBukti }}
        </h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col cols="auto" lg="8">
        <v-card outlined rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <!-- TANGGAL -->
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
                    <!-- PILIH JENIS ADJUSTMEN -->
                    <v-select
                      :disabled="data.items.length > 0"
                      :items="['Pemasukan', 'Pengeluaran']"
                      v-model="data.jenis"
                      label="Jenis (Pemasukan/Pengeluaran)"
                      dense
                      outlined
                    ></v-select>

                    <!-- PILIH CUSTOMER -->
                    <!-- <div class="d-flex justify-space-between">
                      <v-text-field
                        :value="customer.nama + ' - ' + customer.kode"
                        class="mr-2"
                        background-color="white"
                        dense
                        outlined
                        label="Customer"
                      ></v-text-field>
                      <v-btn
                        @click="showCustomer()"
                        color="light-blue lighten-5"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div> -->
                  </template>
                  <v-date-picker
                    v-model="data.tanggal"
                    @input="data.pickerTanggal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-textarea
                  v-model="data.keterangan"
                  rows="3"
                  dense
                  outlined
                  label="Keterangan"
                  background-color="light-blue lighten-5"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card outlined rounded="lg">
          <v-card-title class="d-flex justify-space-between">
            <div>
              <div>
                <v-btn
                  color="success"
                  rounded
                  @click="showForm()"
                  class="mr-2"
                  :disabled="data.jenis == '' || staView == true"
                  small
                  ><v-icon>mdi-plus-thick</v-icon>Tambah Data</v-btn
                >
              </div>
              <div
                v-if="data.jenis == ''"
                class="d-flex justify-center text-caption"
              >
                Pilih Jenis Dahulu
              </div>
            </div>

            <v-spacer></v-spacer>

            <div>
              <v-text-field
                label="Pencarian"
                dense
                outlined
                hide-details
              ></v-text-field>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-card outlined rounded="lg">
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
                <template v-slot:[`item.subtotal`]="{ item }">
                  {{ item.jumlah * item.harga }}
                </template>
                <template v-slot:[`item.opsi`]="{ index }">
                  <v-btn color="error" text @click="hapusItem(index)" :disabled="staView"
                    ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                  >
                  <v-btn color="primary" text @click="showUpdateItem(index)" :disabled="staView"
                    ><v-icon>mdi-pen</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex justify-space-around mt-2">
              <v-btn @click="resetAll()" class="mr-2"
                ><v-icon>mdi-refresh</v-icon> BARU</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                @click="updateData()"
                v-if="staView"
                :disabled="!staValid()"
                >UPDATE <v-icon>mdi-floppy</v-icon>
              </v-btn>
              <v-btn
                color="success"
                @click="createData()"
                v-else
                :disabled="!staValid()"
                ><v-icon>mdi-floppy</v-icon>SIMPAN
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="customer.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card>
        <customer-view :staPilih="true" @customer="getCustomer"></customer-view>
      </v-card>
    </v-dialog>

    <!-- FORM TAMBAH DATA -->
    <v-dialog
      v-model="form.dialog"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card outlined class="pb-4">
        <v-card-title class="py-2"> Form Detail </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form v-model="form.isValid">
            <div class="d-flex justify-space-between">
              <v-text-field
                :value="barang.nama_bahan + ' - ' + barang.kode_bahan"
                label="Nama Bahan"
                dense
                outlined
                class="mr-2"
              ></v-text-field>
              <v-btn @click="showBarang()" color="light-blue lighten-4"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
            </div>
            <v-textarea
              v-model="form.keterangan"
              rows="2"
              :rules="rules.keterangan"
              label="Keterangan"
              dense
              outlined
              background-color="light-blue lighten-5"
            ></v-textarea>

            <v-row class="d-flex justify-space-between">
              <v-col>
                <v-text-field
                  v-model="form.jumlah"
                  :rules="rules.jumlah"
                  label="Jumlah"
                  dense
                  outlined
                  type="number"
                  background-color="light-blue lighten-5"
                ></v-text-field>
                <v-text-field
                  v-model="form.harga"
                  :rules="rules.harga"
                  v-if="data.jenis == 'Pemasukan'"
                  label="Harga Beli"
                  dense
                  outlined
                  type="number"
                  background-color="light-blue lighten-5"
                ></v-text-field>
                <v-text-field
                  :value="total()"
                  label="Total"
                  dense
                  readonly
                  type="number"
                  background-color="blue-grey lighten-5"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <div class="mt-2 d-flex justify-end">
              <v-btn
                color="success"
                rounded
                small
                v-if="form.isEdit"
                :disabled="!form.isValid"
                @click="updateItem()"
                >Update<v-icon>mdi-pen</v-icon></v-btn
              ><v-btn
                color="success"
                rounded
                small
                v-else
                :disabled="!form.isValid"
                @click="tambahItem()"
                >Tambahkan<v-icon>mdi-plus-box</v-icon></v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
      <!-- FORM TAMBAH DATA -->

      <!-- DIALOG BARANG -->
      <v-dialog
        v-model="barang.dialog"
        max-width="1000px"
        transition="dialog-transition"
      >
        <v-card>
          <barang-view
            :jenis="jenisTrans()"
            :staPilih="true"
            @barang="getBarang"
          ></barang-view>
        </v-card>
      </v-dialog>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import CustomerView from "@/views/Master/CustomerView.vue";
import BarangView from "@/views/Master/BarangView.vue";
import axios from "axios";
import swal from "sweetalert";

export default {
  components: { CustomerView, BarangView },
  data() {
    return {
      data: {
        headers: [
          { text: "KODE", value: "kode_bahan", divider: true },
          { text: "NAMA BARANG", value: "nama_bahan", divider: true },
          { text: "JUMLAH", value: "jumlah", align: "right", divider: true },
          { text: "STOCK", value: "stok", align: "right", divider: true },
          {
            text: "HARGA ADJUST (Rp)",
            value: "harga",
            align: "right",
            divider: true,
          },
          {
            text: "SUBTOTAL",
            value: "subtotal",
            align: "right",
            divider: true,
          },
          { text: "KETERANGAN", value: "keterangan", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
        jenis: "",
        // kodeCustomer: "",
        pickerTanggal: false,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        keterangan: "",
        user: this.$store.state.auth.user.name,
      },
      customer: {
        dialog: false,
        kode: "",
        nama: "",
      },
      form: {
        kode_bahan: "",
        nama_bahan: "",
        jumlah: 0,
        stok: 0,
        harga: "",
        rp_jual: "",
        keterangan: "",
        isValid: false,
        dialog: false,
        isEdit: false,
        indexEdit: "",
      },
      rules: {
        kode_bahan: [(v) => v != "" || "Pilih Nama Bahan"],
        jumlah: [(v) => v > 0 || "Jumlah harus lebih dari 0"],
        harga: [(v) => v > 0 || "Harga Beli harus lebih dari 0"],
        keterangan: [(v) => v > "" || "Keterangan Harus Diisi"],
      },
      barang: {
        dialog: false,
        kode_bahan: "",
        nama_bahan: "",
        stok: "",
        rp_jual: "",
      },
      po: {
        dialog: false,
        kd_customer: "",
        nama: "",
        doc: {
          kd_customer: "",
          nama: "",
        },
        detail: [],
      },
      staView: false,
    };
  },
  mounted() {
    if (this.$route.query.noBukti != "" && this.$route.query.noBukti != undefined) {
      this.data.noBukti = this.$route.query.noBukti;
      this.loadData();
    }
  },
  methods: {
    showUpdateItem(index) {
      this.form.indexEdit = index;
      this.form.isEdit = true;
      this.form.dialog = true;
      this.form.kode_bahan = this.data.items[index].kode_bahan;
      this.form.nama_bahan = this.data.items[index].nama_bahan;
      this.barang.kode_bahan = this.data.items[index].kode_bahan;
      this.barang.nama_bahan = this.data.items[index].nama_bahan;
      this.form.jumlah = this.data.items[index].jumlah;

      this.form.harga = this.data.items[index].harga;
      this.form.rp_jual = this.data.items[index].rp_jual;
      this.form.stok = this.data.items[index].stok;

      this.barang.rp_jual = this.data.items[index].rp_jual;
      this.barang.stok = this.data.items[index].stok;
      this.form.keterangan = this.data.items[index].keterangan;
    },
    updateItem() {
      if (this.barang.kode_bahan == "" || this.barang.kode_bahan == null) {
        this.$notify({ type: "error", text: "Pilih Nama Bahan" });
        return;
      }
      this.form.kode_bahan = this.barang.kode_bahan;
      this.form.nama_bahan = this.barang.nama_bahan;
      this.form.stok = this.barang.stok;
      this.form.rp_jual = this.barang.rp_jual;

      let i = this.form.indexEdit;
      this.data.items[i].kode_bahan = this.form.kode_bahan;
      this.data.items[i].nama_bahan = this.form.nama_bahan;
      this.data.items[i].jumlah = this.form.jumlah;
      this.data.items[i].harga = this.form.harga;
      this.data.items[i].rp_jual = this.form.rp_jual;
      this.data.items[i].stok = this.form.stok;
      this.data.items[i].keterangan = this.form.keterangan;

      this.resetForm();
      this.form.isEdit = false;
      this.form.dialog = false;
    },

    showPo() {
      this.po.dialog = true;
    },
    getPo(value) {
      this.po.no_po = value.no_po;
      this.data.no_po = value.no_po;
      this.po.dialog = false;
      this.loadPo();
    },
    async loadData() {
      await axios
        .post("adjustment/bybukti", {
          noBukti: this.data.noBukti,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.staView = true;
          this.data.tanggal = res.data.data.tanggal;
          this.data.jenis = res.data.data.jenis_trans;
          this.data.keterangan = res.data.data.keterangan;
          this.data.items = res.data.data.detail;
          for (let i = 0; i < res.data.dataDetail.length; i++) {
            this.data.items[i].harga = res.data.dataDetail[i].harga;
            this.data.items[i].stok = res.data.dataDetail[i].stock;
          }
          this.$notify({ type: "success", text: res.data.message });
        });
    },
    showCustomer() {
      this.customer.dialog = true;
    },

    getCustomer(value) {
      this.customer.kode = value.kode;
      this.customer.nama = value.nama;
      this.data.kodeCustomer = value.kode;
      this.customer.dialog = false;
    },
    showForm() {
      this.form.dialog = true;
    },
    showBarang() {
      this.barang.dialog = true;
    },
    getBarang(value) {
      for (let i = 0; i < this.data.items.length; i++) {
        if (value.kode_bahan == this.data.items[i].kode_bahan) {
          this.$notify({
            type: "error",
            text: "Bahan dengan Keteranan Sudah Ada, mohon koreksi kembali",
          });
          return;
        }
      }
      this.barang.kode_bahan = value.kode_bahan;

      this.barang.nama_bahan = value.nama_bahan;
      this.barang.stok = value.stok;
      this.barang.rp_jual = value.rp_jual;
      this.barang.dialog = false;
    },
    tambahItem() {
      if (this.barang.kode_bahan == "" || this.barang.kode_bahan == null) {
        this.$notify({ type: "error", text: "Pilih Nama Bahan" });
        return;
      }
      for (let i = 0; i < this.data.items.length; i++) {
        if (this.barang.kode_bahan == this.data.items[i].kode_bahan) {
          this.$notify({
            type: "error",
            text: "Bahan Sudah Ada, mohon koreksi kembali",
          });
          return;
        }
      }
      this.form.kode_bahan = this.barang.kode_bahan;
      this.form.nama_bahan = this.barang.nama_bahan;
      this.form.stok = this.barang.stok;
      this.form.rp_jual = this.barang.rp_jual;
      this.data.items.push({ ...this.form });
      this.resetForm();
      this.form.dialog = false;
    },
    resetAll() {
      this.staView = false;
      this.data.kodeCustomer = "";
      this.data.keterangan = "";
      this.data.potongan = 0;
      this.data.no_po = "";
      this.barang.kode_bahan = "";
      this.barang.nama_bahan = "";
      this.barang.dialog = false;
      this.customer.kode = "";
      this.customer.nama = "";
      this.data.items = [];
      this.form = {
        kode_bahan: "",
        nama_bahan: "",
        jumlah: 0,
        stok: 0,
        harga: "",
        rp_jual: "",
        keterangan: "",
        dialog: false,
      };
    },
    resetForm() {
      this.barang.kode_bahan = "";
      this.barang.nama_bahan = "";
      this.form = {
        kode_bahan: "",
        nama_bahan: "",
        jumlah: 0,
        stok: 0,
        harga: "",
        rp_jual: "",
        keterangan: "",
        dialog: false,
      };
    },
    total() {
      return this.form.jumlah * this.form.harga;
    },
    subtotal() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + this.data.items[i].jumlah * this.data.items[i].harga;
      }
      return a;
    },
    bayar() {
      return this.subtotal() - this.data.potongan;
    },
    hapusItem(index) {
      this.data.items.splice(index, 1);
    },

    async createData() {
      if (this.data.jenis == "") {
        this.$notify({
          type: "error",
          text: "Mohon pilih jenis terlebih dahulu",
        });
        return;
      }
      this.data.loading = true;
      await axios
        .post("adjustment/create", this.data)
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.error });
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.data.items = [];
          this.data.jenis = "";
          this.resetAll();
        })
        .catch((err) => {
          swal("Gagal", "Ada masalah di client " + err, "error");
        });
      this.data.loading = false;
    },

    async updateData() {
      // if (this.data.kodeCustomer == "") {
      //   this.$notify({
      //     type: "error",
      //     text: "Mohon isi customer",
      //   });
      //   return;
      // }
      this.data.loading = true;
      await axios
        .post("adjustment/update", this.data)
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.error });
            return;
          }
          swal("Sukses", res.data.message, "success");
           this.$router.push("/adjustment");
          this.resetAll();
        })
        .catch((err) => {
          swal("Gagal", "Ada masalah di client " + err, "error");
        });
      this.data.loading = false;
    },

    staValid() {
      if (this.data.items.length == 0) {
        return false;
      } else {
        return true;
      }
    },
    jenisTrans() {
      if (this.data.jenis == "Pemasukan") {
        return "masuk";
      } else {
        return "keluar";
      }
    },
  },
  computed: {},
};
</script>

<style></style>
