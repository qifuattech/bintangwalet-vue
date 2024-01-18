<template>
    <v-container>
      <v-row>
        <v-col>
          <div class="text-h5">MASTER SALES</div>
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
                    <v-btn color="primary" text @click="loadUpdate(item.kode)"
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
          <v-card-title>
            Tambah Data
          </v-card-title>
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
  
      <v-dialog
        v-model="dialogJenisBarang"
        max-width="1000px"
        transition="dialog-transition"
      >
        <v-card>
          <jenis-barang v-on:jenis="getJenis"></jenis-barang>
        </v-card>
      </v-dialog>
  
      <notifications position="bottom right"></notifications>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  import swal from "sweetalert";
  import JenisBarang from "../Master/JenisBarang.vue";
  export default {
    components: {
      JenisBarang,
    },
    data() {
      return {
        data: {
          headers: [
            { text: "KODE", value: "kode", divider: true },
            { text: "NAMA", value: "nama", divider: true },
            { text: "ALAMAT", value: "alamat", width: "50%", divider: true },
            { text: "PERSON", value: "person", divider: true },
            { text: "TELEPON", value: "telepon", divider: true },
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
          },
          loading: false,
        },
        dialogJenisBarang: false,
        child: "",
        staUpdate: false,
      };
    },
    mounted() {
      this.loadData();
    },
    methods: {
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
          .post("master/sales", {})
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
          .post("master/sales/create", this.addData.form)
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
      async loadUpdate(kode) {
        this.resetForm();
        this.staUpdate = true;
        await axios
          .post("master/sales/bykode", {
            kode: kode,
          })
          .then((res) => {
            if (res.status != 200) {
              this.$notify({ type: "error", text: res.data.error });
              return;
            }
            this.addData.dialog = true;
            this.addData.form = res.data.data;
            this.$notify({ type: "success", text: res.data.message });
          })
          .catch((err) => {
            this.$notify({ type: "error", text: err });
          });
      },
      async updateData() {
        console.log(this.addData.form);
        await axios
          .post("master/sales/update", this.addData.form)
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
    },
  };
  </script>
  
  <style></style>
  