<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-start">
        <div>
          <v-btn color="primary" text to="/pembelian/po" class="mr-3"
            ><v-icon x-large>mdi-arrow-left-bold</v-icon></v-btn
          >
        </div>
        <div class="text-h5 mt-1">INPUT PURCHASING ORDER</div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col cols="auto" lg="8">
        <v-card outlined rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <!-- NO. PO  -->
                <div class="d-flex justify">
                  <v-text-field
                    dense
                    outlined
                    label="No. PO (Otomatis)"
                    readonly
                    v-model="data.no_po"
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-btn class="ml-2" @click="showPo()"
                    ><v-icon>mdi-eye-outline</v-icon></v-btn
                  >
                </div>
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
                  </template>
                  <v-date-picker
                    v-model="data.tanggal"
                    @input="data.pickerTanggal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <!-- PILIH SUPPLIER -->
                <div class="d-flex justify-space-between">
                  <v-text-field
                    :value="supplier.nama + ' - ' + supplier.kode"
                    name="name"
                    class="mr-2"
                    background-color="white"
                    dense
                    outlined
                    label="Supplier"
                  ></v-text-field>
                  <v-btn @click="showSupplier()" color="light-blue lighten-5"
                    ><v-icon>mdi-magnify</v-icon></v-btn
                  >
                </div>
                <!-- TGL KIRIM -->
                <v-menu
                  v-model="data.pickerTglKirim"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      label="Tanggal Est. Terima"
                      :value="formatDate(data.tglKirim)"
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
                    v-model="data.tglKirim"
                    @input="data.pickerTglKirim = false"
                  ></v-date-picker>
                </v-menu>
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
      <v-spacer></v-spacer>

      <v-col cols="3">
        <v-card outlined rounded="lg">
          <v-card-text>
            <v-text-field
              name="name"
              label="Subtotal"
              dense
              outlined
              readonly
              :value="subtotal()"
              background-color="blue-grey lighten-5"
            ></v-text-field>
            <v-text-field
              v-model="data.potongan"
              label="Potongan"
              dense
              outlined
              background-color="light-blue lighten-5"
            ></v-text-field>
            <v-text-field
              name="name"
              label="Bayar"
              readonly
              dense
              outlined
              :value="bayar()"
              background-color="blue-grey lighten-5"
            ></v-text-field>
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
                  :disabled="supplier.kode == ''"
                  >Tambah Data<v-icon>mdi-plus-thick</v-icon></v-btn
                >
              </div>
              <div
                v-if="supplier.kode == ''"
                class="d-flex justify-center text-caption"
              >
                Pilih Supplier Dahulu
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
                  {{ item.jumlah * item.hargaBeli }}
                </template>
                <template v-slot:[`item.opsi`]="{ index }">
                  <v-btn color="error" text @click="hapusItem(index)"
                    ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                  >
                  <v-btn color="primary" text @click="showUpdateItem(index)"
                    ><v-icon>mdi-pen</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex justify-end mt-2">
              <v-btn color="primary" @click="resetAll()" class="mr-2"
                >BARU</v-btn
              >
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
                >SIMPAN <v-icon>mdi-floppy</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="supplier.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card>
        <supplier-view :staPilih="true" @supplier="getSupplier"></supplier-view>
      </v-card>
    </v-dialog>

    <!-- FORM TAMBAH DATA -->
    <v-dialog
      v-model="form.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined class="pb-4">
        <v-card-title> Form Detail </v-card-title>
        <v-card-text>
          <v-form v-model="form.isValid">
            <div class="d-flex justify-space-between">
              <v-text-field
                :value="barang.nama_bahan + ' - ' + barang.kode_bahan"
                label="Nama Bahan"
                dense
                outlined
                class="mr-2"
                
              ></v-text-field>
              <v-btn @click="showBarang()" color="light-blue lighten-4"><v-icon>mdi-magnify</v-icon></v-btn>
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
              <v-col cols="6">
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
                  v-model="form.hargaBeli"
                  :rules="rules.hargaBeli"
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
              <v-col cols="6">
                <v-text-field
                  label="Stok Sekarang"
                  v-model="barang.stok"
                  dense
                  outlined
                  type="number"
                  readonly
                  background-color="blue-grey lighten-5"
                ></v-text-field>
                <v-text-field
                  :rules="rules.rp_jual"
                  v-model="barang.rp_jual"
                  label="Harga Jual"
                  dense
                  outlined
                  type="number"
                  background-color="light-blue lighten-5"
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
          <barang-view jenis="masuk" :staPilih="true" @barang="getBarang"></barang-view>
        </v-card>
      </v-dialog>
    </v-dialog>

    <!-- DIALOG PO -->
    <v-dialog
      v-model="po.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <list-purchase-order :staPilih="true" @po="getPo"></list-purchase-order>
      </v-card>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import SupplierView from "@/views/Master/SupplierView.vue";
import BarangView from "@/views/Master/BarangView.vue";
import axios from "axios";
import swal from "sweetalert";
import ListPurchaseOrder from "@/views/Pembelian/PurchaseOrder/ListPurchasingOrder.vue";

