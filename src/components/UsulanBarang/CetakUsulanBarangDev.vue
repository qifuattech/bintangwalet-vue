<template>
  <v-container>
    <v-row>
      <v-col>
        <table>
          <tr>
            <th class="header" width="33%">
              <img src="@/assets/logolong.png" height="40px" alt="" />
            </th>
            <th class="header" width="33%">USULAN PERMINTAAN BARANG</th>
            <th class="header" width="33%">MJC-PEMBELIAN</th>
          </tr>
        </table>
        <table class="mt-2">
          <tr>
            <td width="33%">
              Tanggal : {{ getFormatTanggal(data.items[0].tanggal_usulan) }}
            </td>
            <td width="33%">
              Departemen/Bagian : {{ data.items[0].nama_bagian }} /
              {{ data.items[0].nama_dept }}
            </td>
            <td width="33%">No Usulan : {{ noBukti }}</td>
          </tr>
        </table>
        <table class="mt-4">
          <tr>
            <th class="columnheader">No</th>
            <th class="columnheader">Nama Bahan / Pekerjaan</th>
            <th class="columnheader">Max L.Time (Hari)</th>
            <th class="columnheader">Jumlah</th>
            <th class="columnheader">Stok</th>
            <th class="columnheader">Satuan</th>
            <th class="columnheader">Perkiraan Harga (Rp)</th>
            <th class="columnheader">Subtotal (Rp)</th>
            <th class="columnheader">Penggunaan</th>
            <th class="columnheader">Keterangan</th>
          </tr>
          <tr v-for="(item, index) in data.items" :key="item.id">
            <td align="center">{{ index + 1 }}</td>
            <td>
              {{ item.nama_bahan }} {{ item.ukuran }} - {{ item.kode_bahan }}
            </td>
            <td align="right" width="5%">
              {{ getFormatNumber(item.max_lead_time) }}
            </td>
            <td align="right" width="5%">{{ getFormatNumber(item.jumlah) }}</td>
            <td align="right" width="5%">
              {{ getFormatNumber(item.saldo_sewaktu) }}
            </td>
            <td align="center" width="5%">{{ item.unit }}</td>
            <td align="right" width="7%">
              {{ getFormatNumber(item.harga_perkiraan) }}
            </td>
            <td align="right" width="7%">
              {{ getFormatNumber(item.jumlah * item.harga_perkiraan) }}
            </td>
            <td>{{ item.kegunaan }}</td>
            <td>{{ item.keterangan }}</td>
          </tr>
          <tr>
            <td class="grandtotal" colspan="7" align="right">
              Grand Total (Rp)
            </td>
            <td class="grandtotal" align="right">
              {{ getFormatNumber(grandTotal) }}
            </td>
            <td colspan="2"></td>
          </tr>
        </table>
        <table class="mt-10">
          <tr>
            <th width="20%">Pembuat</th>
            <th width="20%">Kepala Bagian</th>
            <th width="20%">Manajer</th>
            <th width="20%">Direktur</th>
            <th width="20%">Pembelian</th>
          </tr>
          <tr height="100px">
            <td class="sign">
              <div>
                <qrcode-vue
                  class="d-flex justify-center"
                  :value="
                    concatQr([
                      data.items[0].nik_pembuat,
                      getFormatTanggal2(data.items[0].tanggal_usulan),
                    ])
                  "
                  size="75"
                  level="H"
                />
              </div>
              <div>({{ getFormatTanggal(data.items[0].tanggal_usulan) }})</div>
              <div>{{ data.items[0].nama }}</div>
            </td>
            <td class="sign">
              <div>
                <qrcode-vue
                  v-if="data.items[0].kabag_status == 'ACC'"
                  class="d-flex justify-center"
                  :value="
                    concatQr([
                      data.items[0].kabag_status,
                      data.items[0].kabag_nik,
                      getFormatTanggal2(data.items[0].kabag_tgl),
                    ])
                  "
                  size="75"
                  level="H"
                />
              </div>
              <div>
                ({{ data.items[0].kabag_status }} -
                {{ getFormatTanggal(data.items[0].kabag_tgl) }})
              </div>
              <div>{{ data.items[0].kabag_nama }}</div>
            </td>
            <td class="sign">
              <div>
                <qrcode-vue
                  v-if="data.items[0].manajer_status == 'ACC'"
                  class="d-flex justify-center"
                  :value="
                    concatQr([
                      data.items[0].manajer_status,
                      data.items[0].manajer_nik,
                      getFormatTanggal2(data.items[0].manajer_tgl),
                    ])
                  "
                  size="75"
                  level="H"
                />
              </div>
              <div>
                ({{ data.items[0].manajer_status }} -
                {{ getFormatTanggal(data.items[0].manajer_tgl) }})
              </div>
              <div>{{ data.items[0].manajer_nama }}</div>
            </td>
            <td class="sign">{{ data.items[0].tiering_nama }}</td>
            <td class="sign">{{ data.items[0].kabag_pembelian }}</td>
          </tr>
        </table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import QrcodeVue from "qrcode.vue";
export default {
  components: {
    QrcodeVue,
  },
  props: ["noUsulan"],
  data() {
    return {
      noBukti: "",
      data: {
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
      },
    };
  },
  created() {
    console.log("props " + this.noUsulan);
    if (this.noUsulan == "" || this.noUsulan == undefined) {
      this.noBukti = this.$route.params.nousulan;
    } else {
      this.noBukti = this.noUsulan;
    }
    this.loadData();
  },
  methods: {
    concatQr(arr) {
      let a = "";
      for (let i = 0; i < arr.length; i++) {
        a += arr[i] + "|";
      }
      return a;
    },
    getFormatTanggal(tanggal) {
      moment.locale("id");
      if (moment(String(tanggal)).isValid()) {
        return moment(String(tanggal)).format("dddd, DD-MM-YYYY");
      }
      return "-";
    },
    getFormatTanggal2(tanggal) {
      moment.locale("id");
      if (moment(String(tanggal)).isValid()) {
        return moment(String(tanggal)).format("DD-MM-YYYY hh::mm");
      }
      return "-";
    },

    getFormatNumber(rp) {
      return numeral(rp).format("0,2");
    },
    resetData() {
      this.data.items = [
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
    async loadData() {
      this.resetData();
      await axios
        .post("pembelian/usulanbarang/bynousulan", {
          no_usulan: this.noBukti,
        })
        .then((res) => {
          this.data.items = res.data.result;
        });
    },
  },
  computed: {
    grandTotal() {
      let a = 0;
      for (let i = 0; i < this.data.items.length; i++) {
        a += this.data.items[i].jumlah * this.data.items[i].harga_perkiraan;
      }
      return a;
    },
  },
  watch: {
    noUsulan(newVal) {
      console.log("props " + newVal);
      if (newVal == "" || newVal == undefined) {
        this.noBukti = newVal;
      } else {
        this.noBukti = newVal;
      }
      this.loadData();
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
}
table,
th,
td {
  border: 1px solid;
  border-collapse: collapse;
  padding: 5px;
}

th.header {
  font-size: 1.5rem;
}

th.columnheader {
  font-size: 0.8rem;
  text-align: center;
}

td {
  font-size: 0.8rem;
}
td.grandtotal {
  font-weight: 600;
  font-size: 0.8rem;
}
td.sign {
  vertical-align: bottom;
  text-align: center;
}
</style>