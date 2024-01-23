<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-start">
        <div>
          <v-btn color="primary" text to="/konversi" class="mr-3"
            ><v-icon x-large>mdi-arrow-left-bold</v-icon></v-btn
          >
        </div>
        <h2>INPUT KONVERSI</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col cols="5">
                <v-card outlined>
                  <v-card-title class="d-flex justify-end"> AWAL </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <div class="d-flex justify-space-around">
                      <v-text-field
                        label="Kode Barang Awal"
                        dense
                        outlined
                        class="mr-2"
                        readonly
                        :value="data.awal.kode_bahan"
                      ></v-text-field>
                      <v-btn
                        color="light-blue lighten-4"
                        @click="showBarang('awal')"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div>
                    <v-text-field
                      label="Nama Barang"
                      dense
                      outlined
                      :value="data.awal.nama_bahan + ' ' + data.awal.ukuran"
                      class="mr-2"
                      readonly
                      background-color="blue-grey lighten-5"
                    ></v-text-field>
                    <v-text-field
                      label="Unit"
                      dense
                      outlined
                      :value="data.awal.unit"
                      class="mr-2"
                      readonly
                      background-color="blue-grey lighten-5"
                    ></v-text-field>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          label="Jumlah"
                          dense
                          outlined
                          class="mr-2"
                          type="number"
                          v-model="data.awal.jumlah"
                          @input="proteksiStok()"
                          background-color="light-blue lighten-5"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          label="Stok"
                          dense
                          outlined
                          class="mr-2"
                          type="number"
                          v-model="data.awal.stok"
                          background-color="light-blue lighten-5"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="2" class="d-flex justify-center">
                <v-icon x-large color="success">mdi-arrow-right-thick</v-icon>
              </v-col>
              <v-col cols="5">
                <v-card outlined>
                  <v-card-title class="d-flex justify-start">
                    TUJUAN
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <div class="d-flex justify-space-around">
                      <v-text-field
                        label="Kode Barang Tujuan"
                        dense
                        outlined
                        readonly
                        class="mr-2"
                        :value="data.tujuan.kode_bahan"
                      ></v-text-field>
                      <v-btn
                        color="light-blue lighten-4"
                        @click="showBarang('tujuan')"
                        ><v-icon>mdi-magnify</v-icon></v-btn
                      >
                    </div>
                    <v-text-field
                      label="Nama Barang"
                      dense
                      outlined
                      :value="data.tujuan.nama_bahan + ' ' + data.tujuan.ukuran"
                      class="mr-2"
                      background-color="blue-grey lighten-5"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      label="Unit"
                      dense
                      outlined
                      :value="data.tujuan.unit"
                      background-color="blue-grey lighten-5"
                      readonly
                      class="mr-2"
                    ></v-text-field>
                    <v-text-field
                      label="Jumlah"
                      dense
                      outlined
                      class="mr-2"
                      type="number"
                      v-model="data.tujuan.jumlah"
                      background-color="light-blue lighten-5"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn color="success" :loading="loading" @click="createData()"
                ><v-icon class="mr-2" >mdi-floppy</v-icon>
                SIMPAN</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import axios from "axios";
import BarangView from "../Master/BarangView.vue";
import swal from "sweetalert";
export default {
  components: {
    BarangView,
  },
  data() {
    return {
      data: {
        awal: {
          kode_bahan: "",
          nama_bahan: "",
          ukuran: "",
          unit: "",
          jumlah: "",
          stok: "",
        },
        tujuan: {
          kode_bahan: "",
          nama_bahan: "",
          ukuran: "",
          unit: "",
          jumlah: "",
          stok: "",
        },
        
      },
      loading: false,
      barang: {
        dialog: false,
        staAwal: false,
        staTujuan: false,
      },
    };
  },
  methods: {
    proteksiStok() {
      if (this.data.awal.jumlah > this.data.awal.stok) {
        this.$notify({ type: "warning", text: "Jumlah Melebihi Stok" });
        this.data.awal.jumlah = 0;
      }
    },
    showBarang(jenis) {
      this.barang.dialog = true;
      if (jenis == "awal") {
        this.barang.staAwal = true;
      } else {
        this.barang.staTujuan = true;
      }
    },
    getBarang(value) {
      this.loadBarang(value.kode_bahan);
    },
    async loadBarang(kode) {
      await axios
        .post("master/barang/bykode", {
          kode_bahan: kode,
        })
        .then((res) => {
          if (this.barang.staAwal == true) {
            this.data.awal.kode_bahan = res.data.data.kode_bahan;
            this.data.awal.nama_bahan = res.data.data.nama_bahan;
            this.data.awal.ukuran = res.data.data.ukuran;
            this.data.awal.unit = res.data.data.unit;
            this.data.awal.stok = res.data.data.masuk - res.data.data.keluar;
          } else {
            this.data.tujuan.kode_bahan = res.data.data.kode_bahan;
            this.data.tujuan.nama_bahan = res.data.data.nama_bahan;
            this.data.tujuan.ukuran = res.data.data.ukuran;
            this.data.tujuan.unit = res.data.data.unit;
            this.data.tujuan.stok = res.data.data.masuk - res.data.data.keluar;
          }
          this.barang.dialog = false;
          this.barang.staAwal = false;
          this.barang.staTujuan = false;
        });
    },
    async createData() {
      this.loading = true;
      await axios
        .post("konversi/create", this.data)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.error, "error");
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.resetForm();
        })
        .catch((err) => {
          swal("Sukses", err.data.error, "success");
        });
      this.loading = false;
    },
    resetForm() {
      this.data.awal.kode_bahan = "";
      this.data.awal.nama_bahan = "";
      this.data.awal.ukuran = "";
      this.data.awal.unit = "";
      this.data.awal.stok = "";
      this.data.tujuan.kode_bahan = "";
      this.data.tujuan.nama_bahan = "";
      this.data.tujuan.ukuran = "";
      this.data.tujuan.unit = "";
      this.data.tujuan.stok = "";
    },
  },
};
</script>

<style>
</style>