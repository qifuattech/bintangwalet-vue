<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-start">
        <div>
          <v-btn color="primary" text to="/pembelian/terima" class="mr-3"
            ><v-icon x-large>mdi-arrow-left-bold</v-icon></v-btn
          >
        </div>
        <h2>INPUT PENERIMAAN PO SUPPLIER</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col cols="auto" lg="8">
        <v-card outlined rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <div class="d-flex justify">
                  <v-text-field
                    label="No Transaksi (Otomatis)"
                    outlined
                    dense
                    class="mr-2"
                    readonly
                    :value="data.no_bukti"
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-btn @click="showTerima()"><v-icon>mdi-eye</v-icon></v-btn>
                </div>
                <v-menu
                  v-model="data.pickerTanggal"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      label="Tanggal"
                      :value="getFormatDate(data.tanggal)"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      dense
                      outlined
                      background-color="light-blue lighten-5"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.tanggal"
                    @input="data.pickerTanggal = false"
                  ></v-date-picker>
                </v-menu>
                <div class="d-flex justify">
                  <v-text-field
                    :value="data.no_po"
                    label="No. PO"
                    outlined
                    dense
                    class="mr-2"
                    background-color="blue-grey lighten-5"
                  ></v-text-field>
                  <v-btn
                    color="light-blue lighten-4"
                    @click="showPo()"
                    :disabled="staView"
                    ><v-icon>mdi-magnify</v-icon></v-btn
                  >
                </div>
              </v-col>
              <v-col cols="auto" lg="6">
                <v-text-field
                  label="Supplier"
                  readonly
                  :value="data.kodeSupplier + ' - ' + data.namaSupplier"
                  dense
                  outlined
                  background-color="blue-grey lighten-5"
                ></v-text-field>
                <v-text-field
                  label="No. SJ"
                  v-model="data.noSj"
                  dense
                  outlined
                  background-color="light-blue lighten-5"
                ></v-text-field>
                <v-text-field
                  label="Keterangan"
                  v-model="data.keterangan"
                  dense
                  outlined
                  background-color="light-blue lighten-5"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-card outlined rounded="lg">
              <v-data-table
                :headers="data.headers"
                :items="data.items"
                :loading="data.loading"
                :search="data.search"
                dense
              >
                <template v-slot:header.jml_dtg="{ header }">
                  {{ header.text }}
                  <v-btn
                    class="mr-2"
                    color="primary"
                    rounded
                    x-small
                    @click="setAllDatang()"
                    ><v-icon x-small>mdi-check-all</v-icon>Cek</v-btn
                  >
                </template>
                <template v-slot:[`item.no`]="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:item.jml_dtg="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.jml_dtg"
                    @save="
                      saveJmlDtg(
                        props.index,
                        props.item.jml_dtg,
                        props.item.jumlah,
                        props.item.dtg2
                      )
                    "
                  >
                    {{ props.item.jml_dtg }}
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.jml_dtg"
                        type="number"
                        label="Edit"
                        single-line
                        dense
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-card>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-end">
              <v-btn class="mr-2" @click="resetAll()"
                >BARU <v-icon>mdi-file-refresh-outline</v-icon></v-btn
              >
              <v-btn
                color="warning"
                @click="updateData()"
                v-if="staView"
                :disabled="!staValid()"
                >UPDATE<v-icon>mdi-content-save-edit-outline</v-icon></v-btn
              >
              <v-btn
                color="success"
                @click="createData()"
                v-else
                :disabled="!staValid()"
                >SIMPAN <v-icon>mdi-floppy</v-icon></v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="po.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <list-purchase-order :staPilih="true" @po="getPo"></list-purchase-order>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="terima.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card outlined>
        <ListPenerimaanPO
          :staPilih="true"
          @terima="getTerima"
        ></ListPenerimaanPO>
      </v-card>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import moment from "moment";
import ListPurchaseOrder from "@/views/Pembelian/PurchaseOrder/ListPurchasingOrder.vue";
// import ListPenerimaanPO from "@/views/Pembelian/PurchaseOrder/ListPenerimaanPO.vue";
import axios from "axios";
import swal from "sweetalert";
import ListPenerimaanPO from "./ListPenerimaanPO.vue";

