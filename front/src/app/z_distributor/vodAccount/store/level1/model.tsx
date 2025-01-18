import {Top10Manager, XstreamComboValueLabel} from "../../../../../api/ks/v1/km_pb";

export type Top10ManagerStore = {
    Top10ManagerEdit: Top10Manager;
    Top10Managerlist: Top10Manager[];
    Top10ManagerFilter: Top10Manager;
    Top10ManagertableUrl: string[];
    Top10ManagerAllClass: XstreamComboValueLabel[]
};
