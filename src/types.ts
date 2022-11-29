import nt from "./nanocluster/nt/mod.ts";

const PickleStore = nt.object({
  cash: nt.number, // cents
  pickles: nt.number,
  picklePrice: nt.number,
  storeAge: nt.number, // days
});

type PickleStore = nt.TypeOf<typeof PickleStore>;

export default PickleStore;
