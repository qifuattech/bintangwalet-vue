<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>MASTER BARANG</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <!-- <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-title>
            Filter Data
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
    <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn
                color="success"
                rounded
                @click="
                  (addData.dialog = true), resetForm(), (staUpdate = false)
                "
                v-if="jenis != 'keluar'"
                >Tambah Data<v-icon>mdi-plus-thick</v-icon></v-btn
              >
            </div>
            <!-- <div class="mr-2">
              <v-select
              :items="jenisBarang.items"
              v-model="jenisBarang.value"
              label="Jenis Barang"
              item-text="nm_jenis"
              dense
              outlined
              hide-details
              @change="loadData()"
            ></v-select>
            </div> -->
            <div>
              <v-text-field
                name="name"
                label="Pencarian"
                outlined
                ref="inputSearch"
                dense
                hide-details
                clearable
                append-icon="mdi-magnify"
                v-model="data.search"
              ></v-text-field>
            </div>
            
            <v-spacer></v-spacer>
            <div v-if="jenis != 'keluar'">
              <download-excel
                class="btn btn-default"
                :fetch="fetchData"
                worksheet="Data Barang"
                name="Data Barang.xls"
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
            <v-card outlined>
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
                <template v-slot:[`item.opsi`]="{ item }">
                  <v-btn
                    color="primary"
                    text
                    @click="
                      pilihBarang(
                        item.kode_bahan,
                        item.barcode,
                        item.nama_bahan,
                        item.masuk - item.keluar,
                        item.rp_jual
                      )
                    "
                    v-if="staPilih"
                    :disabled="
                      item.masuk - item.keluar <= 0 && jenis == 'keluar'
                    "
                    ><v-icon>mdi-check-bold</v-icon></v-btn
                  >
                  <v-btn
                    color="primary"
                    text
                    @click="loadUpdate(item.kode_bahan)"
                    v-else
                    ><v-icon>mdi-pen</v-icon></v-btn
                  >
                </template>
                <template v-slot:[`item.stok`]="{ item }">
                  {{ formatNumber(item.masuk - item.keluar) }}
                </template>
                <template v-slot:[`item.rp_jual`]="{ item }">
                  {{ formatNumber(item.rp_jual) }}
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="addData.dialog"
      width="1100px"
      transition="dialog-transition"
    >
      <v-card class="pb-5">
        <v-card-title> Tambah Data </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-form v-model="addData.isValid">
            <v-text-field
              v-model="addData.form.kodeBarang"
              label="(Otomatis) Kode Barang"
              dense
              outlined
              readonly
              placeholder="Otomatis"
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.barcode"
              v-model="addData.form.barcode"
              label="Barcode Produk"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.namaBarang"
              v-model="addData.form.namaBarang"
              label="Nama Barang"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.ukuranBarang"
              v-model="addData.form.ukuranBarang"
              label="Ukuran Barang"
              dense
              outlined
            ></v-text-field>
            <div class="d-flex justify-space-around" v-if="!staUpdate">
              <v-text-field
                :value="addData.form.kodeJenis + ' - ' + addData.form.namaJenis"
                label="Jenis"
                readonly
                dense
                outlined
                class="mr-2"
              ></v-text-field>
              <v-btn @click="dialogJenisBarang = true"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
            </div>
            <div class="d-flex justify-space-around">
              <v-text-field
                :value="addData.form.kodeUnit + ' - ' + addData.form.namaUnit"
                label="Unit"
                dense
                outlined
                class="mr-2"
              ></v-text-field>
              <v-btn @click="dialogUnitBarang = true"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
            </div>
            <v-text-field
              v-model="addData.form.rp_jual"
              label="Harga Jual"
              dense
              outlined
              class="mr-2"
            ></v-text-field>
            <v-divider></v-divider>
            <div class="d-flex justify-end mt-2">
              <v-btn
                color="success"
                v-if="!staUpdate"
                :disabled="!addData.isValid"
                @click="createData()"
                >SIMPAN<v-icon>mdi-floppy</v-icon></v-btn
              >
              <v-btn
                v-else
                color="warning"
                :disabled="!addData.isValid"
                @click="updateData()"
                >UPDATE<v-icon>mdi-floppy</v-icon></v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- JENIS -->
    <v-dialog
      v-model="dialogJenisBarang"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card>
        <jenis-barang :staPilih="true" v-on:jenis="getJenis"></jenis-barang>
      </v-card>
    </v-dialog>

    <!-- UNIT -->
    <v-dialog
      v-model="dialogUnitBarang"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card>
        <unit-view :staPilih="true" v-on:unit="getUnit"></unit-view>
      </v-card>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import JenisBarang from "../Master/JenisBarang.vue";
