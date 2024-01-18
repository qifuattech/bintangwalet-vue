<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Data Faktur NT </v-card-title>
          <v-card-text>
            <v-text-field label="Pencarian" v-model="cari"></v-text-field>
            <v-data-table
              :headers="gridHeaders"
              :items="arrData"
              class="elevation-1"
              :search="cari"
              :loading="progress"
            >
              <template v-slot:[`item.opsi`]="{ item }">
                <v-btn
                  color="info"
                  small
                  @click="
                    pilih(
                      item.no_faktur,
                      item.no_po,
                      item.kode_customer,
                      item.nama,
                      item.jenis_penjualan
                    )
                  "
                  >Pilih</v-btn
                >
              </template></v-data-table
            >
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
      arrData: [],
      gridHeaders: [
        { text: "NO. FAKTUR", value: "no_faktur" },
        { text: "NO.PO", value: "no_po" },
        { text: "KODE CUST.", value: "kode_customer" },
        { text: "CUST.", value: "nama" },
        { text: "JENIS PENJUALAN", value: "jenis_penjualan" },
        { text: "RP.", value: "rp_faktur" , align:"right" },
        { text: "OPSI", value: "opsi" },
      ],
      cari: "",
      objectPilih: {
        no_faktur: "",
        no_po: "",
        nama: "",
        jenis_penjualan: "",
      },
      progress: true,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      await axios
        .get(this.$store.state.apiServer + "fakturtrading/nt")
        .then((res) => {
          this.arrData = res.data.data;
          this.progress = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    pilih(no_faktur, no_po, kode_customer,nama, jenis_penjualan) {
      this.objectPilih.no_faktur = no_faktur;
      this.objectPilih.no_po = no_po;
      this.objectPilih.kode_customer = kode_customer;
      this.objectPilih.nama = nama;
      this.objectPilih.jenis_penjualan = jenis_penjualan;
      this.$emit("data", this.objectPilih);
    },
  },
};
</script>

<style>
</style>