export default {
  components: { SupplierView, BarangView, ListPurchaseOrder },
  data() {
    return {
      data: {
        headers: [
          { text: "KODE", value: "kode_bahan", divider: true },
          { text: "NAMA BARANG", value: "nama_bahan", divider: true },
          { text: "JUMLAH", value: "jumlah", align: "right", divider: true },
          { text: "STOCK", value: "stok", align: "right", divider: true },
          {
            text: "HARGA BELI (Rp)",
            value: "hargaBeli",
            align: "right",
            divider: true,
          },
          {
            text: "HARGA JUAL (Rp)",
            value: "rp_jual",
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
        kodeSupplier: "",
        pickerTanggal: false,
        pickerTglKirim: false,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        tglKirim: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        keterangan: "",
        potongan: 0,
        no_po: "",
      },
      supplier: {
        dialog: false,
        kode: "",
        nama: "",
      },
      form: {
        kode_bahan: "",
        nama_bahan: "",
        jumlah: 0,
        stok: 0,
        hargaBeli: "",
        rp_jual: "",
        keterangan: "",
        isValid: false,
        dialog: false,
        isEdit: false,
        indexEdit: "",
      },
      rules: {
        // kode_bahan: [(v) => v != !null || "Pilih Nama Bahan"],
        jumlah: [(v) => v > 0 || "Jumlah harus lebih dari 0"],
        hargaBeli: [(v) => v > 0 || "Harga Beli harus lebih dari 0"],
        keterangan: [(v) => v > "" || "Keterangan Harus Diisi"],
        rp_jual: [(v) => v > 0 || "Harga Jual harus lebih dari 0"],
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
        kd_supplier: "",
        nama: "",
        doc: {
          kd_supplier: "",
          nama: "",
        },
        detail: [],
      },
      staView: false,
      staUpdate: false,
    };
  },
  mounted() {
    if (this.$route.query.nopo != "") {
      this.data.no_po = this.$route.query.nopo;
      this.loadPo();
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

      this.form.hargaBeli = this.data.items[index].hargaBeli;
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
      this.data.items[i].hargaBeli = this.form.hargaBeli;
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
    async loadPo() {
      await axios
        .post("pembelian/po/bypo", {
          no_po: this.data.no_po,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.staView = true;
          this.po.doc = res.data.dataDoc;
          this.data.keterangan = res.data.dataDoc.keterangan;
          this.data.potongan = res.data.dataDoc.diskon;
          this.data.items = res.data.dataDetail;
          this.supplier.kode = res.data.dataDoc.kd_supplier;
          this.supplier.nama = res.data.dataDoc.nama;
          this.data.kodeSupplier = res.data.dataDoc.kd_supplier;
          this.data.tanggal = res.data.dataDoc.tgl_po;
          this.data.tglKirim = res.data.dataDoc.tgl_kirim;
          for (let i = 0; i < res.data.dataDetail.length; i++) {
            this.data.items[i].hargaBeli = res.data.dataDetail[i].harga;
            this.data.items[i].stok = res.data.dataDetail[i].stock;
          }
          this.$notify({ type: "success", text: res.data.message });
        });
    },
    showSupplier() {
      this.supplier.dialog = true;
    },

    getSupplier(value) {
      this.supplier.kode = value.kode;
      this.supplier.nama = value.nama;
      this.data.kodeSupplier = value.kode;
      this.supplier.dialog = false;
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
      this.data.kodeSupplier = "";
      this.data.keterangan = "";
      this.data.potongan = 0;
      this.data.no_po = "";
      this.barang.kode_bahan = "";
      this.barang.nama_bahan = "";
      this.barang.dialog = false;
      this.supplier.kode = "";
      this.supplier.nama = "";
      this.data.items = [];
      this.form = {
        kode_bahan: "",
        nama_bahan: "",
        jumlah: 0,
        stok: 0,
        hargaBeli: "",
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
        hargaBeli: "",
        rp_jual: "",
        keterangan: "",
        dialog: false,
      };
    },
    total() {
      return this.form.jumlah * this.form.hargaBeli;
    },
    subtotal() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + this.data.items[i].jumlah * this.data.items[i].hargaBeli;
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
      if (this.data.kodeSupplier == "") {
        this.$notify({
          type: "error",
          text: "Mohon isi supplier",
        });
        return;
      }
      this.data.loading = true;
      await axios
        .post("pembelian/po/create", this.data)
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.error });
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.data.items = [];
          this.data.kodeSupplier = "";
          this.supplier.kode = "";
          this.supplier.nama = "";
          this.resetAll();
        })
        .catch((err) => {
          swal("Gagal", "Ada masalah di client " + err, "error");
        });
      this.data.loading = false;
    },

    async updateData() {
      if (this.data.kodeSupplier == "") {
        this.$notify({
          type: "error",
          text: "Mohon isi supplier",
        });
        return;
      }
      this.data.loading = true;
      await axios
        .post("pembelian/po/update", this.data)
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.error });
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.data.items = [];
          this.data.kodeSupplier = "";
          this.supplier.kode = "";
          this.supplier.nama = "";
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
  },
  computed: {},
};
</script>

<style></style>
