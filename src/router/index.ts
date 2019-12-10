import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Warehouse from '@/views/Warehouse.vue';
import Planner from '@/views/Planner.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: Warehouse,
  },
  {
    path: '/planner',
    name: 'planner',
    component: Planner,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
