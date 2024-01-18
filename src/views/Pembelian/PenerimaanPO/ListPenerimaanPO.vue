<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">PENERIMAAN PURCHASE ORDER (PO) DARI SUPPLIER</div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn color="success" rounded to="/pembelian/terima/input"
                >Tambah Penerimaan<v-icon>mdi-plus-thick</v-icon></v-btn
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
                :fetch="fetchData"
                worksheet="Data Customer"
                name="Data Customer.xls"
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
                    @click="pilihTerima(item.no_bukti, item.no_po)"
                    v-if="staPilih"
                    ><v-icon>mdi-check-bold</v-icon></v-btn
                  >
                  <v-btn
                    color="primary"
                    text
                    @click="loadDetail(item.no_bukti, item.no_po)"
                    v-else
                    ><v-icon>mdi-pen</v-icon></v-btn
                  >
                </template>
                <template v-slot:[`item.nama`]="{ item }">
                  {{ item.nama }}
                </template>
                <template v-slot:[`item.tanggal`]="{ item }">
                  {{ formatDate(item.tanggal) }}
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
  props: ["staPilih"],
  data() {
    return {
      data: {
        headers: [
          { text: "NO. BUKTI", value: "no_bukti", divider: true },
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NO. PO", value: "no_po", divider: true },
          { text: "SUPPLIER", value: "nama", divider: true },
          { text: "SURAT JALAN", value: "no_sj", divider: true },
          { text: "KETERANGAN", value: "keterangan", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadDetail(no_bukti, no_po) {
      this.$router.push({ path:'/pembelian/terima/input', query: {nobukti: no_bukti, nopo: no_po}})
    },
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("pembelian/terima/getall", {})
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.data.items = res.data.data;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });

      this.data.loading = false;
    },
    async fetchData() {
      const res = await axios.post("master/customer");
      return res.data.data;
    },
    pilihTerima(no_bukti,no_po) {
      this.$emit("terima", {
        no_bukti: no_bukti,
        no_po: no_po,
      });
    },
  },
};
</script>

<style></style>
