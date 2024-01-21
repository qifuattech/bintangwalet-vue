<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>INPUT TRANSAKSI ARUS KAS</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2 d-flex justify-center">
      <v-col cols="6">
        <v-card outlined>
          <v-tabs grow icons-and-text v-model="tab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab>
              PENERIMAAN
              <v-icon>mdi-plus-thick</v-icon>
            </v-tab>

            <v-tab>
              PENGELUARAN
              <v-icon>mdi-minus-thick</v-icon>
            </v-tab>

            <v-tab>
              MUTASI
              <v-icon>mdi-autorenew</v-icon>
            </v-tab>

            <!-- INPUT (PENERIMAAN,PENGELUARAN) -->
            <v-tab-item v-for="index in 2" :key="index">
              <v-card flat>
                <v-card-text>
                  <v-form v-model="data.isValid">
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
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="data.tanggal"
                        @input="data.pickerTanggal = false"
                      ></v-date-picker>
                    </v-menu>
                    <!-- END TANGGAL -->
                    <v-text-field
                      v-model="data.jumlah"
                      :rules="rules.jumlah"
                      label="Jumlah"
                      dense
                      height="75"
                      outlined
                      append-icon="mdi-calculator"
                      type="number"
                      class="text-h4"
                    ></v-text-field>
                    <!-- AKUN -->
                    <div class="d-flex justify-space-around">
                      <v-text-field
                        :value="data.nama_bank + ' - ' + data.kode_bank"
                        label="Kas/Bank"
                        dense
                        outlined
                        class="mr-2"
                      ></v-text-field>
                      <v-btn @click="showBank()"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div>

                    <div class="d-flex justify-space-around">
                      <v-text-field
                        :value="data.nama_rekening + ' - ' + data.kode_rekening"
                        label="Kategori Transaksi"
                        dense
                        outlined
                        class="mr-2"
                        readonly
                      ></v-text-field>
                      <v-btn @click="showRekening()"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div>

                    <!-- KONDISIONAL GENERAL, CUSTOMER, SUPPLIER -->
                    <div class="d-flex justify-space-around">
                      <v-text-field
                        :value="data.nama_akun + ' - ' + data.kode_akun"
                        label="Akun"
                        dense
                        outlined
                        class="mr-2"
                        readonly
                      ></v-text-field>
                      <v-btn @click="showAkun()"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                      <v-btn
                        class="ml-2"
                        v-if="customer.listOutstand == true"
                        @click="showOutstand()"
                        ><v-icon>mdi-card-bulleted-outline</v-icon></v-btn
                      >
                    </div>
                    <!-- END KONDISIONAL GENERAL, CUSTOMER, SUPPLIER -->

                    <v-text-field
                      v-model="data.keterangan"
                      label="Keterangan (Tidak Wajib Diisi)"
                      dense
                      outlined
                      class="mr-2"
                    ></v-text-field>
                    <v-divider class="my-2"></v-divider>
                    <div class="d-flex justify-end">
                      <v-btn
                        color="success"
                        :disabled="!isValid"
                        @click="createData()"
                        >SIMPAN <v-icon>mdi-floppy</v-icon></v-btn
                      >
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- END INPUT (PENERIMAAN, PENGELUARAN) -->

            <!-- MUTASI / TRANSFER -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-form v-model="data.isValid2">
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
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="data.tanggal"
                        @input="data.pickerTanggal = false"
                      ></v-date-picker>
                    </v-menu>
                    <!-- END TANGGAL -->

                    <v-text-field
                      label="Jumlah"
                      dense
                      outlined
                      height="75"
                      append-icon="mdi-calculator"
                      type="number"
                      class="text-h4"
                      v-model="data.jumlah"
                      :rules="rules2.jumlah"
                    ></v-text-field>

                    <!-- AKUN ASAL -->
                    <div class="d-flex justify-space-around">
                      <v-text-field
                        label="Kas/Bank Asal"
                        :value="data.nama_bank + ' - ' + data.kode_bank"
                        :rules="rules2.kode_bank"
                        dense
                        outlined
                        class="mr-2"
                        append-icon="mdi-bank-transfer-out"
                      ></v-text-field>
                      <v-btn @click="showBank('asal')"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div>
                    <!-- END AKUN ASAL -->

                    <!-- AKUN TUJUAN -->
                    <div class="d-flex justify-space-around">
                      <v-text-field
                        label="Kas/Bank Tujuan"
                        :value="data.nama_bank2 + ' - ' + data.kode_bank2"
                        :rules="rules2.kode_bank2"
                        dense
                        outlined
                        class="mr-2"
                        append-icon="mdi-bank-transfer-in"
                      ></v-text-field>
                      <v-btn @click="showBank('tujuan')"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div>
                    <!-- END AKUN TUJUAN -->

                    <v-text-field
                      label="Keterangan (Tidak Wajib Diisi)"
                      dense
                      outlined
                      class="mr-2"
                      v-model="data.keterangan"
                    ></v-text-field>
                    <v-divider class="my-2"></v-divider>
                    <div class="d-flex justify-end">
                      <v-btn
                        color="success"
                        :disabled="!isValid2"
                        @click="createData()"
                        >SIMPAN <v-icon>mdi-floppy</v-icon></v-btn
                      >
                    </div>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- END MUTASI / TRANSFER -->
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="bank.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <bank-view :staPilih="true" @bank="getBank"></bank-view>
      </v-card>
    </v-dialog>

    <!-- KATEGORI - REKENING -->
    <v-dialog
      v-model="rekening.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <rekening-view
          :staPilih="true"
          :jenis="getJenis()"
          ref="loadDataRekening"
          @rekening="getRekening"
        ></rekening-view>
      </v-card>
    </v-dialog>
    <!-- END KATEGORI - REKENING -->

    <!-- REFERENSI GENERAL-->
    <v-dialog
      v-model="akun.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <akun-view
          :staPilih="true"
          :kode_rekening="data.kode_rekening"
          ref="loadDataAkun"
          @akun="getAkun"
        ></akun-view>
      </v-card>
    </v-dialog>
    <!-- REFERENSI GENERAL -->

    <!-- REFERENSI CUSTOMER-->
    <v-dialog
      v-model="customer.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <customer-view :staPilih="true" @customer="getAkun"></customer-view>
      </v-card>
    </v-dialog>
    <!-- REFERENSI CUSTOMER -->

    <!-- REFERENSI SUPPLIER-->
    <v-dialog
      v-model="supplier.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <supplier-view :staPilih="true" @supplier="getAkun"></supplier-view>
      </v-card>
    </v-dialog>
    <!-- REFERENSI SUPPLIER -->

    <!-- CUSTOMER OUTSTAND -->
    <v-dialog
      v-model="customer.dialogOutstand"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card class="pb-5">
        <v-card-title>
          <div v-if="data.xjenis == 2">
            DATA PIUTANG CUSTOMER : {{ this.data.nama_akun }}
          </div>
          <div v-if="data.xjenis == 3">
            DATA HUTANG SUPPLIER : {{ this.data.nama_akun }}
          </div>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-card outlined>
                <v-data-table
                  :headers="customer.headersOutstand"
                  :items="customer.itemsOutstand"
                  :loading="customer.loadingOutstand"
                  :search="customer.searchOutstand"
                  dense
                  :items-per-page="50"
                  hide-default-footer
                >
                  <template v-slot:[`item.sisa`]="{ item }">
                    {{ formatNumber(item.sisa) }}
                  </template>
                  <template v-slot:[`item.bayar`]="{ item }">
                    {{ formatNumber(item.bayar) }}
                  </template>
                  <template v-slot:[`item.nilai`]="{ item }">
                    {{ formatNumber(item.nilai) }}
                  </template>
                  <template v-slot:[`item.kurang`]="{ item }">
                    {{ formatNumber(item.kurang) }}
                  </template>
                  <template v-slot:[`item.opsi`]="{ index }">
                    <v-btn color="primary" @click="updateNilai(index)" text
                      ><v-icon large>mdi-pencil-box-outline</v-icon></v-btn
                    >
                  </template>
                </v-data-table>
              </v-card>
              <div class="d-flex justify-end mt-2">
                <table>
                  <tbody>
                    <strong>
                      <tr>
                        <td>Total Bayar</td>
                        <td class="px-1">:</td>
                        <td align="right">{{ formatNumber(sumNilai()) }}</td>
                      </tr>
                      <tr>
                        <td>Total Sisa Jumlah</td>
                        <td class="px-1">:</td>
                        <td align="right">
                          {{ formatNumber(sumSisaJumlah()) }}
                        </td>
                      </tr>
                    </strong>
                  </tbody>
                </table>
              </div>
            </v-col>

            <v-col cols="4">
              <v-card outlined>
                <v-card-text>
                  <v-text-field
                    v-model="customer.noBukti"
                    label="No. Bukti"
                    dense
                    outlined
                    readonly
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-text-field
                    v-model="customer.outstand"
                    label="Outstand"
                    dense
                    outlined
                    readonly
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-text-field
                    v-model="customer.nilai"
                    label="Nilai"
                    dense
                    outlined
                    v:onv-on:keyup.13="applyNilai()"
                    @input="changeKurang()"
                    background-color="light-blue lighten-5"
                  ></v-text-field>
                  <v-text-field
                    v-model="customer.kurang"
                    label="Kurang"
                    dense
                    outlined
                    readonly
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-btn
                    color="success"
                    outlined
                    rounded
                    @click="applyNilai()"
                    small
                    >Terapkan</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-end">
            <v-btn color="success" outlined @click="setOutstand()">OK</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- END CUSTOMER OUTSTAND -->

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import RekeningView from "../Master/RekeningView.vue";
import BankView from "../Master/BankView.vue";
import AkunView from "../Master/AkunView.vue";
import CustomerView from "../Master/CustomerView.vue";
import SupplierView from "../Master/SupplierView.vue";
import swal from "sweetalert";
import axios from "axios";
export default {
  components: {
    RekeningView,
    BankView,
    AkunView,
    CustomerView,
    SupplierView,
  },
  data() {
    return {
      tab: null,
      data: {
        pickerTanggal: false,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        kode_bank: "",
        nama_bank: "",
        kategori: "",
        kode_bank2: "",
        nama_bank2: "",
        jumlah: 0,
        kode_rekening: "",
        nama_rekening: "",
        xjenis: "",
        kode_akun: "",
        nama_akun: "",
        keterangan: "",
        sisa: 0,
        isValid: false,
        isValid2: false,
        itemsOutstand: [],
        sumNilai: 0,
        sumSisaJumlah: 0,
        user: this.$store.state.auth.user.name.toUpperCase(),
      },
      rules: {
        kode_bank: [(v) => v != "" || "Bank Harus Diisi"],
        kode_rekening: [(v) => v != "" || "Rekening Harus Diisi"],
        kode_akun: [(v) => v != "" || "Referensi Harus Diisi"],
        jumlah: [(v) => v > 0 || "Jumlah Harus Lebih Dari 0"],
      },
      rules2: {
        kode_bank: [(v) => v != "" || "Bank Asal Harus Diisi"],
        kode_bank2: [(v) => v != "" || "Bank Tujuan Harus Diisi"],
        jumlah: [(v) => v > 0 || "Jumlah Harus Lebih Dari 0"],
      },
      rekening: {
        dialog: false,
      },
      bank: {
        dialog: false,
      },
      akun: {
        dialog: false,
      },
      customer: {
        dialog: false,
        listOutstand: false,
        dialogOutstand: false,
        headersOutstand: [
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NO. BUKTI", value: "no_bukti", divider: true },
          { text: "OUTSTAND", value: "sisa", divider: true, align: "right" },
          { text: "BAYAR", value: "bayar", divider: true, align: "right" },
          { text: "JUMLAH", value: "nilai", divider: true, align: "right" },
          { text: "SISA", value: "kurang", divider: true, align: "right" },
          // { text: "NO. BUKTI", value: "noBukti", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        itemsOutstand: [{ sisa: 0, nilai: 0, kurang: 0, noBukti: "" }],
        loadingOutstand: false,
        searchOutstand: "",
        dialogBayar: false,
        indexOutstand: 0,
        sisaJumlah: 0,

        noBukti: "",
        outstand: 0,
        nilai: 0,
        kurang: 0,
      },
      supplier: {
        dialog: false,
      },
    };
  },
  methods: {
    resetJenis() {
      this.data.kode_rekening = "";
      this.data.nama_rekening = "";
      this.data.kode_akun = "";
      this.data.nama_akun = "";
    },
    showRekening() {
      this.rekening.dialog = true;
      this.$refs.loadDataRekening.loadData();
    },
    getRekening(value) {
      this.data.kode_rekening = value.kode_rekening;
      this.data.nama_rekening = value.nama_rekening;
      this.data.xjenis = value.xjenis;
      switch (parseInt(this.data.xjenis)) {
        case 1:
          this.customer.listOutstand = false;
          break;
        case 2:
          this.customer.listOutstand = true;
          break;
        case 3:
          this.customer.listOutstand = true;
          break;

        default:
          this.customer.listOutstand = false;
          break;
      }
      this.rekening.dialog = false;
      this.data.kode_akun = "";
      this.data.nama_akun = "";
    },
    getJenis() {
      switch (this.tab) {
        case 0:
          return "IN";
        case 1:
          return "OU";
        case 2:
          return "MT";
      }
    },

    showBank(kategori) {
      this.data.kategori = kategori;
      this.bank.dialog = true;
    },
    getBank(value) {
      // console.log(this.data.kategori);
      switch (this.data.kategori) {
        case "asal":
          if (this.data.kode_bank2 == value.kode_bank) {
            this.$notify({
              type: "error",
              text: "Kas/Bank Asal dan Tujuan tidak boleh sama",
            });
            return;
          }
          this.data.kode_bank = value.kode_bank;
          this.data.nama_bank = value.nama_bank;
          break;
        case "tujuan":
          if (this.data.kode_bank == value.kode_bank) {
            this.$notify({
              type: "error",
              text: "Kas/Bank Asal dan Tujuan tidak boleh sama",
            });
            return;
          }
          this.data.kode_bank2 = value.kode_bank;
          this.data.nama_bank2 = value.nama_bank;
          break;

        default:
          this.data.kode_bank = value.kode_bank;
          this.data.nama_bank = value.nama_bank;
          break;
      }
      this.bank.dialog = false;
    },
    showAkun() {
      console.log(this.data.xjenis);
      switch (parseInt(this.data.xjenis)) {
        case 1:
          this.akun.dialog = true;
          this.$refs.loadDataAkun.loadData();
          break;
        case 2:
          this.customer.dialog = true;
          break;
        case 3:
          this.supplier.dialog = true;
          break;
        default:
          this.$notify({ type: "warning", text: "Silahkan Pilih Kategori" });
          break;
      }
    },
    getAkun(value) {
      if (value.kode == null || value.kode == "") {
        this.data.kode_akun = value.kode_akun;
        this.data.nama_akun = value.nama_akun;
      } else {
        this.data.kode_akun = value.kode;
        this.data.nama_akun = value.nama;
      }
      this.akun.dialog = false;
      this.customer.dialog = false;
      this.supplier.dialog = false;
    },
    async showOutstand() {
      if (this.data.jumlah == 0) {
        this.$notify({
          type: "warning",
          text: "Isikan Jumlah Terlebih Dahulu",
        });
        return;
      }
      if (this.customer.listOutstand == false || this.data.kode_akun == "") {
        this.$notify({ type: "warning", text: "Pilih Akun Terlebih Dahulu" });
        return;
      }
      if (this.customer.listOutstand == true && this.data.kode_akun != "") {
        this.customer.dialogOutstand = true;
        this.customer.sisaJumlah = this.data.jumlah;

        //JIKA PIUTANG CUSTOMER
        if (this.data.xjenis == 2) {
          await axios
            .post("penjualan/piutang/customer", {
              kode: this.data.kode_akun,
            })
            .then((res) => {
              if (res.status != 200) {
                this.$notify({ type: "error", text: res.data.error });
                return;
              }
              this.customer.itemsOutstand = res.data.data;
              this.customer.indexOutstand = 0;
              this.customer.outstand = 0;
              this.customer.nilai = 0;
              this.customer.kurang = 0;
              for (let i = 0; i < this.customer.itemsOutstand.length; i++) {
                this.customer.itemsOutstand[i].nilai = 0;
                this.customer.itemsOutstand[i].kurang = 0;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        // JIKA HUTANG SUPPLIER
        else {
          await axios
            .post("pembelian/hutang/supplier", {
              kode: this.data.kode_akun,
            })
            .then((res) => {
              if (res.status != 200) {
                this.$notify({ type: "error", text: res.data.error });
                return;
              }
              this.customer.itemsOutstand = res.data.data;
              this.customer.indexOutstand = 0;
              this.customer.outstand = 0;
              this.customer.nilai = 0;
              this.customer.kurang = 0;
              for (let i = 0; i < this.customer.itemsOutstand.length; i++) {
                this.customer.itemsOutstand[i].nilai = 0;
                this.customer.itemsOutstand[i].kurang = 0;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    updateNilai(index) {
      this.customer.indexOutstand = index;
      this.customer.noBukti = this.customer.itemsOutstand[index].no_bukti;
      this.customer.outstand = this.customer.itemsOutstand[index].outstand;
      this.customer.nilai = parseInt(this.customer.itemsOutstand[index].nilai);
      this.customer.kurang = this.customer.itemsOutstand[index].kurang;
      this.customer.outstand = this.customer.itemsOutstand[index].sisa;
    },
    sumSisaJumlah() {
      return this.data.jumlah - this.sumNilai();
    },
    sumNilai() {
      let a = 0;
      for (let i = 0; i < this.customer.itemsOutstand.length; i++) {
        if (isNaN(this.customer.itemsOutstand[i].nilai) == false) {
          a = a + this.customer.itemsOutstand[i].nilai * 1;
        }
      }
      return a;
    },
    changeKurang() {
      this.customer.kurang = this.customer.outstand - this.customer.nilai;
      if (this.customer.kurang < 0) {
        this.customer.nilai = 0;
        this.customer.kurang = 0;
      }
    },
    applyNilai() {
      if (this.customer.nilai == 0) {
        this.$notify({ type: "warning", text: "Nilai Masih Kosong" });
        return;
      }
      if (this.customer.nilai > this.sumSisaJumlah()) {
        this.$notify({ type: "warning", text: "Nilai Melebihi Sisa Jumlah" });
        return;
      }

      let i = this.customer.indexOutstand;
      this.customer.itemsOutstand[i].nilai = this.customer.nilai;
      this.customer.itemsOutstand[i].kurang = this.customer.kurang;

      this.customer.noBukti = "";
      this.customer.indexOutstand = 99;
      this.customer.outstand = 0;
      this.customer.nilai = 0;
      this.customer.kurang = 0;
    },
    setOutstand() {
      this.customer.dialogOutstand = false;
      this.data.itemsOutstand = this.customer.itemsOutstand;
    },
    async createData() {
      await axios
        .post("kasbank/create", this.data)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.message, "error");
            return;
          }
          swal("Sukses", "Simpan Kas/Bank Berhasil", "success");
          this.resetAll();
        })
        .catch((err) => {
          console.log(err);
          swal("Gagal", "Simpan Kas/Bank Gagal ", "error");
        });
    },
    resetAll() {
      this.data.kode_bank = "";
      this.data.nama_bank = "";
      this.data.kategori = "";
      this.data.kode_bank2 = "";
      this.data.nama_bank2 = "";
      this.data.jumlah = 0;
      this.data.kode_rekening = "";
      this.data.nama_rekening = "";
      this.data.xjenis = "";
      this.data.kode_akun = "";
      this.data.nama_akun = "";
      this.data.keterangan = "";
      this.data.isValid = false;
      this.data.isValid2 = false;
    },
  },

  computed: {
    isValid() {
      if (
        this.data.jumlah > 0 &&
        this.data.kode_bank != "" &&
        this.data.kode_rekening != "" &&
        this.data.kode_akun != ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    isValid2() {
      if (
        this.data.jumlah > 0 &&
        this.data.kode_bank != "" &&
        this.data.kode_bank2 != ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    tab() {
      this.resetJenis();
    },
  },
};
</script>

<style>
</style>