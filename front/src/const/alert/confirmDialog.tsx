import * as React from "react";
import {useState} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {authProxy} from "../../app/auth/store/store";
import {
    IsConfirmDialog,
    IsOpenDialog,
    useproxy_IsConfirmDialogContent,
    useproxy_IsConfirmDialogIsOpen,
    useproxy_IsConfirmDialogTitle,
} from "./store";
import {ActionStore} from "./model";
import {grpcXstreamEdit} from "../../app/tvm/live/xc_mapping/api/grpcXstreamEdit";
import {message} from "antd";
import {grpcXComboEdit} from "../../app/tvm/live/xc_combination/api/grpcXComboEdit";
import {grpcXCAccountEdit} from "../../app/tvm/account/api/grpcXCAccountEdit";
import {useNavigate} from "react-router-dom";
import {grpcApkDeletelist} from "../../app/ott/apk/api/apk/grpcApkDeletelist";
import {grpcApkversionEdit} from "../../app/ott/apk/api/apkversion/grpcApkversionEdit";
import {grpcFirewareEdit} from "../../app/ott/fireware/api/fireware/grpcFirewareEdit";
import {grpcFirewareversionEdit} from "../../app/ott/fireware/api/firewareversion/grpcFirewareversionEdit";
import {grpcPermissionDelete} from "../../app/system/permission/api/grpcPermissionDelete";
import {grpcRoleDelete} from "../../app/system/role/api/grpcRoleDelete";
import {grpcUserEdit} from "../../app/system/user/api/grpcUserEdit";
import {grpcAccountDelete} from "../../app/ott/account/api/grpcAccountDelete";
import {grpcTerminalDelete} from "../../app/ott/terminal/api/grpcTerminalDelete";
import {grpcAddEdit} from "../../app/ott/advertisement/api/grpcAddEdit";
import {grpcBackgroundEdit} from "../../app/ott/backgroundImage/api/grpcBackgroundEdit";
import {grpcDeskImageEdit} from "../../app/ott/desktopImage/api/grpcDeskImageEdit";
import {grpcNotificationEdit} from "../../app/ott/notification/api/grpcNotificationEdit";
import {grpcUserReset} from "../../app/system/user/api/grpcUserReset";
import {grpcTVApkEdit} from "../../app/tv/TVapk/api/apk/grpcTVApkEdit";
import {grpcTVFirewareEdit} from "../../app/tv/TVfireware/api/fireware/grpcTVFirewareEdit";
import {grpcTVFirewareversionEdit} from "../../app/tv/TVfireware/api/firewareversion/grpcTVFirewareversionEdit";
import {grpcTVApkversionEdit} from "../../app/tv/TVapk/api/apkversion/grpcTVApkversionEdit";
import {grpcTVBackgroundEdit} from "../../app/tv/TVbackgroundImage/api/grpcTVBackgroundEdit";
import {grpcTVAddEdit} from "../../app/tv/TVadvertisement/api/grpcTVAddEdit";
import {grpcTVDeskImageEdit} from "../../app/tv/TVdesktopImage/api/grpcTVDeskImageEdit";
import CircularIndeterminate from "./circularIndeterminate";
import {grpcTVApkDeletelist} from "../../app/tv/TVapk/api/apk/grpcTVApkDeletelist";
import {grpcApkEdit} from "../../app/ott/apk/api/apk/grpcApkEdit";
import {grpcTVAccountDelete} from "../../app/tv/TVaccount/api/grpcTVAccountDelete";
import {grpcAppsEdit} from "../../app/wstore/app/api/app/grpcAppEdit";
import {grpcCategoriesEdit} from "../../app/wstore/categories/api/grpcCategoriesEdit";
import {grpcpriceplansEdit} from "../../app/wstore/priceplans/api/grpcpriceplansEdit";
import {grpcServerEdit} from "../../app/ott/domain/api/grpcdomainEdit";
import {grpcTVdomainEdit} from "../../app/tv/TVdomain/api/grpcTVdomainEdit";
import {grpcAppsversionEdit} from "../../app/wstore/app/api/apkversion/grpcAppversionEdit";
import {grpcAppUserEdit} from "../../app/wstore/appUser/api/grpcAppUserEdit";
import {grpcEpgDelete} from "../../app/tvm/epg/api/grpcEpgDelete";
import {grpcTVTerminalDelete} from "../../app/tv/Tvterminal/api/grpcTerminalDelete";
import {grpcAddressDelete} from "../../app/tvm/address/api/grpcAddressDelete";
import {grpcfirstEdit} from "../../app/tvm/lscategories/api/first/grpcfirstEdit";
import {grpcSecondDelete} from "../../app/tvm/lscategories/api/second/grpcSecondDelete";
import {grpcThirdDelete} from "../../app/tvm/lscategories/api/third/grpcThirdDelete";
import {grpclinkDelete} from "../../app/tvm/lscategories/api/link/grpclinkDelete";
import {grpcAgreementEdit} from "../../app/tsv/agreement/api/grpcAgreementEdit";
import {grpcOptionEdit} from "../../app/tsv/option/api/grpcOptionEdit";
import {grpcRecommendEdit} from "../../app/tsv/recommend/api/grpcRecommendEdit";
import {grpcResourceDelete} from "../../app/tsv/resource/api/grpcResourceDelete";
import {grpcVideoDelete} from "../../app/tsv/video/api/grpcVideoDelete";
import {grpcPlaybackDelete} from "../../app/tvm/playback/api/grpcPlaybackDelete";
import {grpcTVNotificationEdit} from "../../app/tv/TVnotification/api/grpcTVNotificationEdit";
import {useTranslation} from "react-i18next";
import {grpcmarketImageEdit} from "../../app/z_distributor/tv/marketImage/api/level2/grpcmarketImageEdit";
import {
    grpcVideoDeleteforDistributor
} from "../../app/z_distributor/mowo/vodio/api/level2/grpcVideoDeleteforDistributor";
import {grpcVodfirstEdit} from "../../app/vod/lscategories/api/first/grpcVodfirstEdit";
import {grpcVodSecondDelete} from "../../app/vod/lscategories/api/second/grpcVodSecondDelete";
import {grpcVodVodLinkDelete} from "../../app/vod/lscategories/api/link/grpcVodlinkDelete";
import {grpcApkCategoryEdit} from "../../app/ott/categories/api/grpcCategoriesEdit";
import {grpcDistributorDetailEdit} from "../../app/ott/distributor/api/grpcDistributorDetailEdit";
import {grpcRecommendApkEdit} from "../../app/ott/recommendApk/api/grpcRecommendApkEdit";
import {grpcQueryDesktopDelete} from "../../app/z_distributor/vodAccount/api/level2/grpcQueryDesktopDelete";
import {grpcUpdateVodAccount} from "../../app/z_distributor/vodAccount/api/level1/grpcUpdateVodAccount";
import {grpcDesktopLinkDelete} from "../../app/z_distributor/vodAccount/api/level3/grpcDesktopLinkDelete";
import {grpcmarketOTTImageEdit} from "../../app/z_distributor/ott/marketImage/api/level2/grpcmarketOTTImageEdit";
import {grpcUpdateMowoClass} from "../../app/vod/mowo3/api/first/grpcUpdateMowoClass";
import {grpcUpdateClass} from "../../app/vod/mowo3/api/second/grpcUpdateClass";
import {grpcUpdateClassResource} from "../../app/vod/mowo3/api/link/grpcUpdateClassResource";
import {grpcVodbannerEdit} from "../../app/vod/lscategories/api/vodbanner/grpcVodbannerEdit";
import {grpcTypeSecondDelete} from "../../app/vod/lscategories/api/secondType/grpcTypeSecondDelete";
import {grpcTypeThirdDelete} from "../../app/vod/lscategories/api/thirdType/grpcTypeThirdDelete";

