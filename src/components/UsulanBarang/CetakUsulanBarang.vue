<template>
    <!-- SHOW PDF -->
    <VueHtml2pdf :preview-modal="true" :paginate-elements-by-height="1400" :enable-download="false"
        filename="Usulan Barang" :pdf-quality="2" :manual-pagination="false" pdf-format="a4" pdf-orientation="landscape"
        pdf-content-width="1100px" ref="generate">
        <section slot="pdf-content">
            <v-app>
                <v-main class="ma-0 pa-0">
                    <v-container>
                        <v-card class="d-flex flex-column" color="white" flat tile height="700px">
                            <v-card class="pa-2" elevation="0" tile>
                                <v-row>
                                    <v-col cols="4">
                                        <v-card outlined tile height="50px" class="d-flex justify-center align-center">
                                            <img src="@/assets/logolong.png" height="40px" alt="" />
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card outlined tile height="50px" class="d-flex justify-center align-center">
                                            <div class="text-h5"> USULAN PERMINTAAN BARANG</div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card outlined tile height="50px" class="d-flex justify-center align-center">
                                            <div class="text-h6"> MJC-PBL-001001</div>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-card class="ma-2" elevation="0" tile>
                                <v-row>
                                    <v-col>
                                        <v-card outlined tile class="pa-1">
                                            <v-col cols="6" class="pa-0">
                                                <v-simple-table dense>
                                                    <thead>
                                                        <tr>
                                                            <td width="30%">No. Usulan </td>
                                                            <td width="5%">:</td>
                                                            <td width="65%">{{ cetak.items[0].no_usulan }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tanggal </td>
                                                            <td>:</td>
                                                            <td>{{ cetak.items[0].tanggal_usulan }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Bagian / Departemen </td>
                                                            <td>:</td>
                                                            <td>{{ cetak.items[0].kode_bagian }}</td>
                                                        </tr>
                                                    </thead>
                                                </v-simple-table>
                                            </v-col>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card>

                            <v-card class="ma-2" outlined tile>
                                <v-row>
                                    <v-col>
                                        <v-data-table dense :headers="cetak.headers" :items="cetak.items"
                                            hide-default-footer>
                                            <template v-slot:[`item.nomor`]="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:[`item.nama_bahan`]="{ item }">
                                                <div class="text-caption"> {{ item.nama_bahan }} - {{ item.ukuran }}
                                                    <v-chip x-small label outlined>{{ item.kode_bahan }}</v-chip>
                                                </div>
                                            </template>
                                            <template v-slot:[`item.jumlah`]="{ item }">
                                                <div class="text-caption">{{ getFormatNumber(item.jumlah) }}</div>
                                            </template>
                                            <template v-slot:[`item.saldo_sewaktu`]="{ item }">
                                                <div class="text-caption">{{ getFormatNumber(item.saldo_sewaktu) }}
                                                </div>
                                            </template>
                                            <template v-slot:[`item.unit`]="{ item }">
                                                <div class="text-caption">{{ item.unit }}</div>
                                            </template>
                                            <template v-slot:[`item.harga_perkiraan`]="{ item }">
                                                <div class="text-caption">{{ getFormatNumber(item.harga_perkiraan) }}
                                                </div>
                                            </template>
                                            <template v-slot:[`item.subtotal`]="{ item }">
                                                <div class="text-caption">{{ getFormatNumber(item.jumlah *
                                                        item.harga_perkiraan)
                                                }}</div>
                                            </template>
                                            <template v-slot:[`item.status_pakai`]="{ item }">
                                                <div class="text-caption">{{ item.status_pakai }}</div>
                                            </template>
                                            <template v-slot:[`item.kegunaan`]="{ item }">
                                                <div class="text-caption">{{ item.kegunaan }}</div>
                                            </template>
                                            <template v-slot:[`item.keterangan`]="{ item }">
                                                <div class="text-caption">{{ item.keterangan }}</div>
                                            </template>


                                        </v-data-table>
                                    </v-col>
                                </v-row>
                            </v-card>

                            <v-card class="ma-2 mt-auto" elevation="0" tile>
                                <v-row class="px-4">
                                    <v-col cols="2" class="mx-0 px-0">
                                        <v-card outlined tile>
                                            <v-card-text class="py-1 d-flex justify-center text-caption">Admin / Pembuat</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-4 my-4 d-flex justify-center text-caption"></v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-1  d-flex justify-center text-caption"><strong>{{ cetak.items[0].nik_pembuat }}</strong>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="2" class="mx-0 px-0">
                                        <v-card outlined tile>
                                            <v-card-text class="py-1 d-flex justify-center text-caption">Kepala Bagian</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-4 my-4 d-flex justify-center text-caption">{{ getStatus(cetak.items[0].kabag_status) }}</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-1  d-flex justify-center text-caption"><strong>{{ cetak.items[0].kabag_nik }} </strong>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="2" class="mx-0 px-0">
                                        <v-card outlined tile>
                                            <v-card-text class="py-1 d-flex justify-center text-caption">Manajer</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-4 my-4 d-flex justify-center text-caption">{{ getStatus(cetak.items[0].manajer_status) }}</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-1  d-flex justify-center text-caption" ><strong>{{ cetak.items[0].manajer_nik }} </strong>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="2" class="mx-0 px-0">
                                        <v-card outlined tile>
                                            <v-card-text class="py-1 d-flex justify-center text-caption">Menyetujui</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-4 my-4 d-flex justify-center text-caption"></v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-1  d-flex justify-center text-caption"><strong>Saptiawan</strong>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="2" class="mx-0 px-0">
                                        <v-card outlined tile>
                                            <v-card-text class="py-1 d-flex justify-center text-caption">Pembelian</v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-4 my-4 d-flex justify-center text-caption"></v-card-text>
                                            <v-divider></v-divider>
                                            <v-card-text class="py-1  d-flex justify-center text-caption"><strong>Sri Nurcahyaningsih</strong>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-divider></v-divider>
                            <v-card class="pa-2 mx-2" elevation="0" tile>
                                <v-row class="d-flex justify-space-around">
                                    <v-col cols="auto">
                                        Tanggal Cetak : 22/11/2022
                                    </v-col>
                                    <v-col cols="auto">
                                        Jam Cetak : 22/11/2022
                                    </v-col>
                                    <v-col cols="auto">
                                        ISO 9001:2008
                                    </v-col>
                                    <v-col cols="auto">
                                        Tanggal Terbit : 01 Februari 2010
                                    </v-col>
                                    <v-col cols="auto">
                                        Revisi 01
                                    </v-col>

                                </v-row>
                            </v-card>
                        </v-card>
                    </v-container>
                </v-main>
            </v-app>

        </section>
    </VueHtml2pdf>
</template>

<script>
import axios from 'axios';
import VueHtml2pdf from "vue-html2pdf";
import moment from 'moment';
import numeral from 'numeral';
export default {
    components: {
        VueHtml2pdf
    },
    props: ['noUsulan'],
    data() {
        return {
            cetak: {
                headers: [
                    { text: "No.", value: "nomor", divider: true, sortable: false, },
                    { text: "Nama Bahan / Pekerjaan", value: "nama_bahan", divider: true, sortable: false },
                    { text: "Qty", value: "jumlah", divider: true, sortable: false, align:"right" },
                    { text: "Stok", value: "saldo_sewaktu", divider: true, sortable: false, align:"right" },
                    { text: "Sat.", value: "unit", divider: true, sortable: false },
                    { text: "Harga (Rp)", value: "harga_perkiraan", divider: true, sortable: false, align:"right" },
                    { text: "Subtotal (Rp)", value: "subtotal", divider: true, sortable: false, align:"right" },
                    { text: "Status", value: "status_pakai", divider: true, sortable: false },
                    { text: "Kegunaan", value: "kegunaan", divider: true, sortable: false },
                    { text: "Keterangan", value: "keterangan", sortable: false },
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
                        tiering_tgl: ""
                    }
                ],
            },
        }
    },
    mounted() {
        this.generateReport()
    },
    methods: {
        getStatus(status) {
            if (status == "1") {
                return 'Acc'
            } else if (status == "0") {
                return 'Tidak Acc'
            } else {
                return '-'
            }
        },
        getFormatTanggal(tanggal) {
            // moment.locale('id')
            if (moment(String(tanggal)).isValid()) {
                return moment(String(tanggal)).format('DD-MM-YYYY HH:mm')
            }
            return '-'
        },

        getFormatNumber(rp) {
            return numeral(rp).format("0,2");
        },
        generateReport() {
            this.loadDetail(this.noUsulan)
            setTimeout(() => {
                this.$refs.generate.generatePdf();
            }, 1000);
        },
        resetDetail() {
            this.cetak.items = [
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
                    tiering_tgl: ""
                }
            ]
        },
        async loadDetail(nousulan) {
            this.resetDetail()
            await axios.post('pembelian/usulanbarang/bynousulan', {
                'no_usulan': nousulan
            })
                .then((res) => {
                    if (res.data.success == false) {
                        console.log(res.data.error);
                        return
                    }
                    console.log(res.data.result);
                    this.cetak.items = res.data.result

                })
                .catch((err) => {
                    console.log(err);
                })

        }
    },
    watch: {
        noUsulan(newVal) {
            console.log(newVal);
            this.generateReport()
        }
    },
}
</script>

<style>

</style>