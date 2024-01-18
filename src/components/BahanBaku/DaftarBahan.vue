<template>
  <v-card>
    <v-card-title class="py-2">
      Daftar Bahan
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row class="mt-2 d-flex justify-space-between">
        <v-col cols="auto">
          <v-text-field label="Filter Data" v-model="filter" persistent-hint dense outlined append-icon="mdi-filter" hint="Filter hanya menampilkan 1000 baris pertama"></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn color="info" @click="loadData()">Filter</v-btn>
        </v-col>
      <!-- </v-row>
      <v-row class="mt-2"> -->
        <v-col>
          <v-text-field v-model="data.search" label="Pencarian" dense outlined append-icon="mdi-magnify" hide-details></v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col>
          <v-card outlined class="mb-2">
            <v-card-text class="pa-0">
              <v-data-table dense :headers="data.headers" :items="data.items" :loading="data.loading" :search="data.search">
                <template v-slot:[`item.opsi`]="{ item }">
                  <v-btn color="info" x-small outlined rounded @click="pilihItem(item.kode_bahan)">
                    <v-icon small>mdi-check</v-icon>
                  </v-btn>
                </template>
                <template v-slot:[`item.nama_bahan`]="{ item }">
                    {{ item.nama_bahan }} {{ item.ukuran }}
                </template>
                <template v-slot:[`item.limit`]="{ item }">
                    {{ getFormatNumber0(item.limit) }}
                </template>
                <template v-slot:[`item.stok`]="{ item }">
                    {{ getFormatNumber0(item.stok) }}
                </template>
                <template v-slot:[`item.harga`]="{ item }">
                    {{ getFormatNumber2(item.harga) }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import numeral from 'numeral';
export default {
  data() {
    return {
      filter: "",
      data: {
        headers: [
        { text: "Kode Bahan", value: "kode_bahan", divider: true },
        { text: "Nama Bahan ", value: "nama_bahan", divider: true },
          { text: "Satuan", value: "unit", divider: true },
          { text: "Minimum Stok", value: "limit", divider: true, align: "right" },
          { text: "Stok", value: "stok", divider: true, align: "right" },
          { text: "Harga Perkiraan", value: "harga", divider: true, align: "right" },
          { text: "Opsi", value: "opsi", divider: true, align: "center" },
        ],
        items: [],
        loading: false,
        search: ""
      }
    }
  },
  mounted() { 
    this.loadData()
  },
  methods: {
    pilihItem(kode_bahan) {
          this.$emit('kode_bahan', kode_bahan)
      },
    getFormatNumber2(rp) {
            return numeral(rp).format("0,2");
        },
        getFormatNumber0(rp) {
            return numeral(rp).format("0,0");
        },
    loadData() {
      this.data.loading = true
      this.data.items = []
      axios.post('master/bahanbaku', {
        filter: this.filter
      })
      .then((res) => {
        if (res.data.success == false) {
          
          return
        }
        this.data.loading = false
        this.data.items = res.data.result
      })
      
    }
  }
}
</script>

<style>

</style>