export default function ConfirmDialog({action, row}) {
    var IsOpen = useproxy_IsConfirmDialogIsOpen();
    var title = useproxy_IsConfirmDialogTitle();
    var content = useproxy_IsConfirmDialogContent();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const {t} = useTranslation();
    const handleClose = () => {
        IsConfirmDialog.IsOpen = false;
    };
    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (action === ActionStore.DeleteApks) {
                var res = await grpcApkDeletelist(row, authProxy.token);
                if (res.status) {
                    IsOpenDialog.content = "批量删除成功!";

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteApk) {
                row.deleted = true;
                var res = await grpcApkEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteApkversion) {
                row.deleted = true;
                var res = await grpcApkversionEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteFirmware) {
                row.deleted = true;
                var res = await grpcFirewareEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteFirmwareversion) {
                row.deleted = true;
                var res = await grpcFirewareversionEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeletePermission) {
                var res = await grpcPermissionDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteRole) {
                var res = await grpcRoleDelete(row.id, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteUser) {
                var res = await grpcUserEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteAccount) {
                var res = await grpcAccountDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.Deleteterminal) {
                var res = await grpcTerminalDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteTVterminal) {
                var res = await grpcTVTerminalDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteAdd) {
                var res = await grpcAddEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteBackground) {
                var res = await grpcBackgroundEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.DeleteDeskImage) {
                var res = await grpcDeskImageEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.Deletenotification) {
                var res = await grpcNotificationEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            }  else if (action == ActionStore.TVDeletenotification) {
                var res = await grpcTVNotificationEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action == ActionStore.ResetUserPwd) {
                var res = await grpcUserReset(row, authProxy.token);
                if (res.status) {
                    IsOpenDialog.content = "已经重置成功!";

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVApks) {
                // 电视机
                var res = await grpcTVApkDeletelist(row, authProxy.token);
                if (res.status) {
                    IsOpenDialog.content = "批量删除成功!";

                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVApk) {
                row.deleted = true;
                var res = await grpcTVApkEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVAccount) {
                console.log("rowaaa", row);
                row.deleted = true;
                var res = await grpcTVAccountDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVFirmware) {
                // 从这里开始算
                row.deleted = true;
                var res = await grpcTVFirewareEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVFirmwarrversion) {
                row.deleted = true;
                var res = await grpcTVFirewareversionEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVApkversion) {
                row.deleted = true;
                var res = await grpcTVApkversionEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVBackground) {
                row.deleted = true;
                var res = await grpcTVBackgroundEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVAdd) {
                row.deleted = true;
                var res = await grpcTVAddEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVDeskImage) {
                row.deleted = true;
                var res = await grpcTVDeskImageEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVMXSource) {
                row.deleted = true;
                var res = await grpcXstreamEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVMXCombo) {
                row.deleted = true;
                var res = await grpcXComboEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVMAccount) {
                row.deleted = true;
                var res = await grpcXCAccountEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteApps) {
                // 分界线
                row.deleted = true;
                var res = await grpcAppsEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteCategories) {
                row.deleted = true;
                var res = await grpcCategoriesEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeletePricePlans) {
                row.deleted = true;
                var res = await grpcpriceplansEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteServer) {
                row.deleted = true;
                var res = await grpcServerEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVServer) {
                row.deleted = true;
                var res = await grpcTVdomainEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteAppsversion) {
                row.deleted = true;
                var res = await grpcAppsversionEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteAppUser) {
                row.deleted = true;
                var res = await grpcAppUserEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTVMXStream) {
                row.deleted = true;
                var res = await grpcXstreamEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteXCAccount) {
                row.deleted = true;
                var res = await grpcXCAccountEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteEPG) {
                var res = await grpcEpgDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteAddress) {
                var res = await grpcAddressDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteMainClass) {
                var res = await grpcfirstEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteSubClass) {
                var res = await grpcSecondDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteChannel) {
                var res = await grpcThirdDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteLink) {
                var res = await grpclinkDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteAgreement) {
                var res = await grpcAgreementEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteClassInfo) {
                var res = await grpcOptionEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteRecommend) {
                var res = await grpcRecommendEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteResource) {
                var res = await grpcResourceDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteVideo) {
                var res = await grpcVideoDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeletePlayback) {
                var res = await grpcPlaybackDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteTvnotification) {
                var res = await grpcTVNotificationEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteAppBanner) {
                var res = await grpcmarketImageEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteOTTAppBanner) {
                var res = await grpcmarketOTTImageEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteVideoForDistributor) {
                var res = await grpcVideoDeleteforDistributor(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteVodClass) {
                var res = await grpcVodfirstEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteVod) {
                var res = await grpcVodSecondDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteVodLink) {
                var res = await grpcVodVodLinkDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }  else if (action === ActionStore.DeleteApkCategory) {
                var res = await grpcApkCategoryEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteDistributorDetail) {
                var res = await grpcDistributorDetailEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            } else if (action === ActionStore.DeleteRecommendApk) {
                var res = await grpcRecommendApkEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteVodAccount) {
                var res = await grpcUpdateVodAccount(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteVodDeskTop) {
                var res = await grpcQueryDesktopDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteVodLinkAccount) {
                var res = await grpcDesktopLinkDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteMowoClass) {
                var res = await grpcUpdateMowoClass(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteClassData) {
                var res = await grpcUpdateClass(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteClassResource) {
                var res = await grpcUpdateClassResource(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteVodBanner) {
                var res = await grpcVodbannerEdit(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteVodType) {
                var res = await grpcTypeSecondDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }else if (action === ActionStore.DeleteVodTypeItem) {
                var res = await grpcTypeThirdDelete(row, authProxy.token);
                if (res.status) {
                    message.success("已经删除成功!");
                    IsConfirmDialog.refleshPage = true;
                }
            }

            // DeleteEPG
            handleClose();
            setLoading(false);
        } catch (error) {
            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "ERROR";
            IsOpenDialog.content = "删除过程出现错误,请重试/联系管理员";
        }
        setLoading(false);
    };

    return (
        <React.Fragment>
            {loading ? (
                <CircularIndeterminate/>
            ) : (
                <Dialog
                    open={IsOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {content}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t("Cancel")}</Button>
                        <Button onClick={handleConfirm} autoFocus>
                            {t("Confirm")}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </React.Fragment>
    );
}
