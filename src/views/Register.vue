<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Register</h2>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="auto" lg="6">
        <v-card outlined rounded="xl">
          <v-card-title> Form Register </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form v-model="isValid">
              <v-text-field
                label="Username"
                dense
                outlined
                v-model="form.username"
                :rules="rules.form.username"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
              <!-- <v-text-field
                label="Email"
                dense
                outlined
                v-model="form.email"
                :rules="rules.form.email"
                prepend-inner-icon="mdi-mail"
              ></v-text-field> -->
              <v-select
                :items="level.items"
                item-text="level"
                item-value="level"
                v-model="form.level"
                label="Level"
                dense
                outlined
                prepend-inner-icon="mdi-account-key"
              ></v-select>
              <v-text-field
                label="Password"
                dense
                outlined
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                :rules="rules.form.password"
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-text-field
                label="Password Confirmation"
                dense
                outlined
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password2"
                :rules="rules.form.password2"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                prepend-inner-icon="mdi-lock"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-divider></v-divider>

              <div class="mt-2 d-flex justify-space-between">
                <v-btn class="mr-2" to="/login">Login</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="grey" dark class="mr-2" @click="resetForm()"
                  >Reset</v-btn
                >
                <v-btn
                  color="success"
                  :disabled="!isValid"
                  @click="saveRegister()"
                  >Register</v-btn
                >
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      isValid: false,
      showPassword: false,
      form: {
        username: "",
        // email: "",
        level: "",
        password: "",
        password2: "",
      },
      level: {
        items: [],
      },
      rules: {
        form: {
          username: [(v) => v != "" || "Username Harus Diisi"],
          // email: [(v) => v != "" || "Email Harus Diisi"],
          password: [
            (v) => v != "" || "Password Harus Diisi",
            (v) => v.length >= 8 || "Password Harus Lebih Dari 8 Karakter",
          ],
          password2: [
            (v) => v != "" || "Konfirmasi Password Harus Diisi",
            (v) => v == this.form.password || "Password Tidak Sama",
          ],
        },
      },
    };
  },
  mounted() {
    this.loadLevel();
  },
  methods: {
    async loadLevel() {
      await axios.post("level", {
        level : this.$store.state.auth.user.level
      }).then((res) => {
        this.level.items = res.data.data;
      });
    },
    saveRegister() {
      axios
        .post("register", this.form)
        .then((res) => {
          if (res.status != 200) {
            swal("Gagal", res.data.message, "error");
            return;
          }
          swal("Success", res.data.message, "success");
          this.$router.push({ path: "/login" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetForm() {
      this.form = {
        username: "",
        email: "",
        password: "",
        password2: "",
      };
    },
  },
};
</script>

<style></style>
