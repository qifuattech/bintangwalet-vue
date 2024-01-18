<template>
  <v-row>
    <v-col cols="12">
      <!-- <v-col cols="3">
          <v-btn block color="grey" dark rounded>Buka Proteksi Revisi</v-btn>
        </v-col> -->
      <div class="d-flex justify-end" v-if="tabs == '0'">
        <v-col cols="3">
          <v-btn block color="success" rounded @click="showKonfirmasi(true)">
            <v-icon class="mr-4">mdi-check</v-icon> ACC
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn block color="warning" rounded @click="showKonfirmasi(false)">
            <v-icon class="mr-4">mdi-close</v-icon> Tidak ACC
          </v-btn>
        </v-col>
      </div>
      <v-dialog
        v-model="dialogKonfirmasi"
        :overlay="false"
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card class="pb-4">
          <v-card-title class="py-2">
            Konfirmasi {{ getStatus(statusKonfirmasi) }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="mt-4">
            <v-text-field
              v-model="keteranganKonfirmasi"
              label="Masukkan Keterangan Konfirmasi"
              outlined
              dense
            ></v-text-field>
            <div class="d-flex justify-center">
              <v-btn
                @click="updateKonfirmasi(statusKonfirmasi)"
                :color="statusKonfirmasi ? 'success' : 'warning'"
                rounded
              >
                <v-icon class="mr-4">mdi-content-save </v-icon> Simpan
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                @click="dialogKonfirmasi = false"
                outlined
                rounded
              >
                <v-icon>mdi-close</v-icon>Batal
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-card outlined>
        <v-card-text class="py-0 mt-2">
          <v-row>
            <v-col cols="4">
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <td width="30%">No. Usulan</td>
                    <td width="10%">:</td>
                    <td width="60%">
                      {{ detail.items[0].no_usulan }}
                    </td>
                  </tr>
                  <tr>
                    <td>Tgl. Usulan</td>
                    <td>:</td>
                    <td>
                      {{ getFormatTanggal(detail.items[0].tanggal_usulan) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Pembuat</td>
                    <td>:</td>
                    <td>{{ detail.items[0].nik_pembuat }}</td>
                  </tr>
                  <tr>
                    <td>Bagian / Departemen</td>
                    <td>:</td>
                    <td>
                      {{ detail.items[0].nama_bagian }} /
                      {{ detail.items[0].nama_dept }}
                    </td>
                  </tr>
                  <tr>
                    <td>Tgl. Kirim Dokumen</td>
                    <td>:</td>
                    <td>
                      {{ getFormatTanggal(detail.items[0].tanggal_kirim_dok) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Tgl. Terima Dokumen</td>
                    <td>:</td>
                    <td>
                      {{ getFormatTanggal(detail.items[0].tanggal_terima_dok) }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-col cols="8">
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <td width="30%">Tgl. Kirim Konf.</td>
                    <td width="10%">:</td>
                    <td width="60%">
                      {{ getFormatTanggal(detail.items[0].tanggal_kirim_konf) }}
                      - {{ detail.items[0].nik_pengirim }}
                      <v-menu
                        v-model="menuLogKonfirmasi"
                        :close-on-content-click="false"
                        :nudge-width="250"
                        offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            color="info"
                            rounded
                            @click="
                              showLogKonfirmasi(detail.items[0].no_usulan)
                            "
                            v-bind="attrs"
                            v-on="on"
                            >Log-Konfirmasi</v-btn
                          >
                        </template>
                        <v-card outlined elevation="0">
                          <v-data-table
                            :headers="logKonfirmasi.headers"
                            :items="logKonfirmasi.items"
                            :loading="logKonfirmasi.loading"
                            :search="logKonfirmasi.search"
                            dense
                            :items-per-page="100"
                            hide-default-footer
                          >
                            <template v-slot:[`item.tanggal`]="{ item }">
                              {{ getFormatTanggal(item.tanggal) }}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                              <v-chip dark x-small color="grey">{{
                                item.status_name
                              }}</v-chip>
                              - {{ item.ket }}
                            </template>
                            <template v-slot:[`item.keterangan`]="{ item }">
                              {{ item.posisi }} - {{ item.nik }}
                            </template>
                          </v-data-table>
                        </v-card>
                      </v-menu>
                    </td>
                  </tr>
                  <tr>
                    <td>Konfirmasi Kabag</td>
                    <td>:</td>
                    <td>
                      <v-chip
                        x-small
                        label
                        :color="getColorStaAcc(detail.items[0].kabag_status)"
                        >{{ detail.items[0].kabag_status }} -
                        {{ detail.items[0].kabag_ket }}</v-chip
                      >
                      {{ getFormatTanggal(detail.items[0].kabag_tgl) }} -
                      {{ detail.items[0].kabag_nik }}
                    </td>
                  </tr>
                  <tr>
                    <td>Konfirmasi Manajer</td>
                    <td>:</td>
                    <td>
                      <v-chip
                        x-small
                        label
                        :color="getColorStaAcc(detail.items[0].manajer_status)"
                        >{{ detail.items[0].manajer_status }} -
                        {{ detail.items[0].manajer_ket }}</v-chip
                      >
                      {{ getFormatTanggal(detail.items[0].manajer_tgl) }} -
                      {{ detail.items[0].manajer_nik }}
                    </td>
                  </tr>
                  <tr>
                    <td>Konfirmasi Tiering</td>
                    <td>:</td>
                    <td>
                      <v-chip
                        x-small
                        label
                        :color="getColorStaAcc(detail.items[0].tiering_status)"
                        >{{ detail.items[0].tiering_status }} -
                        {{ detail.items[0].tiering_ket }}</v-chip
                      >
                      {{ getFormatTanggal(detail.items[0].tiering_tgl) }} -
                      {{ detail.items[0].tiering_nik }}
                    </td>
                  </tr>
                  <tr>
                    <td>Grand Total</td>
                    <td>:</td>
                    <td>
                      <strong> Rp. {{ getFormatNumber(getGrandTotal) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card outlined>
        <v-card-text class="pa-0">
          <v-data-table
            :headers="detail.headers"
            :items="detail.items"
            :loading="detail.loading"
            :search="detail.search"
            dense
          >
            <template v-slot:[`item.jumlah`]="{ item }">
              <strong>{{ getFormatNumber(item.jumlah) }}</strong>
            </template>
            <template v-slot:[`item.saldo_sewaktu`]="{ item }">
              <strong>{{ getFormatNumber(item.saldo_sewaktu) }}</strong>
            </template>
            <template v-slot:[`item.nama_bahan`]="{ item }">
              <v-chip small outlined label
                >{{ item.nama_bahan }}, {{ item.ukuran }}</v-chip
              >
              <!-- <v-chip class="my-1" small outlined label>{{ item.ukuran }}</v-chip> -->
              <v-chip
                x-small
                color=""
                outlined
                label
                :to="`/master/barang/tampil/detail/` + item.kode_bahan"
                target="_blank"
                >{{ item.kode_bahan }}</v-chip
              >
              <!-- <strong>{{ item.nama_bahan }}</strong> - <strong>{{ item.kode_bahan }}</strong> -->
            </template>
            <template v-slot:[`item.harga_perkiraan`]="{ item }">
              <strong>{{ getFormatNumber(item.harga_perkiraan) }}</strong>
            </template>
            <template v-slot:[`item.status_pakai`]="{ item }">
              <v-chip
                label
                :color="getColorStaPakai(item.status_pakai)"
                outlined
                x-small
                >{{ item.status_pakai }}</v-chip
              >
            </template>
            <template v-slot:[`item.subtotal`]="{ item }">
              <strong>{{
                getFormatNumber(item.jumlah * item.harga_perkiraan)
              }}</strong>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import swal from "sweetalert";

export default {
  props: ["noUsulan", "tabs"],
  data() {
    return {
      menuLogKonfirmasi: false,
      dialogKonfirmasi: false,
      detail: {
        headers: [
          { text: "ID", value: "id" },
          // { text: 'Kode Bahan', value: "kode_bahan" },
          { text: "Nama Bahan", value: "nama_bahan" },
          // { text: 'Ukuran', value: "ukuran" },
          { text: "Status Pakai", value: "status_pakai" },
          { text: "Kegunaan", value: "kegunaan" },
          { text: "Keterangan", value: "keterangan" },
          { text: "Unit", value: "unit" },
          {
            text: "Saldo Sewaktu",
            value: "saldo_sewaktu",
            align: "right",
            divider: true,
          },
          { text: "Qty", value: "jumlah", align: "right" },
          { text: "Harga Perkiraan", value: "harga_perkiraan", align: "right" },
          { text: "Subtotal", value: "subtotal", align: "right" },
        ],
        items: [
          {
            no_usulan: "",
            tanggal_usulan: "",
            nik_pembuat: "",
            kode_bagian: "",
            tanggal_kirim_dok: "",
            tanggal_terima_dok: "",
            tanggal_kirim_konf: "",
            nik_pengirim: "",
            kabag_tgl: "",
            manajer_tgl: "",
            tiering_tgl: "",
          },
        ],
        loading: false,
        search: "",
      },
      update: {
        loading: false,
      },
      statusKonfirmasi: "",
      keteranganKonfirmasi: "",
      logKonfirmasi: {
        headers: [
          { text: "Tanggal", value: "tanggal" },
          { text: "Status", value: "status" },
          { text: "Keterangan", value: "keterangan" },
        ],
        items: [],
        loading: false,
        search: "",
      },
    };
  },
  created() {
    this.loadDetail(this.noUsulan);
  },
  methods: {
    getColorStaAcc(status) {
      if (status == "ACC") {
        return "success";
      } else if (status == "Tidak ACC") {
        return "warning";
      } else {
        return "";
      }
    },
    getColorStaPakai(staPakai) {
      if (staPakai == "Reguler") {
        return "success";
      } else if (staPakai == "Urgent") {
        return "warning";
      } else if (staPakai == "Top Urgent") {
        return "error";
      } else {
        return "";
      }
    },
    getStatus(status) {
      if (status == true) {
        return "Acc";
      } else if (status == false) {
        return "Tidak Acc";
      }
    },
    showKonfirmasi(status) {
      this.dialogKonfirmasi = true;
      this.statusKonfirmasi = status;
    },
    async updateKonfirmasi(status) {
      await axios
        .post("konfirmasi/data/update", {
          no_bukti: this.noUsulan,
          nama_jabatan: this.$store.state.auth.user.nama_jabatan,
          data_status: status,
          data_ip: "IP",
          data_nik: this.$store.state.auth.user.nik,
          data_ket: this.keteranganKonfirmasi,
        })
        .then((res) => {
          if (res.data.success == false) {
            swal("Gagal", res.data.message + " : " + res.data.error, "error");
            return;
          }
          swal("Sukses", res.data.message + " : " + res.data.result, "success");
          this.$emit("statusKonfirmasi", status);
        });
    },
    getFormatTanggal(tanggal) {
      // moment.locale('id')
      if (moment(String(tanggal)).isValid()) {
        return moment(String(tanggal)).format("DD-MM-YYYY HH:mm");
      }
      return "-";
    },
    // getFormatJam(jam) {
    //     moment.locale('id')
    //     return moment(String(jam)).format('h:mm')
    // },
    getFormatNumber(rp) {
      return numeral(rp).format("0,2");
    },

    resetDetail() {
      this.detail.items = [
        {
          no_usulan: "",
          tanggal_usulan: "",
          nik_pembuat: "",
          kode_bagian: "",
          tanggal_kirim_dok: "",
          tanggal_terima_dok: "",
          tanggal_kirim_konf: "",
          nik_pengirim: "",
          kabag_tgl: "",
          manajer_tgl: "",
          tiering_tgl: "",
        },
      ];
    },

    async loadDetail(nousulan) {
      this.resetDetail();
      await axios
        .post("pembelian/usulanbarang/bynousulan", {
          no_usulan: nousulan,
        })
        .then((res) => {
          if (res.data.success == false) {
            console.log(res.data.error);
            return;
          }
          console.log(res.data.result);
          this.detail.items = res.data.result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async showLogKonfirmasi(noUsulan) {
      this.logKonfirmasi.items = [];
      await axios
        .post("konfirmasi/log", { no_usulan: noUsulan })
        .then((res) => {
          this.logKonfirmasi.items = res.data.result;
        });
    },
  },

  watch: {
    noUsulan(newVal) {
      this.loadDetail(newVal);
    },
  },
  computed: {
    getGrandTotal() {
      return this.detail.items.reduce(
        (acc, item) => acc + item.jumlah * item.harga_perkiraan,
        0
      );
    },
  },
};
</script>

<style>
</style>