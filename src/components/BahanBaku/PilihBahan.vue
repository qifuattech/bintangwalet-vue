<template>
  <div>
    <v-stepper v-model="nStep" vertical>
      <v-stepper-step :complete="nStep > 1" step="1">
        Pilih Jenis Bahan
        <small>{{ sKodeJenis }} - {{ sJenisBahan }}</small>
      </v-stepper-step>

      <!-- PILIH JENIS BAHAN -->
      <v-stepper-content step="1">
        <v-card
          v-if="jenisBahan.isLoading"
          class="mb-4"
          color="grey lighten-4"
          elevation="0"
        >
          <div class="d-flex justify-center">
            <v-progress-circular
              :size="100"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-card>
        <v-card v-else class="mb-4" color="grey lighten-4" elevation="0">
          <v-card-text>
            <v-row>
              <v-col
                cols="3"
                v-for="item in jenisBahan.arrData"
                :key="item.kode_jenis"
              >
                <v-card
                  outlined
                  elevation="0"
                  @click="pilihJenis(item.kode_jenis, item.jenis_bahan)"
                >
                  <v-card-text>
                    <div class="d-flex justify-center">
                      <v-icon x-large>mdi-cog</v-icon>
                    </div>
                    <v-divider class="my-2"></v-divider>

                    <div>{{ item.jenis_bahan }} - {{ item.kode_jenis }}</div>
                    <div>{{ item.jumlah_bahan }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-btn color="primary" small @click="nStep = 2"> SELANJUTNYA </v-btn>
      </v-stepper-content>
      <!-- END PILIH JENIS BAHAN -->

      <!-- PILIH KATEGORI BAHAN -->
      <v-stepper-step :complete="nStep > 2" step="2">
        Pilih Kategori Bahan
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card
          v-if="kategoriBahan.isLoading"
          class="mb-4"
          color="grey lighten-4"
          elevation="0"
        >
          <div class="d-flex justify-center">
            <v-progress-circular
              :size="100"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-card>
        <v-card v-else class="mb-4" color="grey lighten-4" elevation="0">
          <v-card-text>
            <v-row>
              <v-col
                cols="3"
                v-for="item in kategoriBahan.arrData"
                :key="item.kode_kategori"
              >
                <v-card
                  outlined
                  elevation="0"
                  @click="pilihKategori(item.kode_kategori, item.kategori_bahan)"
                >
                  <v-card-text>
                    <div class="d-flex justify-center">
                      <v-icon x-large>mdi-cog</v-icon>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    
                    <div>{{ item.kategori_bahan }} - {{ item.kode_kategori }}</div>
                    <div>{{ item.jumlah_bahan }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-btn color="primary" small @click="nStep = 3"> SELANJUTNYA </v-btn>
        <v-btn text small @click="nStep = 1"> KEMBALI </v-btn>
      </v-stepper-content>
      <!-- END PILIH KATEGORI BAHAN -->

      <v-stepper-step :complete="nStep > 3" step="3">
        Select an ad format and name ad unit
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="nStep = 4"> Continue </v-btn>
        <v-btn text> Cancel </v-btn>
      </v-stepper-content>

      <v-stepper-step step="4"> View setup instructions </v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="nStep = 1"> Continue </v-btn>
        <v-btn text> Cancel </v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      jenisBahan: {
        arrData: [],
        isLoading: true,
      },

      kategoriBahan: {
        arrData: [],
        isLoading: true,
      },

      nStep: 1,
      sKodeJenis: "",
      sJenisBahan: "",

      sKodeKategori: "",
      sKategoriBahan: "",
    };
  },
  created() {
    this.loadJenisBahan();
  },
  methods: {
    loadJenisBahan() {
      this.jenisBahan.isLoading = true;
      axios
        .get("bahanbaku/jenis")
        .then((res) => {
          if (res.data.success == true) {
            this.jenisBahan.arrData = res.data.data;
            this.jenisBahan.isLoading = false;
            return;
          }
        })
        .catch((err) => console.log(err));
    },
    pilihJenis(kode, jenis) {
      this.sKodeJenis = kode;
      this.sJenisBahan = jenis;
      this.loadKategoriBahan();
    },
    
    loadKategoriBahan() {
      this.kategoriBahan.isLoading = true;
      axios.get("bahanbaku/"+ this.sKodeJenis + "/kategori")
        .then((res) => {
          if (res.data.success == true) {
            this.kategoriBahan.arrData = res.data.data;
            this.kategoriBahan.isLoading = false;
            return;
          }
        })
        .catch((err) => console.log(err));
    },
    pilihKategori(kode, kategori) {
      this.sKodeKategori = kode;
      this.sKategoriBahan = kategori;
    },
  },
};
</script>

<style>
</style>