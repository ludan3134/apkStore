import {createBrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "./error/errorBoundary";
import React from "react";
import {Login} from "../app/auth/login";
import Role_Table from "../app/system/role/Component/role_Table";
import User_Table from "../app/system/user/Component/user_Table";
import {User_Edit} from "../app/system/user/Component/user_Edit";
import Permission_Tree from "../app/system/permission/Component/permission_Tree";
import {permissionProxyLoader} from "../app/system/permission/store/store";

import Xcmapping_Table from "../app/tvm/live/xc_mapping/component/xcmapping_Table";
import {pre_XStreamlistLoader} from "../app/tvm/live/xc_mapping/store/store";
import {Xcmapping_Edit} from "../app/tvm/live/xc_mapping/component/xcmapping_Edit";
import {Xcmapping_Add} from "../app/tvm/live/xc_mapping/component/xcmapping_Add";
import Xcombination_Table from "../app/tvm/live/xc_combination/component/xcombination_Table";
import {Xcombination_Edit} from "../app/tvm/live/xc_combination/component/xcombination_Edit";
import {Xcombination_Add} from "../app/tvm/live/xc_combination/component/xcombination_Add";
import {pre_XCombolistLoader} from "../app/tvm/live/xc_combination/store/store";
import Xcaccount_Table from "../app/tvm/account/component/xcaccount_Table";
import {Xcaccount_Add} from "../app/tvm/account/component/xcaccount_Add";
import {pre_XCAccountLoader} from "../app/tvm/account/store/store";
import {Xcaccount_Edit} from "../app/tvm/account/component/xcaccount_Edit";
import {Xcaccount_BulkInsert} from "../app/tvm/account/component/xcaccount_BulkInsert";
import {Permission_Edit} from "../app/system/permission/Component/permission_Edit";
import {UserProxyLoder} from "../app/system/user/store/store";
import {pre_DistributorlistLoader} from "../app/distributor/store/store";
import Distributor_Table from "../app/distributor/component/distributor_Table";
import {pre_ModellistLoader} from "../app/model/store/store";
import Model_Table from "../app/model/component/model_Table";
import Apk_Table from "../app/ott/apk/component/apk/apk_Table";
import {Apk_Edit} from "../app/ott/apk/component/apk/apk_Edit";
import {pre_FirewarelistLoader} from "../app/ott/fireware/store/fireware/store";
import {Fireware_Edit} from "../app/ott/fireware/component/fireware/fireware_Edit";
import {Fireware_Add} from "../app/ott/fireware/component/fireware/fireware_Add";
import Firewareversion_Table from "../app/ott/fireware/component/firewareversion/firewareversion_Table";
import {Firewareversion_Edit} from "../app/ott/fireware/component/firewareversion/firewareversion_Edit";
import {Firewareversion_Add} from "../app/ott/fireware/component/firewareversion/firewareversion_Add";
import {pre_AccountlistLoader} from "../app/ott/account/store/store";
import Account_Table from "../app/ott/account/component/account_Table";
import {Account_Edit} from "../app/ott/account/component/account_Edit";
import {pre_TerminallistLoader} from "../app/ott/terminal/store/store";
import {Account_BulkInsert} from "../app/ott/account/component/account_BulkInsert";
import {Terminal_BulkInsert} from "../app/ott/terminal/component/terminal_BulkInsert";
import {Terminal_Add} from "../app/ott/terminal/component/terminal_Add";
import {pre_AddlistLoader} from "../app/ott/advertisement/store/store";
import {Add_Edit} from "../app/ott/advertisement/component/add_Edit";
import {Add_Add} from "../app/ott/advertisement/component/add_Add";
import {pre_BackgroundlistLoader} from "../app/ott/backgroundImage/store/store";
import {Background_Add} from "../app/ott/backgroundImage/component/background_Add";
import Background_Table from "../app/ott/backgroundImage/component/background_Table";
import {Background_Edit} from "../app/ott/backgroundImage/component/background_Edit";
import {pre_LotlistLoader} from "../app/ott/lot/store/store";
import Lot_Table from "../app/ott/lot/component/lot_Table";
import {Lot_Add} from "../app/ott/lot/component/lot_Add";
import {Lot_Edit} from "../app/ott/lot/component/lot_Edit";
import Event_Table from "../app/tvm/event/component/event_Table";
import {eventlistLoader} from "../app/tvm/event/store/store";
import {Event_Add} from "../app/tvm/event/component/event_Add";
import {Event_Edit} from "../app/tvm/event/component/event_Edit";
import DeskImage_Table from "../app/ott/desktopImage/component/deskImage_Table";
import {pre_TVTerminallistLoader} from "../app/tv/Tvterminal/store/store";
import {TVterminal_Edit} from "../app/tv/Tvterminal/component/TVterminal_Edit";
import {TVterminal_BulkInsert} from "../app/tv/Tvterminal/component/TVterminal_BulkInsert";
import {TVterminal_Add} from "../app/tv/Tvterminal/component/TVterminal_Add";
import {pre_TVAccountlistLoader} from "../app/tv/TVaccount/store/store";
import TVAccount_Table from "../app/tv/TVaccount/component/TVaccount_Table";
import {TVAccount_Edit} from "../app/tv/TVaccount/component/TVaccount_Edit";
import {pre_TVLotlistLoader} from "../app/tv/TVlot/store/store";
import {TVAccount_BulkInsert} from "../app/tv/TVaccount/component/TVaccount_BulkInsert";
import TVLot_Table from "../app/tv/TVlot/component/TVlot_Table";
import {TVLot_Add} from "../app/tv/TVlot/component/TVlot_Add";
import {pre_TVApklistLoader} from "../app/tv/TVapk/store/apk/store";
import TVApk_Table from "../app/tv/TVapk/component/apk/TVapk_Table";
import {TVApk_Add} from "../app/tv/TVapk/component/apk/TVapk_Add";
import {TVApk_Edit} from "../app/tv/TVapk/component/apk/TVapk_Edit";
import {TVApkversion_Add} from "../app/tv/TVapk/component/apkversion/TVapkversion_Add";
import TVApkversion_Table from "../app/tv/TVapk/component/apkversion/TVapkversion_Table";
import {pre_TVFirewarelistLoader} from "../app/tv/TVfireware/store/fireware/store";
import TVFireware_Table from "../app/tv/TVfireware/component/fireware/TVfireware_Table";
import {TVFireware_Add} from "../app/tv/TVfireware/component/fireware/TVfireware_Add";
import TVFirewareversion_Table from "../app/tv/TVfireware/component/firewareversion/TVfirewareversion_Table";
import {TVFirewareversion_Edit} from "../app/tv/TVfireware/component/firewareversion/TVfirewareversion_Edit";
import {TVFirewareversion_Add} from "../app/tv/TVfireware/component/firewareversion/TVfirewareversion_Add";
import {pre_TVAddlistLoader} from "../app/tv/TVadvertisement/store/store";
import TVAdd_Table from "../app/tv/TVadvertisement/component/TVadd_Table";
import {TVAdd_Edit} from "../app/tv/TVadvertisement/component/TVadd_Edit";
import {TVAdd_Add} from "../app/tv/TVadvertisement/component/TVadd_Add";
import {pre_TVBackgroundlistLoader} from "../app/tv/TVbackgroundImage/store/store";
import TVBackground_Table from "../app/tv/TVbackgroundImage/component/TVbackground_Table";
import {TVBackground_Edit} from "../app/tv/TVbackgroundImage/component/TVbackground_Edit";
import {TVBackground_Add} from "../app/tv/TVbackgroundImage/component/TVbackground_Add";
import TVdeskImage_Table from "../app/tv/TVdesktopImage/component/TVdeskImage_Table";
import {TVdeskImage_Add} from "../app/tv/TVdesktopImage/component/TVdeskImage_Add";
import {TVDeskImage_Edit} from "../app/tv/TVdesktopImage/component/TVdeskImage_Edit";
import {pre_AppslistLoader} from "../app/wstore/app/store/app/store";
import Apps_Table from "../app/wstore/app/component/app/app_Table";
import {Apps_Add} from "../app/wstore/app/component/app/app_Add";
import {Apps_Edit} from "../app/wstore/app/component/app/app_Edit";
import Appsversion_Table from "../app/wstore/app/component/appversion/appversion_Table";
import {Appsversion_Add} from "../app/wstore/app/component/appversion/appversion_Add";
import {Appsversion_Edit} from "../app/wstore/app/component/appversion/appversion_Edit";
import Categories_Table from "../app/wstore/categories/component/categories_Table";
import {Categories_Add} from "../app/wstore/categories/component/categories_Add";
import {Categories_Edit} from "../app/wstore/categories/component/categories_Edit";
import Priceplans_Table from "../app/wstore/priceplans/component/priceplans_Table";
import {Priceplans_Add} from "../app/wstore/priceplans/component/priceplans_Add";
import {PricePlans_Edit} from "../app/wstore/priceplans/component/priceplans_Edit";
import Notification_Table from "../app/ott/notification/component/notification_Table";
import {Notification_Add} from "../app/ott/notification/component/notification_Add";
import {Notification_Edit} from "../app/ott/notification/component/notification_Edit";
import TVnotification_Table from "../app/tv/TVnotification/component/TVnotification_Table";
import {TVnotification_Add} from "../app/tv/TVnotification/component/TVnotification_Add";
import {TVnotification_Edit} from "../app/tv/TVnotification/component/TVnotification_Edit";
import First_Table from "../app/tvm/lscategories/component/first/first_Table";
import Second_Table from "../app/tvm/lscategories/component/second/second_Table";
import Third_Table from "../app/tvm/lscategories/component/third/third_Table";
import {AppUser_Add} from "../app/wstore/appUser/component/appUser_Add";
import {AppUser_Edit} from "../app/wstore/appUser/component/appUser_Edit";
import AppUser_Table from "../app/wstore/appUser/component/appUser_Table";
import FailedRecord_Table from "../app/log/faildrecord/component/FaildRecord_Table";
import PortalInfo_Table from "../app/ott/service/component/service_Table";
import {PortalInfo_Edit} from "../app/ott/service/component/service_Edit";
import {PortalInfo_Add} from "../app/ott/service/component/service_Add";
import Domain_Table from "../app/ott/domain/component/domain_Table";
import {Domain_Edit} from "../app/ott/domain/component/domain_Edit";
import {Domain_Add} from "../app/ott/domain/component/domain_Add";
import TVDomain_Table from "../app/tv/TVdomain/component/domain_Table";
import {TVDomain_Edit} from "../app/tv/TVdomain/component/domain_Edit";
import {TVDomain_Add} from "../app/tv/TVdomain/component/domain_Add";
import TVPortalInfo_Table from "../app/tv/TVservice/component/service_Table";
import {TVPortalInfo_Edit} from "../app/tv/TVservice/component/service_Edit";
import {TVPortalInfo_Add} from "../app/tv/TVservice/component/service_Add";
import Domaingroup_Table from "../app/ott/domaingroup/component/domaingroup_Table";
import {Domaingroup_Edit} from "../app/ott/domaingroup/component/domaingroup_Edit";
import {Domaingroup_Add} from "../app/ott/domaingroup/component/domaingroup_Add";
import {pre_ServerGrouplistLoader} from "../app/ott/domaingroup/store/store";
import {TVDomaingroup_Edit} from "../app/tv/TVdomaingroup/component/domaingroup_Edit";
import {TVDomaingroup_Add} from "../app/tv/TVdomaingroup/component/domaingroup_Add";
import TVDomaingroup_Table from "../app/tv/TVdomaingroup/component/domaingroup_Table";
import {pre_TVServerGrouplistLoader} from "../app/tv/TVdomaingroup/store/store";
import {AppUser_BulkInsert} from "../app/wstore/appUser/component/AppUser_BulkInsert";
import Epg_Table from "../app/tvm/epg/component/epg_Table";
import Link_Table from "../app/tvm/lscategories/component/link/link_Table";
import Address_Table from "../app/tvm/address/component/address_Table";
import {Address_Edit} from "../app/tvm/address/component/address_Edit";
import {Address_Add} from "../app/tvm/address/component/address_Add";
import {First_Edit} from "../app/tvm/lscategories/component/first/first_Edit";
import {First_Add} from "../app/tvm/lscategories/component/first/first_Add";
import {Second_Edit} from "../app/tvm/lscategories/component/second/second_Edit";
import {Second_Add} from "../app/tvm/lscategories/component/second/second_Add";
import {Third_Edit} from "../app/tvm/lscategories/component/third/third_Edit";
import {Third_Add} from "../app/tvm/lscategories/component/third/third_Add";
import {pre_MainClasslistLoader} from "../app/tvm/lscategories/store/first/store";
import {pre_SubClasslistLoader} from "../app/tvm/lscategories/store/second/store";
import {Link_Edit} from "../app/tvm/lscategories/component/link/link_Edit";
import {Link_Add} from "../app/tvm/lscategories/component/link/link_Add";
import Agreement_Table from "../app/tsv/agreement/component/agreement_Table";
import {Agreement_Edit} from "../app/tsv/agreement/component/agreement_Edit";
import Option_Table from "../app/tsv/option/component/option_Table";
import Classify_Table from "../app/tsv/classify/component/classify_Table";
import Language_Table from "../app/tsv/language/component/language_Table";
import {pre_RecommendLoader} from "../app/tsv/recommend/store/store";
import Recommend_Table from "../app/tsv/recommend/component/recommend_Table";
import {Recommend_Edit} from "../app/tsv/recommend/component/recommend_Edit";
import {Recommend_Add} from "../app/tsv/recommend/component/recommend_Add";
import {Resource_Add} from "../app/tsv/resource/component/resource_Add";
import {Resource_Edit} from "../app/tsv/resource/component/resource_Edit";
import Resource_Table from "../app/tsv/resource/component/resource_Table";
import Video_Table from "../app/tsv/video/component/video_Table";
import {Video_Edit} from "../app/tsv/video/component/video_Edit";
import {Video_Add} from "../app/tsv/video/component/video_Add";
import {Agreement_Add} from "../app/tsv/agreement/component/agreement_Add";
import {pre_AgreementLoader} from "../app/tsv/agreement/store/store";
import {pre_ClassInfoLoader} from "../app/tsv/option/store/store";
import {pre_ResourceLoader} from "../app/tsv/resource/store/store";
import {pre_VideoLoader} from "../app/tsv/video/store/store";
import VodRepeated_Table from "../app/vod/vodrepeate/component/vodRepeate_Table";
import {pre_VodRepeatedLoader} from "../app/vod/vodrepeate/store/store";
import Playback_Table from "../app/tvm/playback/component/playback_Table";
import ServerConfig_Table from "../app/serverconfig/component/serverconfig_Table";
import {ServerConfig_Edit} from "../app/serverconfig/component/serconfig_Edit";
import {ServerConfig_Add} from "../app/serverconfig/component/serverconfig_Add";
import {pre_NotificationlistLoader} from "../app/tv/TVnotification/store/store";
import {Permission_Add} from "../app/system/permission/Component/permission_Add/permission_Add";
import {pre_ApklistLoader} from "../app/ott/apk/store/apk/store";
import {Apk_Add} from "../app/ott/apk/component/apk/apk_Add";
import {Apkversion_Add} from "../app/ott/apk/component/apkversion/apkversion_Add";
import Apkversion_Table from "../app/ott/apk/component/apkversion/apkversion_Table";
import {Apkversion_Edit} from "../app/ott/apk/component/apkversion/apkversion_Edit";
import Fireware_Table from "../app/ott/fireware/component/fireware/fireware_Table";
import Terminal_Table from "../app/ott/terminal/component/terminal_Table";
import {Terminal_Edit} from "../app/ott/terminal/component/terminal_Edit";
import Add_Table from "../app/ott/advertisement/component/add_Table";
import {DeskImage_Edit} from "../app/ott/desktopImage/component/deskImage_Edit";
import TVterminal_Table from "../app/tv/Tvterminal/component/TVterminal_Table";
import {TVLot_Edit} from "../app/tv/TVlot/component/TVlot_Edit";
import {TVApkversion_Edit} from "../app/tv/TVapk/component/apkversion/TVapkversion_Edit";
import {TVFireware_Edit} from "../app/tv/TVfireware/component/fireware/TVfireware_Edit";
import {Option_Edit} from "../app/tsv/option/component/option_Edit";
import TVnotification_TableFordistributor
	from "../app/z_distributor/tv/notification/component/level2/TVnotification_TableFordistributor";
import {
	TVnotification_EditFordistributor
} from "../app/z_distributor/tv/notification/component/level2/TVnotification_EditFordistributor";
import TVModel_Table from "../app/z_distributor/tv/deskImage/component/level1/TVModel_Table";
import {TVModel_Edit} from "../app/z_distributor/tv/deskImage/component/level1/TVModel_Edit";
import {
	pre_ProvideTemplatelistLoader,
	pre_ProvideTemplatelistLoaderForMarketApk,
	pre_ProvideTemplatelistLoaderForMarketImage,
	pre_ProvideTemplatelistLoaderForNotification,
	pre_ProvideTemplatelistLoaderMovaRecommend,
	pre_ProvideTemplatelistLoaderVod,
} from "../app/z_distributor/tv/deskImage/store/level1/store";
import DeskImageForDistributor_Table
	from "../app/z_distributor/tv/deskImage/component/level2/deskImageForDistributor_Table";
import {
	DeskImageForDistributor_Edit
} from "../app/z_distributor/tv/deskImage/component/level2/deskImageForDistributor_Edit";
import {TVModel_Add} from "../app/z_distributor/tv/deskImage/component/level1/TVModel_Add";
import {
	DeskImageForDistributor_Add
} from "../app/z_distributor/tv/deskImage/component/level2/deskImageForDistributor_Add";
import {pre_AdvertisementPicturelistLoader} from "../app/z_distributor/tv/deskImage/store/level2/store";

import {
	TVnotification_AddFordistributor
} from "../app/z_distributor/tv/notification/component/level2/TVnotification_AddFordistributor";
import TVModelMarketImage_Table from "../app/z_distributor/tv/marketImage/component/level1/TVModelMarketImage_Table";
import {TVModelMarketImage_Edit} from "../app/z_distributor/tv/marketImage/component/level1/TVModelMarketImage_Edit";
import {TVModelMarketImage_Add} from "../app/z_distributor/tv/marketImage/component/level1/TVModelMarketImage_Add";
import TVModelNotification_Table from "../app/z_distributor/tv/notification/component/level1/TVModelNotification_Table";
import {TVModelNotification_Edit} from "../app/z_distributor/tv/notification/component/level1/TVModelNotification_Edit";
import {TVModelNotification_Add} from "../app/z_distributor/tv/notification/component/level1/TVModelNotification_Add";
import {pre_NotificationLoader} from "../app/z_distributor/tv/notification/store/level2/store";
import MarketImageForDistributor_Table
	from "../app/z_distributor/tv/marketImage/component/level2/marketImageForDistributor_Table";

import {
	MarketImageForDistributor_Add
} from "../app/z_distributor/tv/marketImage/component/level2/marketImageForDistributor_Add";
import {
	MarketImageFordistributor_Edit
} from "../app/z_distributor/tv/marketImage/component/level2/marketImageFordistributor_Edit";
import {pre_AppBannerlistLoader, pre_TvApklistLoader,} from "../app/z_distributor/tv/marketImage/store/level2/store";
import {DeskImage_Add} from "../app/ott/desktopImage/component/deskImage_Add";
import TVModelApk_Table from "../app/z_distributor/tv/apk/component/level1/TVModelApk_Table";
import {TVModelApk_Add} from "../app/z_distributor/tv/apk/component/level1/TVModelApk_Add";
import {TVModelApk_Edit} from "../app/z_distributor/tv/apk/component/level1/TVModelApk_Edit";
import TVApk_TableFordistributor from "../app/z_distributor/tv/apk/component/level2/TVApk_TableFordistributor";
import {TVApk_AddFordistributor} from "../app/z_distributor/tv/apk/component/level2/TVApk_AddFordistributor";
import {TVApk_EditFordistributor} from "../app/z_distributor/tv/apk/component/level2/TVApk_EditFordistributor";
import TVapkversion_TableForDistributor
	from "../app/z_distributor/tv/apk/component/level3/TVapkversion_TableForDistributor";
import {
	TVapkversion_AddForDistributor
} from "../app/z_distributor/tv/apk/component/level3/TVapkversion_AddForDistributor";
import {
	TVapkversion_EditForDistributor
} from "../app/z_distributor/tv/apk/component/level3/TVapkversion_EditForDistributor";
import {pre_AppsUserlistLoader} from "../app/wstore/appUser/store/store";
import TVModelRecommendApk_Table
	from "../app/z_distributor/mowo/recommendApk/component/level1/TVModelRecommendApk_Table";
import {
	TVModelRecommendApk_Edit
} from "../app/z_distributor/mowo/recommendApk/component/level1/TVModelRecommendApk_Edit";
import {TVModelRecommendApk_Add} from "../app/z_distributor/mowo/recommendApk/component/level1/TVModelRecommendApk_Add";
import Recommend_TableForDistributor
	from "../app/z_distributor/mowo/recommendApk/component/level2/recommend_TableForDistributor";
import {
	Recommend_EditForDistributor
} from "../app/z_distributor/mowo/recommendApk/component/level2/recommend_EditForDistributor";
import {
	Recommend_AddForDistributor
} from "../app/z_distributor/mowo/recommendApk/component/level2/recommend_AddForDistributor";
import TVModelVideo_Table from "../app/z_distributor/mowo/vodio/component/level1/TVModelVideo_Table";
import {TVModelVideo_Edit} from "../app/z_distributor/mowo/vodio/component/level1/TVModelVideo_Edit";
import {TVModelVideo_Add} from "../app/z_distributor/mowo/vodio/component/level1/TVModelVideo_Add";
import Video_TableForDistributor from "../app/z_distributor/mowo/vodio/component/level2/video_TableForDistributor";
import {Video_EditForDistributor} from "../app/z_distributor/mowo/vodio/component/level2/video_EditForDistributor";
import {Video_AddForDistributor} from "../app/z_distributor/mowo/vodio/component/level2/video_AddForDistributor";
import {pre_RecommendForDistributorLoader} from "../app/z_distributor/mowo/recommendApk/store/level2/store";
import {pre_VideoLoaderFordistributor} from "../app/z_distributor/mowo/vodio/store/level2/store";
import Vodfirst_Table from "../app/vod/lscategories/component/first/Vodfirst_Table";
import {Vodfirst_Edit} from "../app/vod/lscategories/component/first/Vodfirst_Edit";
import {Vodfirst_Add} from "../app/vod/lscategories/component/first/Vodfirst_Add";
import {pre_VodClasslistLoader} from "../app/vod/lscategories/store/first/store";
import Vodsecond_Table from "../app/vod/lscategories/component/second/Vodsecond_Table";
import {Vodsecond_Add} from "../app/vod/lscategories/component/second/Vodsecond_Add";
import CategoryVideo_Table from "../app/z_distributor/mowo/vodio/component/level1-2/CategoryVideo_Table";
import ClassRecommendApk_Table from "../app/z_distributor/mowo/recommendApk/component/level1-1/ClassRecommendApk_Table";
import VodVodLink_Table from "../app/vod/lscategories/component/link/Vodlink_Table";
import {VodVodLink_Edit} from "../app/vod/lscategories/component/link/Vodlink_Edit";
import {VodVodLink_Add} from "../app/vod/lscategories/component/link/Vodlink_Add";
import ApkCategory_Table from "../app/ott/categories/component/categories_Table";
import {ApkCategory_Add} from "../app/ott/categories/component/categories_Add";
import {ApkCategory_Edit} from "../app/ott/categories/component/categories_Edit";
import DistributorDetail_Table from "../app/ott/distributor/component/DistributorDetail_Table";
import {DistributorDetail_Add} from "../app/ott/distributor/component/DistributorDetail_Add";
import {DistributorDetail_Edit} from "../app/ott/distributor/component/DistributorDetail_Edit";
import {pre_DistributorDetaillistLoader} from "../app/ott/distributor/store/store";
import RecommendApk_Table from "../app/ott/recommendApk/component/recommendApk_Table";
import {RecommendApk_Edit} from "../app/ott/recommendApk/component/recommendApk_Edit";
import {RecommendApk_Add} from "../app/ott/recommendApk/component/recommendApk_Add";
import TVModelVodAccount_Table from "../app/z_distributor/vodAccount/component/level1/TVModelVodAccount_Table";
import {TVModelVodAccount_Add} from "../app/z_distributor/vodAccount/component/level1/TVModelVodAccount_Add";
import {
    pre_Top10ManagerForDistributorLoader,
} from "../app/z_distributor/vodAccount/store/level1/store";
import {TVModelVodAccount_Edit} from "../app/z_distributor/vodAccount/component/level1/TVModelVodAccount_Edit";
import Vodfirst_TableForDistributor
	from "../app/z_distributor/vodAccount/component/level1-1/Vodfirst_TableForDistributor";
import VodsecondForDistributor_Table
    from "../app/z_distributor/vodAccount/component/level2/vodsecondForDistributor_Table";
import {pre_ApkCategorylistLoader} from "../app/ott/categories/store/store";
import {
    Vodsecond_AddForDistributor
} from "../app/z_distributor/vodAccount/component/level2/vodsecond_AddForDistributor";
import {
    Vodsecond_EditForDistributor
} from "../app/z_distributor/vodAccount/component/level2/vodsecond_EditForDistributor";
import VodLinkLinkForDistributor_Table
    from "../app/z_distributor/vodAccount/component/level3/vodLinkForDistributor_Table";

import {
    VodLinkLinkDistributor_AddForDistributor
} from "../app/z_distributor/vodAccount/component/level3/vodLink_AddForDistributor";
import {
    VodLinkLinkDistributor_EditForDistributor
} from "../app/z_distributor/vodAccount/component/level3/vodLink_EditForDistributor";
import MacApk_Table from "../app/log/faildrecord/component/MacApk_Table";
import MacDevice_Table from "../app/log/faildrecord/component/MacDevice_Table";
import ClassVideo_Table from "../app/z_distributor/mowo/vodio/component/level1-1/ClassVideo_Table";
import {Vodsecond_Edit} from "../app/vod/lscategories/component/second/Vodsecond_Edit";
import {pre_MacApklistLoader} from "../app/log/faildrecord/store/macapk/store";
import {pre_MacDevicelistLoader} from "../app/log/faildrecord/store/macdevice/store";
import NewLayout from "./layout/newlayout";
import DauBar from "../app/echart/component/daubar";
import {pre_ChartFilterLoader} from "../app/echart/store/store";
import MacAuthRecord_Table from "../app/log/faildrecord/component/MacAuthRecord_Table";
import {pre_DesktopImagelistLoader} from "../app/ott/desktopImage/store/store";
import {pre_TVDesktopImagelistLoader} from "../app/tv/TVdesktopImage/store/store";
import MacCity_Table from "../app/log/faildrecord/component/MacCity_Table";
import ModelMarketImage_Table from "../app/z_distributor/ott/marketImage/component/level1/ModelMarketImage_Table";
import {ModelMarketImage_Edit} from "../app/z_distributor/ott/marketImage/component/level1/ModelMarketImage_Edit";
import {ModelMarketImage_Add} from "../app/z_distributor/ott/marketImage/component/level1/ModelMarketImage_Add";
import MarketOTTImageForDistributor_Table
    from "../app/z_distributor/ott/marketImage/component/level2/marketOTTImageForDistributor_Table";
import {
    MarketOTTImageFordistributor_Edit
} from "../app/z_distributor/ott/marketImage/component/level2/marketOTTImageFordistributor_Edit";
import {
    MarketOTTImageForDistributor_Add
} from "../app/z_distributor/ott/marketImage/component/level2/marketOTTImageForDistributor_Add";
import {pre_ProvideTemplatelistLoaderForOTTMarketImage} from "../app/z_distributor/ott/marketImage/store/level1/store";
import {pre_OTTAppBannerlistLoader} from "../app/z_distributor/ott/marketImage/store/level2/store";
import MowoClass_Table from "../app/vod/mowo3/component/first/MowoClass_Table";
import {pre_MowoClasslistLoader} from "../app/vod/mowo3/store/first/store";
import {MowoClass_Edit} from "../app/vod/mowo3/component/first/MowoClass_Edit";
import {MowoClass_Add} from "../app/vod/mowo3/component/first/MowoClass_Add";
import {pre_ClassDatalistLoader} from "../app/vod/mowo3/store/second/store";
import ClassList_Table from "../app/vod/mowo3/component/second/ClassList_Table";
import {ClassList_Edit} from "../app/vod/mowo3/component/second/ClassList_Edit";
import {ClassList_Add} from "../app/vod/mowo3/component/second/ClassList_Add";
import ClassResource_Table from "../app/vod/mowo3/component/link/ClassResource_Table";
import {ClassResource_Edit} from "../app/vod/mowo3/component/link/ClassResource_Edit";
import {ClassResource_Add} from "../app/vod/mowo3/component/link/ClassResource_Add";
import {Vodbanner_Edit} from "../app/vod/lscategories/component/vodbanner/Vodbanner_Edit";
import {Vodbanner_Add} from "../app/vod/lscategories/component/vodbanner/Vodbanner_Add";
import Vodbannner_Table from "../app/vod/lscategories/component/vodbanner/Vodbannner_Table";
import Typesecond_Table from "../app/vod/lscategories/component/secondType/Typesecond_Table";
import {Typesecond_Edit} from "../app/vod/lscategories/component/secondType/Typesecond_Edit";
import {Typesecond_Add} from "../app/vod/lscategories/component/secondType/Typesecond_Add";
import TypeItem_Table from "../app/vod/lscategories/component/thirdType/TypeItem_Table";
import {TypeItem_Edit, VodTypeItem_Edit} from "../app/vod/lscategories/component/thirdType/TypeItem_Edit";
import {TypeItem_Add} from "../app/vod/lscategories/component/thirdType/TypeItem_Add";
import First_Table2 from "../app/tvm/lscategories/component2/first/first_Table";
import Third_Table2 from "../app/tvm/lscategories/component2/second/third_Table";
import Link_Table2 from "../app/tvm/lscategories/component2/link/link_Table";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <NewLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                path: "/index",
                loader:pre_ChartFilterLoader,
                element: <DauBar/>,
            },
            {
                path: "/permissionTree/:menuId",
                loader: permissionProxyLoader,
                element: <Permission_Tree/>,
            },
            {
                path: "/permissionAdd/:menuId",
                loader: permissionProxyLoader,
                element: <Permission_Add/>,
            },
            {
                path: "/permissionEdit/:menuId",
                loader: permissionProxyLoader,
                element: <Permission_Edit/>,
            },
            // system/user
            {
                path: "/userTable/:menuId",
                loader: UserProxyLoder,
                element: <User_Table/>,
            },
            {
                path: "/userEdit/:menuId",
                element: <User_Edit/>,
            },
            // system/role
            {
                path: "/roleTable/:menuId",
                loader: permissionProxyLoader,
                element: <Role_Table/>,
            },
            //     查看分销商 pre_DistributorlistLoader
            {
                path: "/distributorTable/:menuId",
                loader: pre_DistributorlistLoader,
                element: <Distributor_Table/>,
            },
            //     查看型号
            {
                path: "/modelTable/:menuId",
                loader: pre_ModellistLoader,
                element: <Model_Table/>,
            },
            //  xc资源
            {
                path: "/XstreamTable/:menuId",
                loader: pre_XStreamlistLoader,
                element: <Xcmapping_Table/>,
            },
            {
                path: "/XstreamEdit/:menuId",
                loader: pre_XStreamlistLoader,
                element: <Xcmapping_Edit/>,
            },
            {
                path: "/XstreamAdd/:menuId",
                loader: pre_XStreamlistLoader,
                element: <Xcmapping_Add/>,
            },
            // 套餐组合
            //  xc资源
            {
                path: "/XcombinationTable/:menuId",
                loader: pre_XCombolistLoader,
                element: <Xcombination_Table/>,
            },
            {
                path: "/XcombinationEdit/:menuId",
                loader: pre_XCombolistLoader,
                element: <Xcombination_Edit/>,
            },
            {
                path: "/XcombinationAdd/:menuId",
                loader: pre_XCombolistLoader,
                element: <Xcombination_Add/>,
            },
            // 用户资源
            {
                path: "/Xcaccountable/:menuId",
                loader: pre_XCombolistLoader,
                element: <Xcaccount_Table/>,
            },
            {
                path: "/Xcaccountadd/:menuId",
                loader: pre_XCAccountLoader,
                element: <Xcaccount_Add/>,
            },
            {
                path: "/Xcaccountedit/:menuId",
                loader: pre_XCAccountLoader,
                element: <Xcaccount_Edit/>,
            },
            {
                path: "/xcaccountBulkInsert/:menuId",
                loader: pre_XCAccountLoader,
                element: <Xcaccount_BulkInsert/>,
            },
            // ****************************************************************************************
            // ----------------------------盒子业务-----------------------------------------------------

            // apk
            {
                path: "/apkTable/:menuId",
                loader: pre_ApklistLoader,
                element: <Apk_Table/>,
            },
            {
                path: "/apkAdd/:menuId",
                loader: pre_ApklistLoader,
                element: <Apk_Add/>,
            },
            {
                path: "/apkEdit/:menuId/:apkId",
                loader: pre_ApklistLoader,
                element: <Apk_Edit/>,
            },
            //apkversion
            {
                path: "/apkversionAdd/:id/:modelName",
                element: <Apkversion_Add/>,
            },
            {
                path: "/apkversionTable/:menuId/:id",
                element: <Apkversion_Table/>,
            },
            {
                path: "/apkversionEdit/:menuId/:id",
                element: <Apkversion_Edit/>,
            },
            // firmware
            {
                path: "/firmwareTable/:menuId",
                loader: pre_FirewarelistLoader,
                element: <Fireware_Table/>,
            },
            {
                path: "/firmwareEdit/:menuId/:id",
                element: <Fireware_Edit/>,
            },
            {
                path: "/firmwareAdd/:menuId",
                element: <Fireware_Add/>,
            },
            // firmwareversion

            {
                path: "/firmwareversionTable/:menuId/:id",
                element: <Firewareversion_Table/>,
            },
            {
                path: "/firmwareversionEdit/:menuId/:id",
                element: <Firewareversion_Edit/>,
            },
            {
                path: "/firmwareversionAdd/:id/:modelName",
                element: <Firewareversion_Add/>,
            },
            //用户管理
            {
                path: "/accountTable/:menuId",
                loader: pre_AccountlistLoader,
                element: <Account_Table/>,
            },
            {
                path: "/accountEdit/:menuId",
                element: <Account_Edit/>,
            },
            {
                path: "/accountBulkInsert/:menuId",
                loader: pre_TerminallistLoader,
                element: <Account_BulkInsert/>,
            },
            // 盒子管理
            {
                path: "/terminalTable/:menuId",
                loader: pre_TerminallistLoader,
                element: <Terminal_Table/>,
            },
            {
                path: "/terminalEdit/:menuId",
                element: <Terminal_Edit/>,
            },
            {
                path: "/terminalBulkInsert/:menuId",
                loader: pre_TerminallistLoader,
                element: <Terminal_BulkInsert/>,
            },
            {
                path: "/terminalAdd/:menuId",
                loader: pre_TerminallistLoader,
                element: <Terminal_Add/>,
            },
            //     广告视频管理
            {
                path: "/addTable/:menuId",
                loader: pre_AddlistLoader,
                element: <Add_Table/>,
            },
            {
                path: "/addEdit/:menuId",
                loader: pre_AddlistLoader,
                element: <Add_Edit/>,
            },
            {
                path: "/addAdd/:menuId",
                loader: pre_AddlistLoader,
                element: <Add_Add/>,
            },
            // 背景图片
            {
                path: "/addBackground/:menuId",
                loader: pre_BackgroundlistLoader,
                element: <Background_Add/>,
            },
            {
                path: "/backgroundTable/:menuId",
                element: <Background_Table/>,
            },
            {
                path: "/backgroundEdit/:menuId",
                element: <Background_Edit/>,
            },
            // 消息通知
            {
                path: "/notificationTable/:menuId",
                element: <Notification_Table/>,
            },
            {
                path: "/notification_Edit/:menuId",
                element: <Notification_Edit/>,
            },
            {
                path: "/notification_Add/:menuId",
                loader: pre_BackgroundlistLoader,
                element: <Notification_Add/>,
            },

            // 批次
            {
                path: "/lotTable/:menuId",
                loader: pre_LotlistLoader,
                element: <Lot_Table/>,
            },
            {
                path: "/Lot_Add/:menuId",
                loader: pre_LotlistLoader,
                element: <Lot_Add/>,
            },
            {
                path: "/Lot_Edit/:menuId",
                loader: pre_LotlistLoader,
                element: <Lot_Edit/>,
            },
            //  tvm/预告管理
            {
                path: "/epg_table/:menuId",
                element: <Epg_Table/>,
            },

            //  tvm/赛事
            {
                path: "/event_table/:menuId",
                element: <Event_Table/>,
            },
            {
                path: "/event_add/:menuId",
                loader: eventlistLoader,
                element: <Event_Add/>,
            },
            {
                path: "/event_edit/:menuId",
                element: <Event_Edit/>,
            },
            // tvm/直播一级分类列表
            {
                path: "/first_table/:menuId",
                loader: pre_MainClasslistLoader,
                element: <First_Table/>,
            },
            {
                path: "/first_edit/:menuId",
                element: <First_Edit/>,
            },
            {
                path: "/first_Add/:menuId",
                element: <First_Add/>,
            },
            // tvm/直播二级分类列表
            {
                path: "/second_table/:menuId/:id",
                loader: pre_SubClasslistLoader,
                element: <Second_Table/>,
            },
            {
                path: "/second_edit/:menuId",
                element: <Second_Edit/>,
            },
            {
                path: "/second_add/:id",
                element: <Second_Add/>,
            },
            // 三级分类
            {
                path: "/showlink_table/:menuId/:id/:mid/:fid",
                element: <Link_Table/>,
            },
            {
                path: "/third_table/:menuId/:id/:mid/",
                element: <Third_Table/>,
            },
            {
                path: "/third_edit/:menuId/:id/:mid/:fid",
                element: <Third_Edit/>,
            },
            {
                path: "/third_add/:menuId/:mid/:fid",
                element: <Third_Add/>,
            },
            // 直播分类仅供运维查看
            {
                path: "/first_table2/:menuId",
                loader: pre_MainClasslistLoader,
                element: <First_Table2/>,
            },
            // {
            //     path: "/first_edit/:menuId",
            //     element: <First_Edit/>,
            // },
            // {
            //     path: "/first_Add/:menuId",
            //     element: <First_Add/>,
            // },
            // tvm/直播二级分类列表
            // 三级分类
            {
                path: "/third_table2/:menuId/:id/:mid/:All",
                element: <Third_Table2/>,
            },
            // {
            //     path: "/third_edit/:menuId/:id/:mid/:fid",
            //     element: <Third_Edit/>,
            // },
            // {
            //     path: "/third_add/:menuId/:mid/:fid",
            //     element: <Third_Add/>,
            // },
            {
                path: "/showlink_table2/:menuId/:id/:mid/:fid/:isAll",
                element: <Link_Table2/>,
            },

            // 直播分类仅供运维查看

            // 直播
            // 频道链接
            {
                path: "/showlink_table/:menuId/:id/:mid/:fid",
                element: <Link_Table/>,
            },
            {
                path: "/link_edit/:menuId",
                element: <Link_Edit/>,
            },
            {
                path: "/link_add/:menuId/:mid/:fid/:channerId",
                element: <Link_Add/>,
            },
            // 桌面图片
            {
                path: "/desktopic_table/:menuId",

                element: <DeskImage_Table/>,
            },
            {
                path: "/addDeskImage/:menuId",
                loader:pre_DesktopImagelistLoader,
                element: <DeskImage_Add/>,
            },
            {
                path: "/editDeskImage/:menuId",
                loader: pre_BackgroundlistLoader,
                element: <DeskImage_Edit/>,
            },
            // ----------------------------盒子业务-----------------------------------------------------
            //     ----------------------------电视机业务-------------------------------------------------
            // 电视机盒子管理
            {
                path: "/TVterminalTable/:menuId",
                loader: pre_TVTerminallistLoader,
                element: <TVterminal_Table/>,
            },
            {
                path: "/TVterminalEdit/:menuId",
                element: <TVterminal_Edit/>,
            },
            {
                path: "/TVterminalBulkInsert/:menuId",
                loader: pre_TVTerminallistLoader,
                element: <TVterminal_BulkInsert/>,
            },
            {
                path: "/TVterminalAdd/:menuId",
                loader: pre_TVTerminallistLoader,
                element: <TVterminal_Add/>,
            },
            //     电视机用户管理
            //用户管理
            {
                path: "/TVaccountTable/:menuId",
                loader: pre_TVAccountlistLoader,
                element: <TVAccount_Table/>,
            },
            {
                path: "/TVaccountEdit/:menuId",
                element: <TVAccount_Edit/>,
            },
            {
                path: "/TVaccountBulkInsert/:menuId",
                loader: pre_TVAccountlistLoader,
                element: <TVAccount_BulkInsert/>,
            },
            //     电视机批次
            {
                path: "/TVlotTable/:menuId",
                loader: pre_TVLotlistLoader,
                element: <TVLot_Table/>,
            },
            {
                path: "/TVlot_Add/:menuId",
                loader: pre_TVLotlistLoader,
                element: <TVLot_Add/>,
            },
            {
                path: "/TVlot_Edit/:menuId",
                loader: pre_TVLotlistLoader,
                element: <TVLot_Edit/>,
            },
            // 电视Apk
            // tvapk
            {
                path: "/tvapkTable/:menuId",
                loader: pre_TVApklistLoader,
                element: <TVApk_Table/>,
            },
            {
                path: "/tvapkAdd/:menuId",
                loader: pre_TVApklistLoader,
                element: <TVApk_Add/>,
            },
            {
                path: "/tvapkEdit/:menuId/:apkId",
                loader: pre_TVApklistLoader,
                element: <TVApk_Edit/>,
            },
            //tvapkversion
            {
                path: "/tvapkversionAdd/:id/:modelName",
                element: <TVApkversion_Add/>,
            },
            {
                path: "/tvapkversionTable/:menuId/:id",
                element: <TVApkversion_Table/>,
            },
            {
                path: "/tvapkversionEdit/:menuId/:id",
                element: <TVApkversion_Edit/>,
            },
            // 消息通知
            {
                path: "/tvnotificationTable/:menuId",
                element: <TVnotification_Table/>,
            },
            {
                path: "/tvnotification_Edit/:menuId",
                element: <TVnotification_Edit/>,
            },
            // 客户专用消息通知
            {
                path: "/tvnotificationTableDis/:menuId",
                element: <TVnotification_TableFordistributor/>,
            },
            {
                path: "/tvnotificationEditDis/:menuId",
                loader: pre_NotificationlistLoader,
                element: <TVnotification_EditFordistributor/>,
            },
            {
                path: "/tvnotification_Add/:menuId",
                loader: pre_BackgroundlistLoader,
                element: <TVnotification_Add/>,
            },
            // 电视固件
            // firmware
            {
                path: "/tvfirmwareTable/:menuId",
                loader: pre_TVFirewarelistLoader,
                element: <TVFireware_Table/>,
            },
            {
                path: "/tvfirmwareEdit/:menuId/:id",
                element: <TVFireware_Edit/>,
            },
            {
                path: "/tvfirmwareAdd/:menuId",
                element: <TVFireware_Add/>,
            },
            // firmwareversion
            {
                path: "/tvfirmwareversionTable/:menuId/:id",
                element: <TVFirewareversion_Table/>,
            },
            {
                path: "/tvfirmwareversionEdit/:menuId/:id",
                element: <TVFirewareversion_Edit/>,
            },
            {
                path: "/tvfirmwareversionAdd/:id/:modelName",
                element: <TVFirewareversion_Add/>,
            },
            //     电视广告视频管理
            {
                path: "/addTVTable/:menuId",
                loader: pre_TVAddlistLoader,
                element: <TVAdd_Table/>,
            },
            {
                path: "/addTVEdit/:menuId",
                loader: pre_TVAddlistLoader,
                element: <TVAdd_Edit/>,
            },
            {
                path: "/addTVAdd/:menuId",
                loader: pre_TVAddlistLoader,
                element: <TVAdd_Add/>,
            },
            // 电视背景图片
            {
                path: "/addtvBackground/:menuId",
                loader: pre_TVBackgroundlistLoader,
                element: <TVBackground_Add/>,
            },
            {
                path: "/tvbackgroundTable/:menuId",
                element: <TVBackground_Table/>,
            },
            {
                path: "/tvbackgroundEdit/:menuId",
                element: <TVBackground_Edit/>,
            },
            //     电视桌面
            // 桌面图片
            {
                path: "/tvdesktopic_table/:menuId",

                element: <TVdeskImage_Table/>,
            },
            {
                path: "/tvaddDeskImage/:menuId",
                loader: pre_TVDesktopImagelistLoader,
                element: <TVdeskImage_Add/>,
            },
            {
                path: "/tveditDeskImage/:menuId",
                loader: pre_TVDesktopImagelistLoader,
                element: <TVDeskImage_Edit/>,
            },
            //     wst
            // app
            {
                path: "/apps_table/:menuId",
                loader: pre_AppslistLoader,
                element: <Apps_Table/>,
            },
            {
                path: "/apps_add/:menuId",
                loader: pre_AppslistLoader,
                element: <Apps_Add/>,
            },
            {
                path: "/apps_edit/:menuId/:appId",
                loader: pre_AppslistLoader,
                element: <Apps_Edit/>,
            },
            // appversion
            {
                path: "/appsversion_table/:menuId/:id/:classX",
                loader: pre_AppslistLoader,
                element: <Appsversion_Table/>,
            },
            {
                path: "/appversionAdd/:id/:modelName/:classX",
                element: <Appsversion_Add/>,
            },
            {
                path: "/appversionEdit/:menuId/:id",
                element: <Appsversion_Edit/>,
            },
            // categories
            {
                path: "/categories_table/:menuId",
                element: <Categories_Table/>,
            },
            {
                path: "/categories_add/:menuId",
                element: <Categories_Add/>,
            },
            {
                path: "/categories_edit/:menuId",
                element: <Categories_Edit/>,
            },
            // priceplans
            {
                path: "/priceplans_table/:menuId",
                element: <Priceplans_Table/>,
            },
            {
                path: "/priceplans_add/:menuId",
                element: <Priceplans_Add/>,
            },
            {
                path: "/priceplans_edit/:menuId",
                element: <PricePlans_Edit/>,
            },
            // AppUser
            {
                path: "/appUser_Table/:menuId",
                loader: pre_AppsUserlistLoader,
                element: <AppUser_Table/>,
            },
            {
                path: "/appUser_Add/:menuId",
                element: <AppUser_Add/>,
            },
            {
                path: "/appUser_Edit/:menuId",
                element: <AppUser_Edit/>,
            },
            {
                path: "/AppUserBulkInsert/:menuId",
                element: <AppUser_BulkInsert/>,
            },
            // 错误记录
            {
                path: "/macApk_table/:menuId",
                loader:pre_MacApklistLoader,
                element: <MacApk_Table/>,
            },
            {
                path: "/macDevice_table/:menuId",
                loader:pre_MacDevicelistLoader,
                element: <MacDevice_Table/>,
            },
            {
                path: "/falidRecord_table/:menuId",
                element: <FailedRecord_Table/>,
            },
            {
                path: "/macCity_table/:menuId",
                element: <MacCity_Table/>,
            },
            {
                path: "/authmacrecords/:menuId",
                element: <MacAuthRecord_Table/>,
            },
            // 域名
            {
                path: "/domainTable/:menuId",
                element: <Domain_Table/>,
            },
            {
                path: "/domain_Edit/:menuId",
                element: <Domain_Edit/>,
            },
            {
                path: "/domain_Add/:menuId",
                element: <Domain_Add/>,
            },
            // 域名分组
            {
                path: "/domaingroup_Table/:menuId",
                loader: pre_ServerGrouplistLoader,
                element: <Domaingroup_Table/>,
            },
            {
                path: "/domaingroup_Edit/:menuId",
                element: <Domaingroup_Edit/>,
            },
            {
                path: "/domaingroup_Add/:menuId",
                loader: pre_ServerGrouplistLoader,
                element: <Domaingroup_Add/>,
            },
            // 服务
            {
                path: "/PortalInfo_Table/:menuId",
                element: <PortalInfo_Table/>,
            },
            {
                path: "/PortalInfo_Edit/:menuId",
                element: <PortalInfo_Edit/>,
            },
            {
                path: "/PortalInfo_Add/:menuId",
                element: <PortalInfo_Add/>,
            },
            // 电视域名
            {
                path: "/tvdomainTable/:menuId",
                element: <TVDomain_Table/>,
            },
            {
                path: "/tvdomain_Edit/:menuId",
                element: <TVDomain_Edit/>,
            },
            {
                path: "/tvdomain_Add/:menuId",
                element: <TVDomain_Add/>,
            },
            // 电视域名分组
            {
                path: "/tvdomaingroup_Table/:menuId",
                loader: pre_TVServerGrouplistLoader,
                element: <TVDomaingroup_Table/>,
            },
            {
                path: "/tvdomaingroup_Edit/:menuId",
                element: <TVDomaingroup_Edit/>,
            },
            {
                path: "/tvdomaingroup_Add/:menuId",
                loader: pre_TVServerGrouplistLoader,
                element: <TVDomaingroup_Add/>,
            },
            // 电视服务
            {
                path: "/TVPortalInfoTable/:menuId",
                element: <TVPortalInfo_Table/>,
            },
            {
                path: "/TVPortalInfo_Edit/:menuId",
                element: <TVPortalInfo_Edit/>,
            },
            {
                path: "/TVPortalInfo_Add/:menuId",
                loader: pre_BackgroundlistLoader,
                element: <TVPortalInfo_Add/>,
            },
            //     地址管理
            {
                path: "/addressTable/:menuId",
                element: <Address_Table/>,
            },
            {
                path: "/addressEdit/:menuId",
                element: <Address_Edit/>,
            },
            {
                path: "/addressAdd/:menuId",
                element: <Address_Add/>,
            },
            //     tsv
            //     协议管理
            //     查看协议
            {
                path: "/agreementTable/:menuId",
                loader: pre_AgreementLoader,
                element: <Agreement_Table/>,
            },
            // 编辑协议
            {
                path: "/agreementEdit/:menuId",
                element: <Agreement_Edit/>,
            },
            // 新增协议
            {
                path: "/agreementAdd/:menuId",
                loader: pre_AgreementLoader,
                element: <Agreement_Add/>,
            },
            //     查看选项
            {
                path: "/optionTable/:menuId",
                loader: pre_ClassInfoLoader,
                element: <Option_Table/>,
            },
            // 编辑选项
            {
                path: "/optionEdit/:menuId",
                element: <Option_Edit/>,
            },
            // 查看选项分类
            {
                path: "/classifyTable/:menuId/:classId",
                element: <Classify_Table/>,
            },
            //     查看地区语言
            {
                path: "/region_Table/:menuId",
                element: <Language_Table/>,
            },
            // 查看APK推荐
            {
                path: "/apkRecommendTable/:menuId",
                loader: pre_RecommendLoader,
                element: <Recommend_Table/>,
            },
            // 编辑APK推荐
            {
                path: "/apkRecommendEdit/:menuId",
                element: <Recommend_Edit/>,
            },
            // 新增APK推荐
            {
                path: "/apkRecommendAdd/:menuId",
                loader: pre_RecommendLoader,
                element: <Recommend_Add/>,
            },
            // 查看配置
            {
                path: "/resourceTable/:menuId",
                loader: pre_ResourceLoader,
                element: <Resource_Table/>,
            },
            // 编辑配置
            {
                path: "/resourceEdit/:menuId",
                loader: pre_ResourceLoader,
                element: <Resource_Edit/>,
            },
            // 新增配置
            {
                path: "/resourceAdd/:menuId",
                loader: pre_ResourceLoader,
                element: <Resource_Add/>,
            },
            // 查看点播视频
            {
                path: "/videoTable/:menuId",
                loader: pre_VideoLoader,
                element: <Video_Table/>,
            },
            // 编辑点播视频
            {
                path: "/videoEdit/:menuId",
                element: <Video_Edit/>,
            },
            // 新增点播视频
            {
                path: "/videoAdd/:menuId",
                loader: pre_VideoLoader,
                element: <Video_Add/>,
            },
            // 点播
            {
                path: "/vodrepeateTable/:menuId",
                loader: pre_VodRepeatedLoader,
                element: <VodRepeated_Table/>,
            },
            //     回放管理
            // 查看点播视频
            {
                path: "/playbackTable/:menuId",
                // loader: pre_VideoLoader,
                element: <Playback_Table/>,
            },
            // 编辑点播视频
            {
                path: "/playbackEdit/:menuId",
                element: <Video_Edit/>,
            },
            // 新增点播视频
            {
                path: "/playbackAdd/:menuId",
                loader: pre_VideoLoader,
                element: <Video_Add/>,
            },
            //     地址管理
            {
                path: "/serverconfigTable/:menuId",
                // loader: pre_VideoLoader,
                element: <ServerConfig_Table/>,
            },
            // 编辑点播视频
            {
                path: "/serverconfigEdit/:menuId",
                element: <ServerConfig_Edit/>,
            },
            // 新增点播视频
            {
                path: "/serverconfigAdd/:menuId",
                // loader: pre_VideoLoader,
                element: <ServerConfig_Add/>,
            },
            //     分销商使用
            //     电视机 查看桌面背景图片
            // 一级查看
            {
                path: "/tvdeskImageModelTable/:menuId",
                loader: pre_ProvideTemplatelistLoader,
                element: <TVModel_Table/>,
            },
            // 一级编辑
            {
                path: "/tvdeskImageModelEdit/:menuId",
                element: <TVModel_Edit/>,
            },
            {
                path: "/tvdeskImageModelAdd/:menuId",
                element: <TVModel_Add/>,
            },
            //     二级
            {
                path: "/tvdeskImagesubtable/:menuId",
                loader: pre_AdvertisementPicturelistLoader,
                element: <DeskImageForDistributor_Table/>,
            },

            {
                path: "/tvdeskImagesubedit/:menuId",
                element: <DeskImageForDistributor_Edit/>,
            },
            {
                path: "/tvdeskImagesubadd/:menuId",
                element: <DeskImageForDistributor_Add/>,
            },
            //     查看消息通知
            //     电视机 查看消息
            // 一级查看
            {
                path: "/tvnotificationModelTable/:menuId",
                loader: pre_ProvideTemplatelistLoaderForNotification,
                element: <TVModelNotification_Table/>,
            },
            // 一级编辑
            {
                path: "/tvnotificationModelEdit/:menuId",
                element: <TVModelNotification_Edit/>,
            },
            {
                path: "/tvnotificationModelAdd/:menuId",
                element: <TVModelNotification_Add/>,
            },
            // 二级
            {
                path: "/tvnotificationsubtable/:menuId",
                loader: pre_NotificationLoader,
                element: <TVnotification_TableFordistributor/>,
            },

            {
                path: "/tvnotificationsubedit/:menuId",
                element: <TVnotification_EditFordistributor/>,
            },
            {
                path: "/tvnotificationsubadd/:menuId",
                element: <TVnotification_AddFordistributor/>,
            },
            //     查看市场广告
            //     电视机 查看市场广告
            // 一级查看
            {
                path: "/tvmarketImageModelTable/:menuId",
                loader: pre_ProvideTemplatelistLoaderForMarketImage,
                element: <TVModelMarketImage_Table/>,
            },
            // 一级编辑
            {
                path: "/tvmarketImageModelEdit/:menuId",
                element: <TVModelMarketImage_Edit/>,
            },
            {
                path: "/tvmarketImageModelAdd/:menuId",
                element: <TVModelMarketImage_Add/>,
            },
            //     // 二级
            {
                path: "/tvmarketImagesubtable/:menuId",
                loader: pre_AppBannerlistLoader,
                element: <MarketImageForDistributor_Table/>,
            },
            //
            {
                path: "/tvmarketImagesubedit/:menuId",
                element: <MarketImageFordistributor_Edit/>,
            },
            {
                path: "/tvmarketImagesubadd/:menuId",
                element: <MarketImageForDistributor_Add/>,
            },

            // 盒子查看市场广告
            {
                path: "/marketImageModelTable/:menuId",
                loader: pre_ProvideTemplatelistLoaderForOTTMarketImage,
                element: <ModelMarketImage_Table/>,
            },
            // 一级编辑
            {
                path: "/marketImageModelEdit/:menuId",
                element: <ModelMarketImage_Edit/>,
            },
            {
                path: "/marketImageModelAdd/:menuId",
                element: <ModelMarketImage_Add/>,
            },
            //     // 二级
            {
                path: "/marketImagesubtable/:menuId",
                loader: pre_OTTAppBannerlistLoader,
                element: <MarketOTTImageForDistributor_Table/>,
            },
            //
            {
                path: "/marketImagesubedit/:menuId",
                loader: pre_OTTAppBannerlistLoader,
                element: <MarketOTTImageFordistributor_Edit/>,
            },
            {
                path: "/marketImagesubadd/:menuId",
                element: <MarketOTTImageForDistributor_Add/>,
            },
            // 盒子查看市场广告
            // 	apk
            //     查看市场广告
            //     电视机 查看市场Apk
            // 一级查看
            {
                path: "/tvmarketApkModelTable/:menuId",
                loader: pre_ProvideTemplatelistLoaderForMarketApk,
                element: <TVModelApk_Table/>,
            },
            // 一级编辑
            {
                path: "/tvmarketApkModelEdit/:menuId",
                element: <TVModelApk_Edit/>,
            },
            {
                path: "/tvmarketApkModelAdd/:menuId",
                element: <TVModelApk_Add/>,
            },
            //     // 二级
            {
                path: "/tvmarketApksubtable/:menuId",
                loader: pre_TvApklistLoader,
                element: <TVApk_TableFordistributor/>,
            },
            {
                path: "/tvmarketApksubedit/:menuId",
                element: <TVApk_EditFordistributor/>,
            },
            {
                path: "/tvmarketApksubadd/:menuId",
                element: <TVApk_AddFordistributor/>,
            },
            //     // 三级
            {
                path: "/tvmarketApkversionsubtable/:menuId/:apkId",
                loader: pre_TvApklistLoader,
                element: <TVapkversion_TableForDistributor/>,
            },
            {
                path: "/tvmarketApkversionsubedit/:menuId",
                element: <TVapkversion_EditForDistributor/>,
            },
            {
                path: "/tvmarketApkversionsubadd/:menuId/:apkId",
                element: <TVapkversion_AddForDistributor/>,
            },
            // 	mova
            // 	Apk
            // 一级查看
            {
                path: "/tvRecommendApkModelTable/:menuId",
                loader: pre_RecommendForDistributorLoader,
                element: <TVModelRecommendApk_Table/>,
            },
            // 一级编辑
            {
                path: "/tvRecommendApkModelEdit/:menuId",
                element: <TVModelRecommendApk_Edit/>,
            },
            //  一级主分类
            {
                path: "/classRecommendApk_table/:menuId",
                element: <ClassRecommendApk_Table/>,
            },
            {
                path: "/tvRecommendApkModelAdd/:menuId",
                loader: pre_ProvideTemplatelistLoaderMovaRecommend,
                element: <TVModelRecommendApk_Add/>,
            },
            //     // 二级
            {
                path: "/tvRecommendApksubtable/:menuId",
                loader: pre_RecommendForDistributorLoader,
                element: <Recommend_TableForDistributor/>,
            },
            //
            {
                path: "/tvRecommendApksubedit/:menuId",
                element: <Recommend_EditForDistributor/>,
            },
            {
                path: "/tvRecommendApksubadd/:menuId",
                loader: pre_RecommendForDistributorLoader,
                element: <Recommend_AddForDistributor/>,
            },
            // 	点播
            // 一级查看
            {
                path: "/tvvedioModelTable/:menuId",
                loader: pre_VideoLoaderFordistributor,
                element: <TVModelVideo_Table/>,
            },
            // 一级编辑
            {
                path: "/tvvedioModelEdit/:menuId",
                element: <TVModelVideo_Edit/>,
            },
            {
                path: "/tvvedioModelAdd/:menuId",
                loader: pre_ProvideTemplatelistLoaderVod,
                element: <TVModelVideo_Add/>,
            },
            //  一级主分类
            {
                path: "/classVideo_table/:menuId",
                element: <ClassVideo_Table/>,
            },
            //  一级子分类
            {
                path: "/CategoryVideo_Table/:menuId",
                element: <CategoryVideo_Table/>,
            },
            //     // 二级
            {
                path: "/tvvediosubtable/:menuId",
                // loader: pre_VideoLoaderFordistributor,
                element: <Video_TableForDistributor/>,
            },
            //
            {
                path: "/tvvediosubedit/:menuId",
                element: <Video_EditForDistributor/>,
            },
            {
                path: "/tvvediosubadd/:menuId",
                element: <Video_AddForDistributor/>,
            },
            // 	点播分类
            // vod/点播一级分类列表
            {
                path: "/vodfirst_table/:menuId",
                loader: pre_VodClasslistLoader,
                element: <Vodfirst_Table/>,
            },
            {
                path: "/vodfirst_edit/:menuId",
                element: <Vodfirst_Edit/>,
            },
            {
                path: "/vodfirst_Add/:menuId",
                loader: pre_VodClasslistLoader,
                element: <Vodfirst_Add/>,
            },
            // vod/点播二级分类列表
            {
                path: "/vodsecond_table/:menuId/:firstId",
                loader: pre_SubClasslistLoader,
                element: <Vodsecond_Table/>,
            },
            {
                path: "/vodsecond_edit/:menuId/:firstId",
                element: <Vodsecond_Edit/>,
            },
            {
                path: "/vodsecond_add/:id/:firstId",
                element: <Vodsecond_Add/>,
            },
            // 三级分类
            {
                path: "/vodshowlink_table/:menuId/:firstId/:secondId",
                element: <VodVodLink_Table/>,
            },
            {
                path: "/VodVodLink_Edit/:menuId/:firstId/:secondId",
                element: <VodVodLink_Edit/>,
            },
            {
                path: "/VodVodLink_Add/:menuId/:firstId/:secondId",
                element: <VodVodLink_Add/>,
            },
            // mowo分类
            // 	点播分类
            // vod/点播一级分类列表
            {
                path: "/mowofirst_table/:menuId",
                loader: pre_MowoClasslistLoader,
                element: <MowoClass_Table/>,
            },
            {
                path: "/mowofirst_edit/:menuId",
                element: <MowoClass_Edit/>,
            },
            {
                path: "/mowofirst_Add/:menuId",
                loader: pre_MowoClasslistLoader,
                element: <MowoClass_Add/>,
            },
            // mowo/点播二级分类列表
            {
                path: "/mowosecond_table/:menuId/:firstId",
                loader: pre_ClassDatalistLoader,
                element: <ClassList_Table/>,
            },
            {
                path: "/mowosecond_edit/:menuId/:firstId",
                element: <ClassList_Edit/>,
            },
            {
                path: "/mowosecond_add/:id/:firstId",
                element: <ClassList_Add/>,
            },
            // 三级分类
            {
                path: "/mowolink_table/:menuId/:firstId/:secondId",
                element: <ClassResource_Table/>,
            },
            {
                path: "/mowoLink_Edit/:menuId/:firstId/:secondId",
                element: <ClassResource_Edit/>,
            },
            {
                path: "/mowoLink_Add/:menuId/:firstId/:secondId",
                element: <ClassResource_Add/>,
            },
            // mowo分类

            //     Apk推荐
            {
                path: "/apkCategory_table/:menuId",
                loader:pre_ApkCategorylistLoader,
                element: <ApkCategory_Table/>,
            },
            {
                path: "/apkCategory_add/:menuId",
                element: <ApkCategory_Add/>,
            },
            {
                path: "/apkCategory_edit/:menuId",
                element: <ApkCategory_Edit/>,
            },
            //     分销商
            {
                path: "/distributordetail_table/:menuId",
                loader: pre_DistributorDetaillistLoader,
                element: <DistributorDetail_Table/>,
            },
            {
                path: "/distributordetail_add/:menuId",
                loader: pre_DistributorDetaillistLoader,
                element: <DistributorDetail_Add/>,
            },
            {
                path: "/distributordetail_edit/:menuId",
                element: <DistributorDetail_Edit/>,
            },
            // 查看APK推荐
            {
                path: "/RecommendApkTable/:menuId",
                loader: pre_RecommendLoader,
                element: <RecommendApk_Table/>,
            },
            // 编辑APK推荐
            {
                path: "/RecommendApkEdit/:menuId",
                element: <RecommendApk_Edit/>,
            },
            // 新增APK推荐
            {
                path: "/RecommendApkAdd/:menuId",
                loader: pre_RecommendLoader,
                element: <RecommendApk_Add/>,
            },
            // 点播账户
            // 查看点播账户
            {
                path: "/VodUserTable/:menuId",
                loader: pre_Top10ManagerForDistributorLoader,
                element: <TVModelVodAccount_Table/>,
            },
            // // 编辑点播账户
            {
                path: "/VodUserEdit/:menuId",
                element: <TVModelVodAccount_Edit/>,
            },
            // // 新增点播账户
            {
                path: "/VodUserAdd/:menuId",
                loader: pre_Top10ManagerForDistributorLoader,
                element: <TVModelVodAccount_Add/>,
            },
            // 	查看点播视频跳转分类页面
            {
                path: "/Vodfirst_TableForDistributor/:menuId",
                // loader: pre_VodAccountForDistributorLoader,
                element: <Vodfirst_TableForDistributor/>,
            },

            // 	查看点播视频桌面推荐列表
            {
                path: "/Vodsecond_TableForDistributor/:menuId/:firstId",
                element: <VodsecondForDistributor_Table/>,
            },
            // // 编辑点播视频桌面推荐列表
            {
                path: "/VodsecondEdit/:menuId/:firstId",
                element: <Vodsecond_EditForDistributor/>,
            },
            // // 新增点播视频桌面推荐列表
            {
                path: "/VodsecondAdd/:menuId/:firstId",
                element: <Vodsecond_AddForDistributor/>,
            },

            // 	查看点播视频桌面推荐链接列表
            {
                path: "/Vodthird_TableForDistributor/:menuId/:firstId/:secondId",
                element: <VodLinkLinkForDistributor_Table/>,
            },
            // // 编辑点播视频桌面推荐链接列表
            {
                path: "/VodthirdEdit/:menuId/:firstId/:secondId",
                element: <VodLinkLinkDistributor_EditForDistributor/>,
            },
            // // 新增点播视频桌面推荐链接列表
            {
                path: "/VodthirdAdd/:menuId/:firstId/:secondId",
                element: <VodLinkLinkDistributor_AddForDistributor/>,
            },
            //
            // 	查看点播视频轮播图片
            {
                path: "/vodbanner_table/:menuId/:firstId",
                loader: pre_SubClasslistLoader,
                element: <Vodbannner_Table/>,
            },
            {
                path: "/vodbanner_edit/:menuId/:firstId",
                element: <Vodbanner_Edit/>,
            },
            {
                path: "/vodbanner_add/:id/:firstId",
                element: <Vodbanner_Add/>,
            },
        //
            // vod 点播子类别
            {
                path: "/VodTypesecond_table/:menuId/:firstId",
                loader: pre_SubClasslistLoader,
                element: <Typesecond_Table/>,
            },
            {
                path: "/VodTypesecond_edit/:menuId/:firstId",
                element: <Typesecond_Edit/>,
            },
            {
                path: "/VodTypesecond_add/:id/:firstId",
                element: <Typesecond_Add/>,
            },
            // 三级分类
            {
                path: "/VodTypeItem_table/:menuId/:firstId/:secondId",
                element: <TypeItem_Table/>,
            },
            {
                path: "/VodTypeItem_Edit/:menuId/:firstId/:secondId",
                element: <TypeItem_Edit/>,
            },
            {
                path: "/VodTypeItem_Add/:menuId/:firstId/:secondId",
                element: <TypeItem_Add/>,
            },
        ],
    },
    {
        path: "/login",
        element: <Login/>,
    },
]);
