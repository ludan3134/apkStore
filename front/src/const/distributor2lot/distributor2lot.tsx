import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {LotLabel} from "../../api/asm/v1/asm_pb";
import {DistributorLabel} from "../../api/ax/v1/axm_pb";

export type Distributor2lot = {
    distributors: DistributorLabel[];
    lots: LotLabel[];
    filterLots: LotLabel[];
};

const initialDistributor2lot: Distributor2lot = {
    distributors: [] as DistributorLabel[],
    lots: [] as LotLabel[],
    filterLots: [] as LotLabel[],
};
export const Distributor2lotProxy = proxy<Distributor2lot>(
    initialDistributor2lot,
);

export const useDistributorlist = () => {
    var distributor2lotStore = useProxy(Distributor2lotProxy);
    console.info(
        "调用usedistributor2lotRows,返回Rows列表:",
        distributor2lotStore.distributors,
    );
    return distributor2lotStore.distributors;
};
export const useLots = () => {
    var distributor2lotStore = useProxy(Distributor2lotProxy);
    console.info(
        "调用usedistributor2lotRows,返回Rows列表:",
        distributor2lotStore.lots,
    );
    return distributor2lotStore.lots;
};
export const usefilterlot = () => {
    var distributor2lotStore = useProxy(Distributor2lotProxy);
    console.info(
        "调用usedistributor2lotRows,返回Rows列表:",
        distributor2lotStore.filterLots,
    );
    return distributor2lotStore.filterLots;
};