export default {
  components: {
    ListPurchaseOrder,
    ListPenerimaanPO,
  },
  data() {
    return {
      data: {
        headers: [
          { text: "NO", value: "no", divider: true },
          { text: "KODE BARANG", value: "kode_bahan", divider: true },
          {
            text: "NAMA BARANG",
            value: "nama_bahan",
            align: "right",
            divider: true,
          },
          {
            text: "KETERANGAN",
            value: "keterangan",
            align: "right",
            divider: true,
          },
          {
            text: "JUMLAH BELI",
            value: "jumlah",
            align: "right",
            divider: true,
          },
          {
            text: "TOTAL DATANG",
            value: "dtg2",
            align: "right",
            divider: true,
          },
          {
            text: "JUMLAH DATANG",
            value: "jml_dtg",
            align: "right",
            divider: true,
            sortable: false,
          },
        ],
        items: [],

        loading: false,
        search: "",
        kodeSupplier: "",
        namaSupplier: "",
        pickerTanggal: false,

        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        noSj: "",
        keterangan: "",
        no_po: "",
        no_bukti: "",
      },
      po: {
        dialog: false,
        kd_supplier: "",
        nama: "",
        doc: {
          kd_supplier: "",
          nama: "",
        },
        detail: [],
      },
      terima: {
        dialog: false,
      },
      staView: false,
      staFull: false,
    };
  },
  mounted() {
    if ((this.$route.query.noBukti != "" && this.$route.query.noBukti != undefined) && (this.$route.query.noPo != "" && this.$route.query.noPo != undefined) ) {
      this.data.no_bukti = this.$route.query.nobukti;
      this.data.no_po = this.$route.query.noPo;
      this.loadTerima();
    }
  },
  methods: {
    resetAll() {
      this.data.kodeSupplier = "";
      this.data.namaSupplier = "";
      this.data.noSj = "";
      this.data.keterangan = "";
      this.data.no_po = "";
      this.data.no_bukti = "";
      this.data.items = [];
      this.staView = false;
      this.staFull = false;
    },
    showTerima() {
      this.terima.dialog = true;
    },
    getTerima(value) {
      this.data.no_bukti = value.no_bukti;
      this.data.no_po = value.no_po;
      this.terima.dialog = false;
      this.staView = true;
      this.loadTerima();
    },
    getFormatDate(value) {
      // moment.locale('id')
      if (moment(String(value)).isValid()) {
        return moment(String(value)).format("DD-MM-YYYY");
      }
      return "-";
    },
    showPo() {
      this.po.dialog = true;
    },
    async loadTerima() {
      this.staFull = false;
      await axios
        .post("pembelian/terima/bybukti", {
          no_bukti: this.data.no_bukti,
          no_po: this.data.no_po,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.data.kodeSupplier = res.data.dataDoc.kd_supplier;
          this.data.namaSupplier = res.data.dataDoc.nama;
          this.data.noSj = res.data.dataDoc.no_sj;
          this.data.items = res.data.dataDetail;
          this.$notify({ type: "success", text: res.data.message });
        });
    },
    async loadPo() {
      this.staFull = false;
      await axios
        .post("pembelian/po/bypo", {
          no_po: this.data.no_po,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.po.doc = res.data.dataDoc;
          this.data.kodeSupplier = res.data.dataDoc.kd_supplier;
          this.data.namaSupplier = res.data.dataDoc.nama;
          this.data.items = res.data.dataDetail;
          this.$notify({ type: "success", text: res.data.message });
          let a = 0;
          for (let i = 0; i < res.data.dataDetail.length; i++) {
            if (res.data.dataDetail[i].jumlah == res.data.dataDetail[i].dtg2) {
              a++;
            }
          }
          if (a == res.data.dataDetail.length) {
            this.staFull = true;
          } else {
            this.staFull = false;
          }
        });
    },
    getPo(value) {
      this.po.no_po = value.no_po;
      this.data.no_po = value.no_po;
      this.po.dialog = false;
      this.loadPo();
    },
    saveJmlDtg(index, jmlDtg, jumlah, dtg2) {
      // console.log(!isNaN(parseFloat(jmlDtg)));
      // console.log(isFinite(jmlDtg));
      if (!isNaN(parseFloat(jmlDtg)) && isFinite(jmlDtg)) {
        if (jumlah - dtg2 < jmlDtg) {
          this.$notify({ type: "error", text: "Jumlah Datang Melebihi" });
          setTimeout(() => {
            this.data.items[index].jml_dtg = 0;
          }, 100);
        } else {
          this.$notify({ type: "success", text: "Jumlah Aman" });
          setTimeout(() => {
            this.data.items[index].jml_dtg = jmlDtg;
          }, 100);
        }
      } else {
        this.$notify({ type: "error", text: "Masukkan Angka Valid" });
        setTimeout(() => {
          this.data.items[index].jml_dtg = 0;
        }, 100);
      }
    },
    setAllDatang() {
      for (let i = 0; i < this.data.items.length; i++) {
        this.data.items[i].jml_dtg =
          this.data.items[i].jumlah - this.data.items[i].dtg2;
      }
    },
    async createData() {
      if (this.data.items == []) {
        this.$notify({ type: "error", text: "Pilih PO terlebih dahulu" });
        return;
      }
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a++;
      }
      if (a == 0) {
        this.$notify({
          type: "error",
          text: "Masukkan Jumlah datang terlebih dahulu",
        });
      }

      await axios
        .post("pembelian/terima/create", this.data)
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.resetAll();
        })
        .catch((err) => {
          swal("Gagal", "Ada Kesalahan Server (404) : " + err, "error");
        });
    },
    staValid() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        if (this.data.items[i].jumlah == this.data.items[i].dtg2) {
          a++;
        }
      }

      var sumDatang = this.data.items.reduce((b, item) => b + item.jml_dtg, 0);
      // console.log('sumDatang : ' + sumDatang);

      if (a == this.data.items.length || sumDatang <= 0) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style></style>
