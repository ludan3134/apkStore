import {DistributorDetail} from "../../../../api/fs/v1/fm_pb";

export type DistributorDetailStore = {
    DistributorDetailEdit: DistributorDetail;
    DistributorDetailList: DistributorDetail[];
    DistributorDetailUrl: string;
    DistributorDetailFilter: DistributorDetail;
};
