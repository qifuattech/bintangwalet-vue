<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">MASTER JENIS</div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card outlined>
          <v-card-title class="d-flex justify-space-between">
            <div>
              <v-btn color="success" class="mr-4" rounded @click="addData.dialog = true"
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
                    @click="pilihJenis(item.kd_jenis, item.nm_jenis)"
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
                  <!-- <v-btn color="primary" text @click="$emit('jenis',{ kd_jenis: item.kd_jenis, nm_jenis:item.nm_jenis })"><v-icon>mdi-check-bold</v-icon></v-btn> -->
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="addData.dialog"
      max-width="800px"
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
              v-model="addData.form.kodeJenis"
              label="(Otomatis) Kode Jenis "
              dense
              outlined
              placeholder="Otomatis"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="addData.form.namaJenis"
              label="Nama Jenis"
              dense
              outlined
            ></v-text-field>
            <v-divider></v-divider>
            <div class="d-flex justify-end mt-2">
              <v-btn color="success" @click="createData()"
                >SIMPAN<v-icon>mdi-floppy</v-icon></v-btn
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
          { text: "KODE", value: "kd_jenis", width:"5%", divider: true },
          { text: "NAMA", value: "nm_jenis", divider: true },
          { text: "OPSI", value: "opsi", width:"5%" },
        ],
        items: [],
        loading: false,
        search: "",
      },
      addData: {
        dialog: false,
        isValid: false,
        form: {
          kodeJenis: "",
          namaJenis: "",
        },
        loading: false,
      },
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
        .post("master/jenisbarang", {})
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.data.items = res.data.data;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          console.log(err);
        });

      this.data.loading = false;
    },
    async createData() {
      this.addData.loading = true;
      await axios
        .post("master/jenisbarang/create", this.addData.form)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.error, "error");
            return;
          }
          this.resetForm();
          swal("Sukses", res.data.message, "success");
          this.addData.dialog = false
          this.loadData()
        })
        .catch((err) => {
          swal("Gagal", err, "error");
        });
      this.addData.loading = false;
    },
    resetForm() {
      this.addData.form = {
        kodeJenis: "",
        namaJenis: "",
      };
    },
    pilihJenis(kd_jenis, nm_jenis) {
      this.$emit("jenis", {
        kd_jenis: kd_jenis,
        nm_jenis: nm_jenis,
      });
    },
  },
};
</script>

<style></style>
