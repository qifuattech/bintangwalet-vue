<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">MASTER AKUN</div>
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
                @click="
                  (addData.dialog = true), resetForm(), (staUpdate = false)
                "
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
              >
                <template v-slot:[`item.opsi`]="{ item }">
                  <v-btn
                    color="primary"
                    text
                    @click="pilihAkun(item.kode_akun, item.nama_akun)"
                    v-if="staPilih"
                    ><v-icon>mdi-check-bold</v-icon></v-btn
                  >
                  <v-btn
                    color="primary"
                    text
                    @click="loadUpdate(item.kode_bahan)"
                    v-else
                    ><v-icon>mdi-pen</v-icon></v-btn
                  >
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
              v-model="addData.form.kode_akun"
              label="(Otomatis) Kode Akun"
              dense
              outlined
              readonly
              placeholder="Otomatis"
              background-color="#f7f7f7"
            ></v-text-field>
            <div class="d-flex justify-space-around">
              <v-text-field
                :rules="addData.rules.nama_rekening"
                :value="addData.form.nama_rekening"
                label="Kelompok/Rekening"
                dense
                outlined
                readonly
                class="mr-2"
              ></v-text-field>
              <v-btn @click="showRekening()"
                ><v-icon>mdi-magnify</v-icon></v-btn
              >
            </div>
            <div class="d-flex justify-space-around">
              <v-col cols="3" class="pa-0">
                <v-text-field
                  :value="addData.form.kode_rekening"
                  dense
                  outlined
                  readonly
                  background-color="#f7f7f7"
                  class="mr-2"
                ></v-text-field>
              </v-col>
              <v-col cols="9" class="pa-0">
                <v-text-field
                  :rules="addData.rules.kode_akun"
                  v-model="addData.form.kode_akun"
                  label="Kode Akun (Otomatis)"
                  dense
                  outlined
                  readonly
                  background-color="#f7f7f7"
                ></v-text-field>
              </v-col>
            </div>
            <v-text-field
              :rules="addData.rules.nama_akun"
              v-model="addData.form.nama_akun"
              label="Nama Akun"
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

    <v-dialog
      v-model="rekening.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card>
        <rekening-view :staPilih="true" @rekening="getRekening"></rekening-view>
      </v-card>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>
  
  <script>
import axios from "axios";
import swal from "sweetalert";
import RekeningView from "./RekeningView.vue";
export default {
  props: ["staPilih", "kode_rekening"],
  components: {
    RekeningView,
  },
  data() {
    return {
      data: {
        headers: [
          { text: "KODE REKENING", value: "kode_rekening", divider: true },
          { text: "KELOMPOK", value: "nama_rekening", divider: true },
          { text: "KODE AKUN", value: "kode_akun", divider: true },
          { text: "NAMA AKUN", value: "nama_akun", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
      },
      rekening: {
        dialog: false,
      },
      addData: {
        dialog: false,
        isValid: false,
        form: {
          kode_rekening: "",
          nama_rekening: "",
          kode_akun: "",
          nama_akun: "",
        },
        rules: {
          kode_rekening: [
            (v) => v != "" || "Kelompok Harus Dipilih Harus Diisi",
          ],
          nama_akun: [(v) => v != "" || "Nama Akun Harus Diisi"],
        },
        loading: false,
      },

      child: "",
      staUpdate: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    showRekening() {
      this.rekening.dialog = true;
    },
    getRekening(value) {
      this.addData.form.kode_rekening = value.kode_rekening;
      this.addData.form.nama_rekening = value.nama_rekening;
      this.rekening.dialog = false;
    },
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("master/akun", {
          kode_rekening: this.kode_rekening,
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
        .post("master/akun/create", this.addData.form)
        .then((res) => {
          if (res.status != 200) {
            swal(
              "Gagal",
              "Ada Kesalahan Server (400) : " + res.data.error,
              "error"
            );
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false;
          this.resetForm();
          this.loadData();
        })
        .catch((err) => {
          console.log(err);
          swal("Gagal", "Ada Kesalahan Client (404)", "error");
        });
      this.addData.loading = false;
    },
    resetForm() {
      this.addData.form = {
        kode_rekening: "",
        nama_rekening: "",
        kode_akun: "",
        nama_akun: "",
      };
    },
    async loadUpdate(kode) {
      this.resetForm();
      this.staUpdate = true;
      await axios
        .post("master/akun/bykode", {
          kode_akun: kode,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.addData.dialog = true;
          this.addData.form.kode_rekening = res.data.data.kode_rekening;
          this.addData.form.nama_rekening = res.data.data.nama_rekening;
          this.addData.form.kode_akun = res.data.data.kode_akun;
          this.addData.form.nama_akun = res.data.data.nama_akun;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });
    },
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
    pilihAkun(kode_akun, nama_akun) {
      this.$emit("akun", {
        kode_akun: kode_akun,
        nama_akun: nama_akun,
      });
    },
  },
};
</script>
  
  <style></style>
  