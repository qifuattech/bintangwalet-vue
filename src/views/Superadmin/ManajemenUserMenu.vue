<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h5">MANAJEMEN USER</div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col>
        <v-card outlined rounded="lg">
          <v-card-title class="d-flex justify-space-between">
            <!-- <div>DATA USER</div> -->
            <div>
              <v-text-field
                v-model="data.search"
                label="Pencarian"
                outlined
                dense
                hide-details
              ></v-text-field>
            </div>
            <v-spacer></v-spacer>
            <div>
              <v-btn color="primary" text @click="loadData()"
                >REFRESH <v-icon>mdi-refresh</v-icon></v-btn
              >
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-card outlined rounded="lg">
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
                    @click="showDialogUpdate(item.name)"
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
      v-model="update.dialog"
      max-width="1000px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title> Form Update : {{ update.key }} </v-card-title>
        <v-card-text class="mt-2">
          <v-select
            v-model="level.value"
            :hint="`${level.value.level}, ${level.value.id}`"
            :items="level.items"
            item-text="level"
            item-value="id"
            label="Level"
            persistent-hint
            return-object
            single-line
          ></v-select>
          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-end">
            <v-btn color="warning" @click="updateData()">Update</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <notifications position="bottom right"></notifications>
  </v-container>
</template>

<script>
import axios from "axios";
import swal from 'sweetalert';
export default {
  data() {
    return {
      data: {
        headers: [
          { text: "USER", value: "name" },
          { text: "EMAIL", value: "email" },
          { text: "LEVEL", value: "level" },
          { text: "DIVISION", value: "division" },
          { text: "JUMLAH MENU", value: "count_menu" },
          { text: "OPSI", value: "opsi" },
        ],
        items: [],
        loading: false,
        search: "",
      },
      update: {
        key: "",
        dialog: false,
        items: {},
        loading: false,
      },
      level: {
        items: [],
        value: {
          level: "",
          id: "",
        },
      },
    };
  },
  mounted() {
    this.loadData();
    this.loadLevel();
  },
  methods: {
    async loadData() {
      this.data.items = [];
      this.data.loading = true;
      await axios
        .post("master/user")
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
    showDialogUpdate(user) {
      this.update.key = user;
      this.update.dialog = true;
      this.loadDetail();
    },
    async loadDetail() {
      this.update.items = {};
      this.update.loading = true;
      axios
        .post("master/user/byuser", {
          user: this.update.key,
        })
        .then((res) => {
          if (res.status != 200) {
            this.$notify({ type: "error", text: res.data.error });
            return;
          }
          this.update.items = res.data.data;
          this.$notify({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          this.$notify({ type: "error", text: err });
        });
      this.update.loading = false;
    },
    async loadLevel() {
      await axios.get("master/level").then((res) => {
        this.level.items = res.data.data;
      });
    },
    async updateData() {
      await axios
        .post("master/level/update", {
          name: this.update.key,
          level_name: this.level.value.level,
        })
        .then((res) => {
          swal("Sukses", res.data.message, "success");
          this.update.dialog = false
          this.loadData()
        });
    },
  },
};
</script>

<style></style>
