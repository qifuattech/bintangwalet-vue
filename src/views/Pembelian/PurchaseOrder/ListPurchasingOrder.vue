<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>LIST PURCHASING ORDER (PO)</h2>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <!-- <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-title>
            Filter Data
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
    <v-row class="mt-2">
      <v-col>
        <v-card outlined rounded="lg">
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn
                color="success"
                rounded
                to="/pembelian/po/input"
                ref="tambahData"
                ><v-icon>mdi-plus-thick</v-icon>Tambah PO</v-btn
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
                    @click="pilihPo(item.no_po)"
                    v-if="staPilih"
                    ><v-icon>mdi-check-bold</v-icon></v-btn
                  >
                  <v-btn
                    color="primary"
                    text
                    @click="loadDetail(item.no_po)"
                    v-else
                    ><v-icon>mdi-pen</v-icon></v-btn
                  >
                </template>
                <template v-slot:[`item.nama`]="{ item }">
                  {{ item.nama }}
                </template>
                <template v-slot:[`item.tgl_po`]="{ item }">
                  {{ formatDate(item.tgl_po) }}
                </template>
                <template v-slot:[`item.total`]="{ item }">
                  {{ formatNumber(item.total) }}
                </template>
                <template v-slot:[`item.diskon`]="{ item }">
                  {{ formatNumber(item.diskon) }}
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="addData.dialog"
      width="1100px"
      transition="dialog-transition"
    >
      <v-card class="pb-5">
        <v-card-title> Tambah Data </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-form v-model="addData.isValid">
            <v-text-field
              v-model="addData.form.kode"
              label="(Otomatis) Kode Customer"
              dense
              outlined
              readonly
              placeholder="Otomatis"
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.nama"
              v-model="addData.form.nama"
              label="Nama"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.person"
              v-model="addData.form.person"
              label="Person"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.telepon"
              v-model="addData.form.telepon"
              label="Telepon"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.alamat"
              v-model="addData.form.alamat"
              label="Alamat"
              dense
              outlined
            ></v-text-field>

            <v-divider></v-divider>
            <div class="d-flex justify-end mt-2">
              <v-btn
                color="success"
                v-if="!staUpdate"
                :disabled="!addData.isValid"
                @click="createData()"
                >SIMPAN<v-icon>mdi-floppy</v-icon></v-btn
              >
              <v-btn
                v-else
                color="warning"
                :disabled="!addData.isValid"
                @click="updateData()"
                >UPDATE<v-icon>mdi-floppy</v-icon></v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

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
          { text: "NO. PO", value: "no_po", divider: true },
          { text: "TGL. PO", value: "tgl_po", divider: true,width:"20%" },
          { text: "NAMA SUPPLIER", value: "nama", width: "40%", divider: true },
          {
            text: "JUMLAH (Rp)",
            value: "total",
            align: "right",
            divider: true,
          },
          // {
          //   text: "POTONGAN (Rp)",
          //   value: "diskon",
          //   align: "right",
          //   divider: true,
          // },
          // { text: "PPN", value: "ppn", align: "right", divider: true },
          // { text: "PPH", value: "pph", align: "right", divider: true },
          { text: "KETERANGAN", value: "keterangan", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
      },

      addData: {
        dialog: false,
        isValid: false,
        form: {
          nama: "",
          alamat: "",
          telepon: "",
          person: "",
        },
        rules: {
          nama: [
            (v) => v != "" || "Nama Harus Diisi",
            (v) => v.length > 5 || "Nama Harus Lebih dari 5 Karakter",
          ],
          alamat: [
            (v) => v != "" || "Alamat Harus Diisi",
            (v) => v.length > 5 || "Alamat Harus Lebih dari 5 Karakter",
          ],
          telepon: [
            (v) => v != "" || "Telepon Harus Diisi",
            (v) => v.length > 5 || "Telepon Harus Lebih dari 5 Karakter",
          ],
          person: [
            (v) => v != "" || "Person Harus Diisi",
            (v) => v.length > 5 || "Person Harus Lebih dari 5 Karakter",
          ],
        },
        loading: false,
      },
      dialogJenisBarang: false,
      child: "",
      staUpdate: false,
    };
  },
  mounted() {
    this.$refs.tambahData.$el.focus();
    this.loadData();
  },
  methods: {
    loadDetail(noBukti) {
      this.$router.push({
        path: "/pembelian/po/input",
        query: { noBukti: noBukti },
      });
    },
    getJenis(data) {
      this.addData.form.kodeJenis = data.kd_jenis;
      this.addData.form.namaJenis = data.nm_jenis;
      this.dialogJenisBarang = false;
      console.log(this.addData.form);
    },
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("pembelian/po/getall", {
          tanggal1: this.periode.tanggal1,
          tanggal2: this.periode.tanggal2,
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
    async createData() {
      this.addData.loading = true;
      await axios
        .post("master/customer/create", this.addData.form)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.error, "error");
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false;
          this.resetForm();
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          swal("Gagal", "Ada Kesalahan Server (404)", "error");
        });
      this.addData.loading = false;
    },
    resetForm() {
      this.addData.form = {
        nama: "",
        alamat: "",
        telepon: "",
        person: "",
      };
    },
    async loadUpdate() {},
    async updateData() {
      console.log(this.addData.form);
      await axios
        .post("master/customer/update", this.addData.form)
        .then((res) => {
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false;
          this.resetForm();
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          swal("Gagal", "Ada Kesalahan Server (404)", "error");
        });
    },
    async fetchData() {
      const res = await axios.post("master/customer");
      return res.data.data;
    },
    pilihPo(no_po) {
      this.$emit("po", {
        no_po: no_po,
      });
    },
  },
};
</script>

<style></style>
