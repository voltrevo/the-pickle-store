import nil from "../nanocluster/common/nil.ts";
import RandomId from "../nanocluster/common/RandomId.ts";
import NanoService from "../nanocluster/lib/NanoService.ts";
import nt from "../nanocluster/nt/mod.ts";
import PickleStore from "../types.ts";

export default NanoService({
  public: true,

  protocol: {
    init: nt.fn()(nt.string),
    PickleStore: nt.fn(nt.string)(nt.union(PickleStore, nt.nil)),
    setPicklePrice: nt.fn(nt.string, nt.number)(nt.nil),
    buyPickles: nt.fn(nt.string, nt.number)(nt.nil),
    nextDay: nt.fn(nt.string)(nt.nil),
  },

  peers: {
    pickleSim: {
      init: nt.fn()(PickleStore),
      buyPickles: nt.fn(PickleStore, nt.number)(PickleStore),
      nextDay: nt.fn(PickleStore, nt.string)(PickleStore),
    },
  },

  methods: {
    async init({ storage, peers: { pickleSim } }) {
      const id = RandomId();

      const store = await pickleSim.init();
      await storage.set([id, "pickleStore"], store);

      return id;
    },

    async PickleStore({ storage }, [id]) {
      const store = await storage.get([id, "pickleStore"]);

      if (store === nil) {
        return nil;
      }

      nt.assert(store, PickleStore);

      return store;
    },

    async setPicklePrice({ storage }, [id, price]) {
      const store = await storage.get([id, "pickleStore"]);
      nt.assert(store, PickleStore);
      store.picklePrice = price;
      await storage.set([id, "pickleStore"], store);

      return nil;
    },

    async buyPickles({ storage, peers: { pickleSim } }, [id, maxSpend]) {
      let store = await storage.get([id, "pickleStore"]);
      nt.assert(store, PickleStore);
      store = await pickleSim.buyPickles(store, maxSpend);
      await storage.set([id, "pickleStore"], store);

      return nil;
    },

    async nextDay({ storage, peers: { pickleSim } }, [id]) {
      let store = await storage.get([id, "pickleStore"]);
      nt.assert(store, PickleStore);
      store = await pickleSim.nextDay(store, `${id}:day${store.storeAge}`);
      await storage.set([id, "pickleStore"], store);

      return nil;
    },
  },
});
