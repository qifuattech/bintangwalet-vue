<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>MANAJEMEN LEVEL</h2>
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
                worksheet="Data Level"
                name="Data Level.xls"
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
                <template v-slot:[`item.no`]="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:[`item.opsi`]="{ item }">
                  <v-btn
                    color="primary"
                    text
                    @click="pilihUnit(item.id, item.kode, item.nama)"
                    v-if="staPilih"
                    ><v-icon>mdi-check-bold</v-icon></v-btn
                  >
                  <v-btn
                    color="primary"
                    text
                    @click="loadUpdate(item.id)"
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
              :rules="addData.rules.kode"
              v-model="addData.form.kode"
              label="Masukkan Kode (Contoh : pcs, bks, btl, eks, lbr, dll)"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.nama"
              v-model="addData.form.nama"
              label="Masukkan Kode (Contoh : Pieces, Bungkus,Botol, Eksemplar, Lembar, dll)"
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
      data: {
        headers: [
          { text: "NO.", value: "no", divider: true },
          { text: "LEVEL", value: "level", divider: true },
          { text: "JUMLAH MENU", value: "jml_menu", divider: true },    
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
          kode: "",
          nama: "",
        },
        rules: {
          kode: [(v) => v != "" || "Nama Harus Diisi"],
          nama: [(v) => v != "" || "Alias Harus Diisi"],
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
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("level/all", {})
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
        .post("master/unit/create", this.addData.form)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.message, "error");
            return;
          }
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false;
          this.resetForm();
          this.loadData();
        })
        .catch((err) => {
          console.log(err.message);
          swal("Gagal", "Ada Kesalahan Server (404)" + err.message, "error");
        });
      this.addData.loading = false;
    },
    resetForm() {
      this.addData.form = {
        kode: "",
        nama: "",
      };
    },
    async loadUpdate(id) {
      this.resetForm();
      this.staUpdate = true;
      await axios
        .post("master/unit/bykode", {
          id: id,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.addData.dialog = true;
          this.addData.form.id = res.data.data.id;
          this.addData.form.kode = res.data.data.kode;
          this.addData.form.nama = res.data.data.nama;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });
    },
    async updateData() {
      await axios
        .post("master/unit/update", this.addData.form)
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
      const res = await axios.post("master/bank");
      return res.data.data;
    },
    pilihUnit(id, kode, nama) {
      this.$emit("unit", {
        idUnit: id,
        kodeUnit: kode,
        namaUnit: nama,
      });
    },
  },
};
</script>
  
  <style></style>
  