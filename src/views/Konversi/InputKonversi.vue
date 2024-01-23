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
                <div class="d-flex justify-space-around">
                  <v-text-field
                    label="Kode Barang Awal"
                    dense
                    outlined
                    class="mr-2"
                  ></v-text-field>
                  <v-btn color="light-blue lighten-4" @click="showBarang()"
                    ><v-icon>mdi-magnify</v-icon></v-btn
                  >
                </div>
                <v-text-field
                  label="Jumlah"
                  dense
                  outlined
                  class="mr-2"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="d-flex justify-center">
                <v-icon x-large color="success">mdi-arrow-right-thick</v-icon>
              </v-col>
              <v-col cols="5">
                <div class="d-flex justify-space-around">
                  <v-text-field
                    label="Kode Barang Tujuan"
                    dense
                    outlined
                    class="mr-2"
                  ></v-text-field>
                  <v-btn color="light-blue lighten-4"
                    ><v-icon>mdi-magnify</v-icon></v-btn
                  >
                </div>
                <v-text-field
                  label="Jumlah"
                  dense
                  outlined
                  class="mr-2"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex justify-end">
              <v-btn color="success"
                ><v-icon class="mr-2">mdi-floppy</v-icon> SIMPAN</v-btn
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
export default {
  components: {
    BarangView,
  },
  data() {
    return {
      data: {
        awal: {
          kode_bahan: "",
          ukuran: "",
          unit: "",
        },
        tujuan: {
          kode_bahan: "",
          ukuran: "",
          unit: "",
        },
      },
      barang: {
        dialog: false,
        staAwal: false,
        staTujuan: false,
      },
    };
  },
  methods: {
    showBarang(jenis) {
      this.barang.dialog = true;
      if (jenis == "awal") {
        this.staAwal = true;
      } else {
        this.staTujuan = true;
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
          if (this.staAwal == true) {
            this.data.awal.kode_bahan = res.data.data.kode_bahan;
            this.data.awal.ukuran = res.data.data.ukuran;
            this.data.awal.unit = res.data.data.unit;
          } else {
            this.data.akhir.kode_bahan = res.data.data.kode_bahan;
            this.data.akhir.ukuran = res.data.data.ukuran;
            this.data.akhir.unit = res.data.data.unit;
          }
        });
    },
  },
};
</script>

<style>
</style>