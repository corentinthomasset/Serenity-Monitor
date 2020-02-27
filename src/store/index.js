import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import Sentinel from "./Models/Sentinel";
import NetworkLink from "./Models/NetworkLink";
import Device from "./Models/Device";
import Block from "./Models/Block";
import CurrentBlock from "./Models/CurrentBlock";
import Fingerprint from "./Models/Fingerprint";
import Hx from "./Models/Hx";
import DarkPool from "./Models/DarkPool";
import Miner from "./Models/Miner";
import Endpoint from "./Models/Endpoint";
import FirewallEvent from "./Models/FirewallEvent";

Vue.use(Vuex);

const database = new VuexORM.Database();

database.register(Sentinel);
database.register(NetworkLink);
database.register(Device);
database.register(Block);
database.register(CurrentBlock);
database.register(Fingerprint);
database.register(Hx);
database.register(DarkPool);
database.register(Miner);
database.register(Endpoint);
database.register(FirewallEvent);

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
