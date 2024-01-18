<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>MANAJEMEN MENU</h2>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row class="mt-0">
      <v-col>
        <v-card outlined>
          <v-card-title class="d-flex justify-space-between">
            <div class="mr-4">
              <v-btn color="success" rounded @click="showDialog()"
                >Tambah Data<v-icon>mdi-plus-thick</v-icon></v-btn
              >
            </div>
            <div>
              <v-text-field
                name="name"
                label="Pencarian"
                outlined
                dense
                clearable
                hide-details
                v-model="data.search"
              ></v-text-field>
            </div>
            <v-spacer></v-spacer>
            <div>
              <!-- :fetch="fetchData" -->
              <download-excel
                class="btn btn-default"
                worksheet="Data Menu"
                name="Data Menus.xls"
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
                :items-per-page="20"
                dense
              >
                <template v-slot:[`item.icon`]="{ item }">
                  <v-icon>{{ item.icon }}</v-icon>
                  {{ item.icon }}
                </template>
                <template v-slot:[`item.opsi`]="{ item }">
                  <v-btn small text @click="edit(item.id)"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn
                    small
                    color="error"
                    text
                    @click="deleteMenu(item.id_menu)"
                    ><v-icon>mdi-close-thick</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogTambah"
      max-width="720px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title> Tambah Menu </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.group"
            label="Group Menu"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="form.code"
            label="Kode Menu"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="form.name"
            label="Nama Menu"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="form.route"
            label="Route"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="form.icon"
            label="Icon"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="form.flag_active"
            label="Active"
            outlined
            dense
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn v-if="staEdit == true" color="primary" @click="updateMenu()">
            Update <v-icon>mdi-floppy</v-icon>
          </v-btn>
          <v-btn v-else color="success" @click="simpanMenu()">
            Simpan <v-icon>mdi-floppy</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <notifications position="bottom right" />
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: {
        headers: [
          { text: "ID MENU", value: "id", divider: true },
          { text: "GROUP MENU", value: "group", divider: true },
          { text: "KODE MENU", value: "code", divider: true },
          { text: "NAMA MENU", value: "name", divider: true },
          { text: "ROUTE", value: "route", divider: true },
          { text: "IKON", value: "icon", divider: true },
          { text: "AKTIF", value: "flag_active", divider: true },
          { text: "TANGGAL", value: "created_at", divider: true },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
      },

      dialogTambah: false,
      staEdit: false,

      form: {
        id: "",
        group: "",
        code: "",
        name: "",
        route: "",
        icon: "",
        flag_active: "",
      },
    };
  },

  mounted() {
    this.loadData();
  },
  methods: {
    deleteMenu(idMenu) {
      axios
        .post("menu/delete/", {
          id_menu: idMenu,
        })
        .then((res) => {
          if (res.data.success == true) {
            this.loadData();
            alert(res.data.message);
          } else {
            alert(res.data.message);
            console.log(res.data.data);
          }
        });
    },
    updateMenu() {
      console.log(this.form);
      axios.post("menu/update", this.form).then((res) => {
        if (res.data.success == true) {
          this.dialogTambah = false;
          this.loadData();
          this.staEdit = false;
          this.$notify({
            type: "success",
            text: "Update menu berhasil, " + this.form.text,
          });
          // alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      });
    },
    edit(id) {
      this.staEdit = true;
      axios
        .get("menu/" + id + "/get")
        .then((res) => {
          this.form = res.data.data[0];
          this.dialogTambah = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    simpanMenu() {
      axios
        .post("menu/create", this.form)
        .then((res) => {
          if (res.data.success == true) {
            this.dialogTambah = false;
            this.loadData();
            this.$notify({
              type: "success",
              text: "Tambah menu berhasil, " + this.form.text,
            });
            console.log("berhasil");
          } else {
            console.log("gagal");
            alert(res.data.message);
            console.log(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDialog() {
      this.resetForm();
      this.dialogTambah = true;
      this.staEdit = false;
    },
    resetForm() {
      this.form = {
        id: "",
        group: "",
        code: "",
        name: "",
        route: "",
        icon: "",
        flag_active: "",
      };
    },

    async loadData() {
      this.data.loading = true;
      await axios
        .get("menu")
        .then((res) => {
          this.data.items = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.data.loading = false;
    },
  },
};
</script>

<style>
</style>