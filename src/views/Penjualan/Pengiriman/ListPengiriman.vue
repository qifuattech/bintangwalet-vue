<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>LIST PENGIRIMAN</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn
                color="success"
                rounded
                to="/penjualan/pengiriman/input"
                >Tambah Data<v-icon>mdi-plus-thick</v-icon></v-btn
              >
            </div>
            <div>
              <v-text-field
                name="name"
                label="Pencarian"
                outlined
                dense
                hide-details
                v-model="data.search"
              ></v-text-field>
            </div>
            <v-spacer></v-spacer>
            <div>
              <download-excel
                class="btn btn-default"
                worksheet="Data Pengiriman"
                name="Data Pengiriman.xls"
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
            <v-card outlined class="mt-2">
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
              <template v-slot:[`item.tanggal`]="{ item }">
                  {{ formatDate(item.tanggal) }}
                </template>
                <template v-slot:[`item.opsi`]="{}">
                  <v-btn color="primary" text><v-icon>mdi-pen</v-icon> </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: {
        headers: [
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NO SJ", value: "no_sj", divider: true },
          { text: "NO PENJUALAN", value: "no_bukti", divider: true },
          { text: "CUSTOMER", value: "nama", divider: true },
          { text: "JUMLAH", value: "jumlah", divider: true },
          { text: "OPSI", value: "opsi", divider: true },
        ],
        items: [],
        loading: false,
        search: "",
      },
    };
  },
  mounted() {
    this.loadData(0);
  },
  methods: {
    
    async loadData() {
      this.data.loading = true
      await axios.post("penjualan/pengiriman").then((res) => {
        if (res.status != 200) {
          this.$notify({ type: "error", text: res.data.error });
          return;
        }
        this.data.items = res.data.data;
      });
      this.data.loading = false
    },
  },
};
</script>

<style>
</style>