import {QueryAllDistributorLotRequest, QueryAllDistributorLotResponse,} from "../../../api/tv_as/v1/as_pb";
import {authProxy} from "../../../app/auth/store/store";
import {TVAsvClient} from "../../../grpcClinet/grpcTVAsvClient";
import {Distributor2lotProxy} from "../distributor2lot";
import {ConnectError} from "@connectrpc/connect";

export const grpcTVDistributorLot =
    async (): Promise<QueryAllDistributorLotResponse> => {
        const req = new QueryAllDistributorLotRequest({});
        console.info("grpcDistributorToModel-req", req);
        var headers = new Headers();
        headers.set("token", authProxy.token);
        try {
            const res = await TVAsvClient.queryAllDistributorLot(req, {
                headers: headers,
            });
            console.info("grpcDistributorToModel-res", res);
            if (res === undefined) {
                return res;
            }
            if (res.status) {
                Distributor2lotProxy.distributors = res.distributorList;
                Distributor2lotProxy.lots = res.lotList;
                return res;
            }
        } catch (err) {
            if (err instanceof ConnectError) {
                console.log("error code", err.code, "error message", err.message);
            }
            const er1 = ConnectError.from(err);
            console.log("error code", er1.code, "error message", er1.message);
        }
        return new QueryAllDistributorLotResponse();
    };
