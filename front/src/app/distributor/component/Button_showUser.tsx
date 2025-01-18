import * as React from "react";
import {useState} from "react";
import {authProxy} from "../../auth/store/store";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import {grpcDistributorUser} from "../api/grpcDistributorUser";
import {DistributorTreeStoreProxy, useproxy_DistributorIsUserChange,} from "../store/store";
import {User} from "../../../api/ax/v1/axm_pb";
import Modal_showUser from "./Modal_showUser";

export default function Button_showuser(rows) {
    // const [hasUser, setHasUser] = useState<string>()
    const [userInfo, setUserInfo] = useState<User[]>();
    const [num, setNum] = useState<number>();
    var b = useproxy_DistributorIsUserChange();
    console.log("b", b);

    React.useEffect(() => {
        const fetchData = async () => {
            var res = await grpcDistributorUser(rows.rows.value, authProxy.token);
            if (res.status) {
                setUserInfo(res.userList);
                setNum(res.userNum);
            }
        };
        fetchData();
        DistributorTreeStoreProxy.IsUserChange = false;
    }, [b]);

    return (
        <React.Fragment>
            {num === 0 ? (
                <NoAccountsIcon/>
            ) : (
                num !== undefined && <Modal_showUser usernum={num} rows={userInfo}/>
            )}

            {/*<Modal_showUser usernum={num} rows={rows}/>*/}
            {/*{hasUser ? (<div>{hasUser}</div>) : (<NoAccountsIcon/>)}*/}
        </React.Fragment>
    );
}