import UnitView from "../Master/UnitView.vue";
export default {
  props: ["staPilih", "jenis"],
  components: {
    JenisBarang,
    UnitView,
  },
  data() {
    return {
      data: {
        headers: [
          { text: "KODE", value: "kode_bahan", divider: true },
          { text: "BARCODE", value: "barcode", divider: true },
          { text: "JENIS", value: "nm_jenis", divider: true },
          { text: "NAMA", value: "nama_bahan", width: "35%", divider: true },
          { text: "UKURAN", value: "ukuran", divider: true },
          { text: "UNIT", value: "unit", divider: true },
          { text: "STOK", value: "stok", divider: true, align:"right" },
          { text: "HARGA JUAL", value: "rp_jual", divider: true, align:"right" },
          { text: "OPSI", value: "opsi", width: "5%" },
        ],

        items: [],
        loading: false,
        search: "",
      },

      addData: {
        dialog: false,
        isValid: false,
        form: {
          barcode: "",
          namaBarang: "",
          ukuranBarang: "",
          kodeJenis: "",
          namaJenis: "",
          kodeUnit: "",
          namaUnit: "",
          rp_jual: "",
        },
        rules: {
          barcode: [(v) => v != "" || "Barcode Barang Harus Diisi"],
          kodeJenis: [(v) => v != "" || "Pilih Jenis Barang"],
          namaBarang: [
            (v) => v != "" || "Nama Barang Harus Diisi",
            (v) => v.length > 5 || "Nama Barang Harus Lebih dari 5 Karakter",
          ],
          ukuranBarang: [(v) => v != "" || "Ukuran Barang Harus Diisi"],
          kodeUnit: [(v) => v != "" || "Pilih Unit/Satuan Barang"],
        },
        loading: false,
      },
      jenisBarang : {
        items: []
      },
      dialogJenisBarang: false,
      dialogUnitBarang: false,
      child: "",
      staUpdate: false,
    };
  },
  mounted() {
    
    this.loadData();
    this.$refs.inputSearch.focus()
  },
  methods: {
    getJenis(data) {
      this.addData.form.kodeJenis = data.kd_jenis;
      this.addData.form.namaJenis = data.nm_jenis;
      this.dialogJenisBarang = false;
    },
    getUnit(data) {
      this.addData.form.idUnit = data.idUnit;
      this.addData.form.kodeUnit = data.kodeUnit;
      this.addData.form.namaUnit = data.namaUnit;
      this.dialogUnitBarang = false;
    },
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("master/barang", {
          // nm_jenis : this.jenisBarang.value.nm_jenis
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.data.items = res.data.data;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          console.log(err);
        });

        // LOAD JENIS BARANG
      await axios.post("master/jenisbarang").then((res) => {
        this.jenisBarang.items = res.data.data;
      });
      this.data.loading = false;
    },
    async createData() {
      this.addData.loading = true;
      await axios
        .post("master/barang/create", this.addData.form)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.error, "error");
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false;
          this.resetForm();
          this.loadData();
        })
        .catch((err) => {
          swal("Gagal", err, "error");
        });
      this.addData.loading = false;
    },
    resetForm() {
      this.addData.form = {
        barcode: "",
        namaBarang: "",
        ukuranBarang: "",
        kodeJenis: "",
        namaJenis: "",
        kodeUnit: "",
        namaUnit: "",
      };
    },
    async loadUpdate(kode) {
      this.resetForm();
      this.staUpdate = true;
      await axios
        .post("master/barang/bykode", {
          kode_bahan: kode,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.addData.dialog = true;
          this.addData.form.kodeBarang = res.data.data.kode_bahan;
          this.addData.form.barcode = res.data.data.barcode;
          this.addData.form.namaBarang = res.data.data.nama_bahan;
          this.addData.form.ukuranBarang = res.data.data.ukuran;
          this.addData.form.idUnit = res.data.data.id_unit;
          this.addData.form.kodeUnit = res.data.data.unit;
          this.addData.form.namaUnit = res.data.data.nama_unit;
          this.addData.form.rp_jual = res.data.data.rp_jual;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });
    },
    async updateData() {
      console.log(this.addData.form);
      await axios
        .post("master/barang/update", this.addData.form)
        .then((res) => {
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false;
          this.resetForm();
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          swal("Gagal", "Ada Kesalahan Server (404)", "error");
        });
    },
    async fetchData() {
      const res = await axios.post("master/barang");
      return res.data.data;
    },
    pilihBarang(kode_bahan, barcode, nama_bahan, stok, rp_jual) {
      this.$emit("barang", {
        kode_bahan: kode_bahan,
        barcode: barcode,
        nama_bahan: nama_bahan,
        stok: stok,
        rp_jual: rp_jual,
      });
    },
  },
};
</script>

<style></style>
