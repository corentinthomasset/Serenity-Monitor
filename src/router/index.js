import Vue from 'vue'
import VueRouter from 'vue-router'
import Network from "../views/Network";
import Blockchain from "../views/Blockchain";
import Sentinel from "../views/Sentinel";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'network',
    component: Network
  },
  {
    path:'/blockchain',
    name: 'blockchain',
    component: Blockchain
  },
  {
    path:'/blockchain/:id',
    component: Blockchain,
    props: true
  },
  {
    path:'/sentinel/:address',
    name: 'sentinel',
    component: Sentinel,
    props: true
  },
];

const router = new VueRouter({
  routes
});

export default router;
