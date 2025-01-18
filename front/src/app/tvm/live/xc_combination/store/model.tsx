import {XstreamCombo, XstreamComboValueLabel,} from "../../../../../api/ks/v1/km_pb";

export type XComboStore = {
    XComboEdit: XstreamCombo;
    XCombolist: XstreamCombo[];
    XComboFilter: XstreamCombo;
    XCombotableUrl: string;
    allXCombo: XstreamComboValueLabel[];
};
