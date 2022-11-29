import { Keccak256 } from "../deps.ts";
import toBuffer from "../nanocluster/comms/toBuffer.ts";
import NanoService from "../nanocluster/lib/NanoService.ts";
import nt from "../nanocluster/nt/mod.ts";

const PickleStore = nt.object({
  cash: nt.number, // cents
  pickles: nt.number,
  picklePrice: nt.number,
  storeAge: nt.number, // days
});

const wholesalePicklePrice = 30;

const dailyCustomers = 1000;
const pInterestedInPickles = 0.05;

function CustomerPrice(rng: Rng) {
  const meanCustomerPrice = 100;
  const stdevMulCustomerPrice = 2;

  return meanCustomerPrice * Math.exp(
    rng.Normal() * Math.log(stdevMulCustomerPrice)
  );
}

export default NanoService({
  protocol: {
    init: nt.fn()(PickleStore),
    buyPickles: nt.fn(PickleStore, nt.number)(PickleStore),
    nextDay: nt.fn(PickleStore, nt.string)(PickleStore),
  },

  peers: {},

  methods: {
    init: () => ({
      cash: 10000,
      pickles: 0,
      picklePrice: 200,
      storeAge: 0,
    }),

    buyPickles: (_ctx, [store, maxSpend]) => {
      maxSpend = Math.min(store.cash, maxSpend);
      const volume = Math.floor(maxSpend / wholesalePicklePrice);

      store.cash -= volume * wholesalePicklePrice;
      store.pickles += volume;

      return store;
    },

    nextDay: (_ctx, [store, seed]) => {
      const rng = new Rng(seed);

      for (let i = 0; i < dailyCustomers; i++) {
        if (store.pickles <= 0) {
          break;
        }

        if (rng.Uniform01() >= pInterestedInPickles) {
          continue;
        }

        if (store.picklePrice <= CustomerPrice(rng)) {
          store.pickles--;
          store.cash += store.picklePrice;
        }
      }

      store.storeAge++;

      return store;
    },
  },
});

class Rng {
  counter = 0;

  constructor(public seed: string) {}

  Hash() {
    return new Uint8Array(
      new Keccak256().update(toBuffer([this.seed, this.counter++])).digest(),
    );
  }

  Uint32() {
    const hash = this.Hash();

    return hash[0] + 256 * hash[1] + (256 ** 2) * hash[2] + (256 ** 3) * hash[3];
  }

  Uniform01() {
    return this.Uint32() / (2 ** 32);
  }

  Normal() {
    return Math.sqrt(-2 * Math.log(this.Uniform01())) *
      Math.cos(2 * Math.PI * this.Uniform01());
  }
}
