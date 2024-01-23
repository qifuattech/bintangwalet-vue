<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="6" md="8" sm="12">
        <v-card elevation="1" style="border-radius: 5px">
          <!-- <v-card-media> -->
          <v-img
            src="../assets/login-image.png"
            max-height="250"
            class="grey darken-4"
          ></v-img>
          <!-- <v-carousel hide-delimiters v-model="imagenumber" height="280">
            <v-carousel-item
              v-for="(item, i) in arrDataImage"
              :key="i"
              :src="item.uri"
            >
            </v-carousel-item>
          </v-carousel> -->
          <!-- </v-card-media> -->
          <div class="px-12">
            <v-card-title primary-title class="d-flex justify-center">
              <div>
                <h3>WELCOME BACK,</h3>
                <p class="text--secondary mb-0" style="font-size: 0.95rem">
                  Login untuk melanjutkan
                </p>
              </div>
            </v-card-title>
            <v-card-text class="pt-0">
              <!-- <v-form @submit.prevent="userLogin()" autocomplete="off"> -->
              <div>
                <v-text-field
                  ref="username"
                  v-on:keyup.enter="focusPassword"
                  v-model="form.email"
                  outlined
                  dense
                  clearable
                  autocomplete="off"
                  placeholder="Masukkan Username"
                  prepend-inner-icon="mdi-account"
                />
              </div>
              <div>
                <v-text-field
                  v-on:keyup.enter="focusLogin"
                  ref="password"
                  v-model="form.password"
                  outlined
                  dense
                  clearable
                  autocomplete="off"
                  placeholder="Masukkan Password"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  hide-details
                />
              </div>

              <v-btn
                ref="login"
                class="mt-3"
                @click="userLogin()"
                color="primary"
                block
                ><strong>LOGIN</strong></v-btn
              >
              <!-- <div class="mt-3 d-flex justify-end" >
                  <v-btn to="/resetpassword" text>Lupa Password?</v-btn>
                </div> -->
              <!-- </v-form> -->
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- <v-row class="d-flex justify-center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex justify-center">
            <strong>LOG IN </strong></v-card-title
          >

          <v-divider></v-divider>
          <v-card-text>
            <v-row
              ><v-col cols="6">
                <v-carousel hide-delimiters>
                  <v-carousel-item
                    v-for="(item, i) in arrDataImage"
                    :key="i"
                    :src="item.uri"
                  ></v-carousel-item> </v-carousel
              ></v-col>
              <v-divider vertical></v-divider>
              <v-col cols="6" class="d-flex justify-center align-center">
                <v-form @submit.prevent="userLogin" autocomplete="off">
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.email"
                      label="NIK"
                      outlined
                      clearable
                      autocomplete="off"
                      placeholder="Masukkan NIK Karyawan Anda"
                      prepend-inner-icon="mdi-account"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.password"
                      label="Password"
                      outlined
                      clearable
                      autocomplete="off"
                      placeholder="Masukkan Password Anda"
                      prepend-inner-icon="mdi-lock"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-col>
                  <v-divider class="ml-3 mr-3"></v-divider>
                  <v-col>
                    <v-btn block color="success" type="submit"> Login </v-btn>
                  </v-col>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
    <notifications position="bottom right" />
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      errors: null,
      showPassword: false,
      arrDataImage: [],
      imagenumber: 0,
    };
  },
  mounted() {
    this.$refs.username.focus();
    this.form.email = "";
    this.form.password = "";
  },
  methods: {
    randomImage() {
      this.imagenumber = Math.floor(Math.random() * (18 - 2 + 1) + 2);
    },
    loadUriImage() {
      axios
        .get("assets/login")
        .then((res) => {
          this.arrDataImage = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    focusPassword() {
      this.$refs.password.focus();
    },
    focusLogin() {
      this.$nextTick(() => {
        this.$refs.login.$el.focus();
      });
    },

    async userLogin() {
      this.$store
        .dispatch("login", this.form)
        .then(() => {
          console.log("login berhasil");
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          this.form.email = "";
          this.form.password = "";
          this.$notify({
            type: "error",
            text: "Login Gagal, Username / Password salah",
          });
          console.log("catch");
          this.errors = error.response.data.errors;
        });
    },
  },
  computed: {
    image() {
      return "http://192.168.2.10/_assets/web-mjc/login/login-2.jpg";
    },
  },
};
</script>