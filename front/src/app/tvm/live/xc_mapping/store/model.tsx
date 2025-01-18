import {XstreamResource, XstreamResourceValueLabel,} from "../../../../../api/ks/v1/km_pb";

export type XStreamStore = {
    XStreamEdit: XstreamResource;
    XStreamlist: XstreamResource[];
    XStreamFilter: XstreamResource;
    XStreamtableUrl: string;
    allXstream: XstreamResourceValueLabel[];
};
