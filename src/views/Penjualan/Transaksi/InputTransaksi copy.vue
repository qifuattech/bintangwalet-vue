<template>
  <v-container>
    <!-- INPUT DOC -->
    <v-row>
      <v-col>
        <div class="text-h5">INPUT TRANSAKSI PENJUALAN BARANG DAN JASA</div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col cols="auto" lg="12">
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <div class="d-flex justify-space-around">
                  <v-text-field
                    name="name"
                    label="No. Nota"
                    id="id"
                    dense
                    outlined
                    class="mr-2"
                  ></v-text-field>
                  <v-btn><v-icon>mdi-eye</v-icon></v-btn>
                </div>
                <div class="d-flex justify-space-around">
                  <v-text-field
                    name="name"
                    label="Tanggal"
                    id="id"
                    dense
                    outlined
                    class="mr-2"
                  ></v-text-field>
                  <v-text-field
                    name="name"
                    label=""
                    id="id"
                    dense
                    outlined
                  ></v-text-field>
                </div>
                <div class="d-flex justify-space-around">
                  <v-text-field
                    name="name"
                    label="Customer"
                    id="id"
                    dense
                    outlined
                    class="mr-2"
                  ></v-text-field>
                  <v-btn><v-icon>mdi-magnify</v-icon></v-btn>
                </div>
              </v-col>

              <v-col cols="3">
                <div class="text-h6">PEMBAYARAN</div>
                <v-card outlined>
                  <v-card-text>
                    <v-radio-group dense mandatory value="tunai">
                      <v-row>
                        <v-col cols="6">
                          <v-radio label="TUNAI" value="tunai" dense></v-radio>
                          <v-radio
                            label="KREDIT"
                            value="kredit"
                            dense
                          ></v-radio>
                        </v-col>
                        <v-col cols="6">
                          <v-radio
                            label="TRANSFER"
                            value="transfer"
                            dense
                          ></v-radio>
                          <v-radio label="EDC" value="edc" dense></v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="2">
                <div class="text-h6">TOTAL TRANSAKSI</div>
                <v-card outlined class="d-flex justify-end text-h4 pa-2">
                  Rp. {{ formatNumber(totalTransaksi()) }}
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- END INPUT DOC -->

    <!-- FORM DETAIL -->
    <v-row class="mt-0">
      <v-col cols="3" class="pr-0">
        <v-card outlined>
          <v-card-text>
            <div class="d-flex justify-space-around">
              <v-text-field
                :value="form.nama_bahan + ' - ' + form.kode_bahan"
                label="Nama Bahan"
                dense
                outlined
                class="mr-2"
              ></v-text-field>
              <v-btn @click="showBarang()"><v-icon>mdi-magnify</v-icon></v-btn>
            </div>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Jumlah"
                  v-model="form.jumlah"
                  type="number"
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Harga"
                  v-model="form.rp_jual"
                  type="number"
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Subtotal"
                  :value="form.jumlah * form.rp_jual"
                  type="number"
                  dense
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Stock"
                  :value="form.stok"
                  type="number"
                  readonly
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Harga Up"
                  v-model="form.harga_up"
                  type="number"
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Jumlah Up"
                  v-model="form.jumlah_up"
                  type="number"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="mb-4"></v-divider>
            <v-text-field
              label="Diskon Per @"
              v-model="form.diskon"
              dense
              outlined
            ></v-text-field>
            <v-divider class="mb-4"></v-divider>
            <div class="d-flex justify-end">
              <v-btn color="success" small rounded @click="tambahItem()"
                >TAMBAHKAN <v-icon small>mdi-plus-thick</v-icon></v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card outlined>
          <v-data-table
            :headers="data.headers"
            :items="data.items"
            :loading="data.loading"
            :search="data.search"
          >
            <template v-slot:[`item.subtotal`]="{ item }">
              {{ item.jumlah * item.rp_jual }}
            </template>
            <template v-slot:[`item.subtotal_up`]="{ item }">
              {{ item.jumlah_up * item.harga_up }}
            </template>
            <template v-slot:[`item.diskon_fix`]="{ item }">
              {{ item.jumlah * item.diskon }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- END FORM DETAIL -->

    <!-- FOOTER -->
    <v-row class="mt-0">
      <v-col cols="3" class="pr-0">
        <v-card outlined>
          <v-card-text>
            <v-textarea label="Keterangan" rows="2" outlined> </v-textarea>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-text-field label="Subtotal" :value="formatNumber(subtotalTransaksi()) " readonly  dense outlined></v-text-field>
                <v-text-field label="Potongan" :value="formatNumber(subtotalDiskon()) " readonly dense outlined></v-text-field>
                <v-text-field label="Total" :value="formatNumber(totalTransaksi())" readonly dense outlined></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field label="Total UP" :value="formatNumber(totalTransaksiUp())" readonly dense outlined></v-text-field>
                <v-text-field label="Bayar" v-model="data.bayar" dense outlined></v-text-field>
                <v-text-field label="Kembalian" :value="formatNumber(kembalian())" readonly dense outlined></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- END FOOTER -->

    <!-- SHOW BARANG -->
    <v-dialog
      v-model="barang.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <barang-view :staPilih="true" @barang="getBarang"></barang-view>
      </v-card>
    </v-dialog>
    <!-- END SHOW BARANG -->
  </v-container>
</template>

<script>
import BarangView from "../../Master/BarangView.vue";
// import numeral from 'numeral'
export default {
  components: {
    BarangView,
  },
  data() {
    BarangView;
    return {
      data: {
        headers: [
          { text: "KODE", value: "kode_bahan", divider: true },
          { text: "NAMA BARANG", value: "nama_bahan", divider: true },
          {
            text: "JUMLAH (QTY)",
            value: "jumlah",
            divider: true,
            align: "right",
          },
          {
            text: "HARGA (Rp.)",
            value: "rp_jual",
            divider: true,
            align: "right",
          },
          {
            text: "SUBTOTAL (Rp.)",
            value: "subtotal",
            divider: true,
            align: "right",
          },
          {
            text: "UP - JUMLAH",
            value: "jumlah_up",
            divider: true,
            align: "right",
          },
          {
            text: "UP - HARGA",
            value: "harga_up",
            divider: true,
            align: "right",
          },
          {
            text: "UP - SUBTOTAL",
            value: "subtotal_up",
            divider: true,
            align: "right",
          },
          {
            text: "DISKON",
            value: "diskon_fix",
            divider: true,
            align: "right",
          },
          { text: "KETERANGAN", value: "kode", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
        bayar: ""
      },
      barang: {
        dialog: false,
      },
      form: {
        kode_bahan: "",
        nama_bahan: "",
        stok: "",
        rp_jual: "",
        jumlah: "",
        subtotal: "",
        harga_up: "",
        jumlah_up: "",
        diskon: "",
      },
    };
  },
  methods: {
    showBarang() {
      this.barang.dialog = true;
    },
    getBarang(value) {
      for (let i = 0; i < this.data.items.length; i++) {
        if (value.kode_bahan == this.data.items[i].kode_bahan) {
          this.$notify({
            type: "error",
            text: "Barang Sudah Ada, mohon koreksi kembali",
          });
          return;
        }
      }
      this.form.kode_bahan = value.kode_bahan;

      this.form.nama_bahan = value.nama_bahan;
      this.form.stok = value.stok;
      this.form.rp_jual = value.rp_jual;
      this.form.harga_up = value.rp_jual;
      this.form.jumlah_up = value.stok;
      this.barang.dialog = false;
    },
    tambahItem() {
      this.data.items.push({ ...this.form });
      this.resetForm()
    },
    resetForm() {
      this.form = {
        kode_bahan: "",
        nama_bahan: "",
        stok: "",
        rp_jual: "",
        jumlah: "",
        subtotal: "",
        harga_up: "",
        jumlah_up: "",
        diskon: "",
      };
    },

    totalTransaksi() {
      let a = 0
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + ((this.data.items[i].jumlah * this.data.items[i].rp_jual) - (this.data.items[i].jumlah * this.data.items[i].diskon))
      }
      return a
    },
    subtotalTransaksi() {
      let a = 0
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + (this.data.items[i].jumlah * this.data.items[i].rp_jual)
      }
      return a
    },
    subtotalDiskon() {
      let a = 0
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + (this.data.items[i].jumlah * this.data.items[i].diskon)
      }
      return a
    },
    totalTransaksiUp() {
      let a = 0
      for (let i = 0; i < this.data.items.length; i++) {
        a = a + ((this.data.items[i].jumlah * this.data.items[i].harga_up) - (this.data.items[i].jumlah * this.data.items[i].diskon))
      }
      return a
    },
    kembalian() {
      if (this.data.bayar - this.totalTransaksiUp() < 0 ) {
        return 0
      }
      return this.data.bayar - this.totalTransaksiUp() 
    }

  },
};
</script>

<style>
.total-transaksi {
  text-align: right;
  font-size: 4rem;
}
</style>