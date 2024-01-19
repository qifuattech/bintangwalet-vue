import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import Route from "../views/Route.vue";

import Dashboard from "../views/Dashboard.vue";

import ManajemenMenu from "../views/Superadmin/ManajemenMenu.vue";
import ManajemenUserMenu from "../views/Superadmin/ManajemenUserMenu.vue";

import MasterJenis from "../views/Master/JenisBarang.vue";
import MasterUnit from "../views/Master/UnitView.vue";
import MasterBarang from "../views/Master/BarangView.vue";

import MasterSupplier from "../views/Master/SupplierView.vue";
import MasterCustomer from "../views/Master/CustomerView.vue";
import MasterSales from "../views/Master/SalesView.vue";
import MasterBank from "../views/Master/BankView.vue";
import MasterAkun from "../views/Master/AkunView.vue";
import MasterRekeningakun from "../views/Master/RekeningView.vue";
import MasterKendaraan from "../views/Master/KendaraanView.vue";

import ListPurchasingOrder from "../views/Pembelian/PurchaseOrder/ListPurchasingOrder.vue";
import InputPurchasingOrder from "../views/Pembelian/PurchaseOrder/InputPurchasingOrder.vue";

import ListPenerimaanPO from "../views/Pembelian/PenerimaanPO/ListPenerimaanPO.vue";
import InputPenerimaanPO from "../views/Pembelian/PenerimaanPO/InputPenerimaanPO.vue";

import InputTransaksiPenjualan from "../views/Penjualan/Transaksi/InputTransaksi.vue";
import ListTransaksiPenjualan from "../views/Penjualan/Transaksi/ListTransaksi.vue";

import InputPengirimanPenjualan from "../views/Penjualan/Pengiriman/InputPengiriman.vue";
import ListPengirimanPenjualan from "../views/Penjualan/Pengiriman/ListPengiriman.vue";

import InputReturnPenjualan from "../views/Penjualan/Return/InputReturn.vue";
import ListReturnPenjualan from "../views/Penjualan/Return/ListReturn.vue";

import InputAdjustment from "../views/Adjustment/InputAdjustment.vue";
import ListAdjustment from "../views/Adjustment/ListAdjustment.vue";

import InputKas from '../views/Kas/InputKas.vue'

import Laporan from  '../views/Laporan/LaporanView.vue'

import TestExcel from '../views/ZZ/TestExcel.vue'

// import axios from "axios";

Vue.use(VueRouter);

const routes = [
  // CASHFLOW
  {
    path: "/",
    name: "Home",
    component: Home,
    // meta: {
    //   auth: true,
    // },
  },
  {
    path: "/route",
    name: "Route",
    component: Route,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    // meta: {
    //   auth: true
    // }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pengaturan/menu",
    name: "ManajemenMenu",
    component: ManajemenMenu,
    meta: {
      auth: true
    }
  },

  {
    path: "/pengaturan/usermenu",
    name: "ManajemenUserMenu",
    component: ManajemenUserMenu,
    meta: {
      auth: true
    }
  },
  {
    path: "/master/jenisbarang",
    name: "MasterJenis",
    component: MasterJenis,
    meta: {
      auth: true
    }
  },
  {
    path: "/master/unit",
    name: "MasterUnit",
    component: MasterUnit,
    meta: {
      auth: true,
    },
  },
  {
    path: "/master/barang",
    name: "MasterBarang",
    component: MasterBarang,
    meta: {
      auth: true,
    },
  },
  {
    path: "/master/supplier",
    name: "MasterSupplier",
    component: MasterSupplier,
    meta: {
      auth: true
    }
  },
  {
    path: "/master/customer",
    name: "MasterCustomer",
    component: MasterCustomer,
    meta: {
      auth: true
    }
  },
  {
    path: "/master/sales",
    name: "MasterSales",
    component: MasterSales,
    meta: {
      auth: true
    }
  },
  {
    path: "/master/bank",
    name: "MasterBank",
    component: MasterBank,
    meta: {
      auth: true
    }
  },
  {
    path: "/master/akun",
    name: "MasterAkun",
    component: MasterAkun,
    meta: {
      auth: true
    }
  },

  {
    path: "/master/rekeningakun",
    name: "MasterRekeningakun",
    component: MasterRekeningakun,
    // meta: {
    //   auth: true
    // }
  },
  {
    path: "/master/kendaraan",
    name: "MasterKendaraan",
    component: MasterKendaraan,
    // meta: {
    //   auth: true
    // }
  },
  {
    path: "/pembelian/po",
    name: "ListPurchasingOrder",
    component: ListPurchasingOrder,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pembelian/po/input",
    name: "InputPurchasingOrder",
    component: InputPurchasingOrder,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pembelian/terima",
    name: "ListPenerimaanPO",
    component: ListPenerimaanPO,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pembelian/terima/input",
    name: "InputPenerimaanPO",
    component: InputPenerimaanPO,
    meta: {
      auth: true,
    },
  },
  {
    path: "/penjualan/transaksi/input",
    name: "InputTransaksiPenjualan",
    component: InputTransaksiPenjualan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/penjualan/transaksi/list",
    name: "ListTransaksiPenjualan",
    component: ListTransaksiPenjualan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/penjualan/return",
    name: "ListReturnPenjualan",
    component: ListReturnPenjualan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/penjualan/return/input",
    name: "InputReturnPenjualan",
    component: InputReturnPenjualan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/penjualan/pengiriman/input",
    name: "InputPengirimanPenjualan",
    component: InputPengirimanPenjualan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/penjualan/pengiriman",
    name: "ListPengirimanPenjualan",
    component: ListPengirimanPenjualan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/adjustment",
    name: "ListAdjustment",
    component: ListAdjustment,
    meta: {
      auth: true,
    },
  },
  {
    path: "/adjustment/input",
    name: "InputAdjustment",
    component: InputAdjustment,
    meta: {
      auth: true,
    },
  },
  {
    path: "/kas/input",
    name: "InputKas",
    component: InputKas,
    meta: {
      auth: true,
    },
  },
  {
    path: "/laporan",
    name: "Laporan",
    component: Laporan,
    meta: {
      auth: true,
    },
  },
  {
    path: "/zz/testexcel",
    name: "TestExcel",
    component: TestExcel,
    meta: {
      auth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
import axios from 'axios'
router.beforeEach((to, from, next) => {
  axios
    .post("weblog", {
      menu_from: from.fullPath,
      menu_to: to.fullPath,
    })
    .then((res) => {
      if (res.data.success == false) {
        console.log(res.data.data);
        store.commit("setOffline");
        return;
      }
      store.commit("setOnline");
      console.log(res.data.data);
    })
    .catch((err) => {
      store.commit("setOffline");
      console.log(err);
    });

  if (to.matched.some((record) => record.meta.auth)) {
    if (store.getters.isLoggedIn && store.getters.user) {
      // console.log(store.getters.isLoggedIn);
      // console.log('cekrouter');
      next();
      return;
    }
    next("/login");
  }

  if (to.matched.some((record) => record.meta.guest)) {
    if (!store.getters.isLoggedIn) {
      next("/login");
      return;
    }
    next("/login");
  }
  next();
});

export default router;
