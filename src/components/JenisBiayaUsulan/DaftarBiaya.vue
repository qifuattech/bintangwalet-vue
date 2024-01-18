<template>
    <div>
        <v-card>
            <v-card-title class="py-2">
                Daftar Bahan
                <v-spacer></v-spacer>
                <v-btn color="success" outlined rounded @click="showTambah()">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row class="mt-2 d-flex justify-space-between">
                    <v-col>
                        <v-text-field v-model="data.search" label="Pencarian" dense outlined append-icon="mdi-magnify"
                            clearable hide-details></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-card outlined class="mb-2">
                            <v-card-text class="pa-0">
                                <v-data-table dense :headers="data.headers" :items="data.items" :loading="data.loading"
                                    :search="data.search">
                                    <template v-slot:[`item.opsi`]="{ item }">
                                        <v-btn color="info" x-small outlined rounded
                                            @click="pilihItem(item.jenis_biaya, item.subjenis_biaya)">
                                            <v-icon small>mdi-check</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialogTambah" :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title class="py-2">
                    Tambah Kegunaan
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="mt-4">
                    <v-text-field v-model="form.jenis_biaya" label="Masukkan Jenis Biaya" clearable dense outlined>
                    </v-text-field>
                    <v-text-field v-model="form.subjenis_biaya" label="Masukkan Sub Jenis Biaya" clearable dense
                        outlined>
                    </v-text-field>
                    <div class="d-flex justify-end pb-4">

                        <v-btn color="success" outlined rounded @click="simpanData()">
                            <v-icon>mdi-content-save-outline</v-icon> Simpan
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
import axios from 'axios'
import swal from 'sweetalert'

export default {
    data() {
        return {
            dialogTambah: false,
            form: {
                jenisBiaya: "",
                subJenisBiaya: "",
            },
            data: {
                headers: [
                    { text: "Jenis Biaya", value: "jenis_biaya", divider: true },
                    { text: "Sub-Jenis", value: "subjenis_biaya", divider: true },
                    { text: "Opsi", value: "opsi", align: "center", width: "10%" },
                ],
                items: [],
                loading: false,
                search: ""
            }
        }
    },
    mounted() {
        this.loadData()
    },
    methods: {
        simpanData() {
            axios.post('master/biayausulan/create', {
                'kode_dept': this.$store.state.auth.user.kode_dept,
                'nama_kegunaan': this.form.namaKegunaan
            })
                .then((res) => {
                    if (res.data.success == false) {
                        swal('Gagal', 'Tambah Kegunaan Gagal : ' + res.data.error, 'error')
                        return
                    }
                    swal('Sukses', 'Tambah Kegunaan ' + res.data.result + ' Berhasil', 'success')
                    this.dialogTambah = false
                    this.loadData()
                })
        },
        showTambah() {
            this.dialogTambah = true
        },
        pilihItem(jenis, subjenis) {
            
            this.$emit('biaya', {
                jenis: jenis,
                subjenis: subjenis,
            })
        },
        loadData() {
            this.data.loading = true
            this.data.items = []
            axios.post('master/biayausulan')
                .then((res) => {
                    if (res.data.success == false) {
                        console.log(res.data.error);
                        return
                    }
                    this.data.loading = false
                    this.data.items = res.data.result
                })
                .catch((err) => {
                    this.data.loading = false
                    console.log(err);
                })
        }
    }
}
</script>
  
<style>

</style>