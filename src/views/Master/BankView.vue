<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">MASTER BANK</div>
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
                  <v-btn
                    color="primary"
                    text
                    @click="pilihBank(item.kode, item.nm_bank)"
                    v-if="staPilih"
                    :disabled="item.masuk - item.keluar <= 0"
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
              v-model="addData.form.kode"
              label="(Otomatis) Kode Kas/Bank"
              dense
              outlined
              readonly
              placeholder="Otomatis"
              background-color="#f7f7f7"
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.nama_bank"
              v-model="addData.form.nama_bank"
              label="Nama Kas/Bank"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.nama_tampil"
              v-model="addData.form.nama_tampil"
              label="Nama Alias"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.no_rekening"
              v-model="addData.form.no_rekening"
              label="No. Rekening"
              dense
              outlined
            ></v-text-field>
            <v-text-field
              :rules="addData.rules.keterangan"
              v-model="addData.form.keterangan"
              label="Keterangan"
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
          { text: "KODE", value: "kode", divider: true },
          { text: "NAMA", value: "nm_bank", divider: true },
          { text: "ALIAS", value: "nm_tampil", divider: true },
          { text: "NO REKENING", value: "no_rekening", divider: true },
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
          kode_bank: "",
          nama_bank: "",
          nama_tampil: "",
          no_rekening: "",
          keterangan: "",
        },
        rules: {
          nama_bank: [(v) => v != "" || "Nama Harus Diisi"],
          nama_tampil: [(v) => v != "" || "Alias Harus Diisi"],
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
        .post("master/bank", {})
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
        .post("master/bank/create", this.addData.form)
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
        kode_bank: "",
        nama_bank: "",
        nama_tampil: "",
        no_rekening: "",
        keterangan: "",
      };
    },
    async loadUpdate(kode) {
      this.resetForm();
      this.staUpdate = true;
      await axios
        .post("master/bank/bykode", {
          kode: kode,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.addData.dialog = true;
          this.addData.form.kode_bank = res.data.data.kode;
          this.addData.form.nama_bank = res.data.data.nm_bank;
          this.addData.form.nama_tampil = res.data.data.nm_tampil;
          this.addData.form.no_rekening = res.data.data.no_rekening;
          this.addData.form.keterangan = res.data.data.keterangan;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });
    },
    async updateData() {
      await axios
        .post("master/bank/update", this.addData.form)
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
    pilihBank(kode_bank, nama_bank) {
      this.$emit("bank", {
        kode_bank: kode_bank,
        nama_bank: nama_bank,
      });
    },
  },
};
</script>
  
  <style></style>
  