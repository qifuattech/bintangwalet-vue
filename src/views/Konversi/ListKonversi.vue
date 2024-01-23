<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>KONVERSI BARANG</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn color="success" rounded to="/konversi/input" ref="tambahData"
                ><v-icon>mdi-plus-thick</v-icon>Tambah Konversi</v-btn
              >
            </div>
            <div class="mr-2">
              <v-menu
                v-model="periode.pickerTanggal1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Tanggal Awal"
                    :value="formatDate(periode.tanggal1)"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    dense
                    outlined
                    
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="periode.tanggal1"
                  @change="loadData()"
                  @input="periode.pickerTanggal1 = false"
                ></v-date-picker>
              </v-menu>
            </div>
            <div class="mr-2">
              <v-menu
                v-model="periode.pickerTanggal2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Tanggal Akhir"
                    :value="formatDate(periode.tanggal2)"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    dense
                    outlined
                    
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="periode.tanggal2"
                  @change="loadData()"
                  @input="periode.pickerTanggal2 = false"
                ></v-date-picker>
              </v-menu>
            </div>
            <div>
              <v-text-field
                name="name"
                label="Pencarian"
                outlined
                dense
                hide-details
                v-model="data.search"
                append-icon="mdi-magnify"
                clearable
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
                  <!-- <v-btn
                    color="primary"
                    text
                    @click="loadDetail(item.no_bukti, item.no_po)"
                    v-else
                    ><v-icon>mdi-pen</v-icon></v-btn
                  > -->
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
      periode: {
        pickerTanggal1: false,
        tanggal1:
          new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 7) + "-01",
        pickerTanggal2: false,
        tanggal2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      },
      data: {
        headers: [
          { text: "NO. RETUR", value: "no_retur", divider: true },
          { text: "TANGGAL", value: "tanggal", divider: true },
          { text: "NO. TERIMA", value: "no_terima", divider: true },
          { text: "NO. PO", value: "no_po", divider: true },
          { text: "SUPPLIER", value: "nama", divider: true },
          { text: "TOTAL (QTY)", value: "tot_qty", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
      },
    };
  },
  mounted() {
    this.$refs.tambahData.$el.focus();
    this.loadData();
  },
  methods: {
    loadDetail(no_bukti, no_po) {
      this.$router.push({
        path: "/pembelian/terima/input",
        query: { noBukti: no_bukti, noPo: no_po },
      });
    },
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("pembelian/return", {
          tanggal1 : this.periode.tanggal1,
          tanggal2 : this.periode.tanggal2,
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
          this.$notify({ type: "error", text: err });
        });

      this.data.loading = false;
    },
    async fetchData() {
      const res = await axios.post("master/customer");
      return res.data.data;
    },
    pilihTerima(no_bukti, no_po) {
      this.$emit("terima", {
        no_bukti: no_bukti,
        no_po: no_po,
      });
    },
  },
};
</script>

<style></style>
