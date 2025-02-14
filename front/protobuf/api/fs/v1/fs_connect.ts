// as 服务, 即是 a3 的 grpc 服务

// @generated by protoc-gen-connect-es v0.13.0 with parameter "target=ts"
// @generated from file api/fs/v1/fs.proto (package api.fs.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { BindDistributorModelRequest, BindDistributorModelResponse, CountUploadRequest, CountUploadResponse, DeleteApkCategoryRequest, DeleteApkCategoryResponse, DeleteApkListRequest, DeleteApkListResponse, DeleteProvideTemplateRequest, DeleteProvideTemplateResponse, GetRecommendApkRequest, GetRecommendApkResponse, InsertAdvertisementPictureRequest, InsertAdvertisementPictureResponse, InsertAdvertisementRequest, InsertAdvertisementResponse, InsertApkCategoryRequest, InsertApkCategoryResponse, InsertApkDetailRequest, InsertApkDetailResponse, InsertApkListByCopyRequest, InsertApkListByCopyResponse, InsertApkRequest, InsertApkResponse, InsertAppBannerRequest, InsertAppBannerResponse, InsertDistributorDetailRequest, InsertDistributorDetailResponse, InsertFirmwareDetailRequest, InsertFirmwareDetailResponse, InsertFirmwareRequest, InsertFirmwareResponse, InsertHomeBackgroundImageRequest, InsertHomeBackgroundImageResponse, InsertNotificationRequest, InsertNotificationResponse, InsertProvideTemplateRequest, InsertProvideTemplateResponse, InsertRecommendApkRequest, InsertRecommendApkResponse, InsertUploadListRequest, InsertUploadListResponse, QueryAdvertisementListRequest, QueryAdvertisementListResponse, QueryAdvertisementNewestRequest, QueryAdvertisementNewestResponse, QueryAdvertisementPictureListRequest, QueryAdvertisementPictureListResponse, QueryAdvertisementPictureNewestRequest, QueryAdvertisementPictureNewestResponse, QueryApkCategoryInfoRequest, QueryApkCategoryInfoResponse, QueryApkCategoryLabelRequest, QueryApkCategoryLabelResponse, QueryApkCategoryListRequest, QueryApkCategoryListResponse, QueryApkDetailListRequest, QueryApkDetailListResponse, QueryApkInfoRequest, QueryApkInfoResponse, QueryApkListRequest, QueryApkListResponse, QueryApkNewestRequest, QueryApkNewestResponse, QueryApkNewVersionNewestRequest, QueryApkNewVersionNewestResponse, QueryApkWhiteRequest, QueryApkWhiteResponse, QueryAppBannerListRequest, QueryAppBannerListResponse, QueryAppBannerNewestRequest, QueryAppBannerNewestResponse, QueryBindDistributorModelRequest, QueryBindDistributorModelResponse, QueryDistributorDetailListRequest, QueryDistributorDetailListResponse, QueryDistributorDetailNewestRequest, QueryDistributorDetailNewestResponse, QueryDownloadListRequest, QueryDownloadListResponse, QueryFirmwareDetailListRequest, QueryFirmwareDetailListResponse, QueryFirmwareListRequest, QueryFirmwareListResponse, QueryFirmwareNewestRequest, QueryFirmwareNewestResponse, QueryHomeBackgroundImageListRequest, QueryHomeBackgroundImageListResponse, QueryHomeBackgroundImageNewestRequest, QueryHomeBackgroundImageNewestResponse, QueryNotificationListRequest, QueryNotificationListResponse, QueryNotificationNewestRequest, QueryNotificationNewestResponse, QueryProvideTemplateListRequest, QueryProvideTemplateListResponse, QueryRecommendApkListRequest, QueryRecommendApkListResponse, QueryUploadListRequest, QueryUploadListResponse, UpdateAdvertisementPictureRequest, UpdateAdvertisementPictureResponse, UpdateAdvertisementRequest, UpdateAdvertisementResponse, UpdateApkCategoryRequest, UpdateApkCategoryResponse, UpdateApkDetailRequest, UpdateApkDetailResponse, UpdateApkRequest, UpdateApkResponse, UpdateAppBannerRequest, UpdateAppBannerResponse, UpdateDistributorDetailRequest, UpdateDistributorDetailResponse, UpdateFirmwareDetailRequest, UpdateFirmwareDetailResponse, UpdateFirmwareRequest, UpdateFirmwareResponse, UpdateHomeBackgroundImageRequest, UpdateHomeBackgroundImageResponse, UpdateNotificationRequest, UpdateNotificationResponse, UpdateProvideTemplateRequest, UpdateProvideTemplateResponse, UpdateRecommendApkRequest, UpdateRecommendApkResponse, UpdateUploadRequest, UpdateUploadResponse } from "./fs_pb.ts";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * 以下由 上传服务的 web 管理界面 调用
 *
 * @generated from service api.fs.v1.FService
 */
export const FService = {
  typeName: "api.fs.v1.FService",
  methods: {
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.CountUpload
     */
    countUpload: {
      name: "CountUpload",
      I: CountUploadRequest,
      O: CountUploadResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertUploadList
     */
    insertUploadList: {
      name: "InsertUploadList",
      I: InsertUploadListRequest,
      O: InsertUploadListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateUpload
     */
    updateUpload: {
      name: "UpdateUpload",
      I: UpdateUploadRequest,
      O: UpdateUploadResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryUploadList
     */
    queryUploadList: {
      name: "QueryUploadList",
      I: QueryUploadListRequest,
      O: QueryUploadListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * -----------------------jeffery-------------
     *
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertApk
     */
    insertApk: {
      name: "InsertApk",
      I: InsertApkRequest,
      O: InsertApkResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateApk
     */
    updateApk: {
      name: "UpdateApk",
      I: UpdateApkRequest,
      O: UpdateApkResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryApkList
     */
    queryApkList: {
      name: "QueryApkList",
      I: QueryApkListRequest,
      O: QueryApkListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.DeleteApkList
     */
    deleteApkList: {
      name: "DeleteApkList",
      I: DeleteApkListRequest,
      O: DeleteApkListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertApkListByCopy
     */
    insertApkListByCopy: {
      name: "InsertApkListByCopy",
      I: InsertApkListByCopyRequest,
      O: InsertApkListByCopyResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertApkCategory
     */
    insertApkCategory: {
      name: "InsertApkCategory",
      I: InsertApkCategoryRequest,
      O: InsertApkCategoryResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateApkCategory
     */
    updateApkCategory: {
      name: "UpdateApkCategory",
      I: UpdateApkCategoryRequest,
      O: UpdateApkCategoryResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryApkCategoryList
     */
    queryApkCategoryList: {
      name: "QueryApkCategoryList",
      I: QueryApkCategoryListRequest,
      O: QueryApkCategoryListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryApkCategoryLabel
     */
    queryApkCategoryLabel: {
      name: "QueryApkCategoryLabel",
      I: QueryApkCategoryLabelRequest,
      O: QueryApkCategoryLabelResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.DeleteApkCategory
     */
    deleteApkCategory: {
      name: "DeleteApkCategory",
      I: DeleteApkCategoryRequest,
      O: DeleteApkCategoryResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertApkDetail
     */
    insertApkDetail: {
      name: "InsertApkDetail",
      I: InsertApkDetailRequest,
      O: InsertApkDetailResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateApkDetail
     */
    updateApkDetail: {
      name: "UpdateApkDetail",
      I: UpdateApkDetailRequest,
      O: UpdateApkDetailResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryApkDetailList
     */
    queryApkDetailList: {
      name: "QueryApkDetailList",
      I: QueryApkDetailListRequest,
      O: QueryApkDetailListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertFirmware
     */
    insertFirmware: {
      name: "InsertFirmware",
      I: InsertFirmwareRequest,
      O: InsertFirmwareResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateFirmware
     */
    updateFirmware: {
      name: "UpdateFirmware",
      I: UpdateFirmwareRequest,
      O: UpdateFirmwareResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryFirmwareList
     */
    queryFirmwareList: {
      name: "QueryFirmwareList",
      I: QueryFirmwareListRequest,
      O: QueryFirmwareListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertFirmwareDetail
     */
    insertFirmwareDetail: {
      name: "InsertFirmwareDetail",
      I: InsertFirmwareDetailRequest,
      O: InsertFirmwareDetailResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateFirmwareDetail
     */
    updateFirmwareDetail: {
      name: "UpdateFirmwareDetail",
      I: UpdateFirmwareDetailRequest,
      O: UpdateFirmwareDetailResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryFirmwareDetailList
     */
    queryFirmwareDetailList: {
      name: "QueryFirmwareDetailList",
      I: QueryFirmwareDetailListRequest,
      O: QueryFirmwareDetailListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertNotification
     */
    insertNotification: {
      name: "InsertNotification",
      I: InsertNotificationRequest,
      O: InsertNotificationResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateNotification
     */
    updateNotification: {
      name: "UpdateNotification",
      I: UpdateNotificationRequest,
      O: UpdateNotificationResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryNotificationList
     */
    queryNotificationList: {
      name: "QueryNotificationList",
      I: QueryNotificationListRequest,
      O: QueryNotificationListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertDistributorDetail
     */
    insertDistributorDetail: {
      name: "InsertDistributorDetail",
      I: InsertDistributorDetailRequest,
      O: InsertDistributorDetailResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateDistributorDetail
     */
    updateDistributorDetail: {
      name: "UpdateDistributorDetail",
      I: UpdateDistributorDetailRequest,
      O: UpdateDistributorDetailResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryDistributorDetailList
     */
    queryDistributorDetailList: {
      name: "QueryDistributorDetailList",
      I: QueryDistributorDetailListRequest,
      O: QueryDistributorDetailListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertHomeBackgroundImage
     */
    insertHomeBackgroundImage: {
      name: "InsertHomeBackgroundImage",
      I: InsertHomeBackgroundImageRequest,
      O: InsertHomeBackgroundImageResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateHomeBackgroundImage
     */
    updateHomeBackgroundImage: {
      name: "UpdateHomeBackgroundImage",
      I: UpdateHomeBackgroundImageRequest,
      O: UpdateHomeBackgroundImageResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryHomeBackgroundImageList
     */
    queryHomeBackgroundImageList: {
      name: "QueryHomeBackgroundImageList",
      I: QueryHomeBackgroundImageListRequest,
      O: QueryHomeBackgroundImageListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertAdvertisement
     */
    insertAdvertisement: {
      name: "InsertAdvertisement",
      I: InsertAdvertisementRequest,
      O: InsertAdvertisementResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateAdvertisement
     */
    updateAdvertisement: {
      name: "UpdateAdvertisement",
      I: UpdateAdvertisementRequest,
      O: UpdateAdvertisementResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryAdvertisementList
     */
    queryAdvertisementList: {
      name: "QueryAdvertisementList",
      I: QueryAdvertisementListRequest,
      O: QueryAdvertisementListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertAdvertisementPicture
     */
    insertAdvertisementPicture: {
      name: "InsertAdvertisementPicture",
      I: InsertAdvertisementPictureRequest,
      O: InsertAdvertisementPictureResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateAdvertisementPicture
     */
    updateAdvertisementPicture: {
      name: "UpdateAdvertisementPicture",
      I: UpdateAdvertisementPictureRequest,
      O: UpdateAdvertisementPictureResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryAdvertisementPictureList
     */
    queryAdvertisementPictureList: {
      name: "QueryAdvertisementPictureList",
      I: QueryAdvertisementPictureListRequest,
      O: QueryAdvertisementPictureListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.QueryProvideTemplateList
     */
    queryProvideTemplateList: {
      name: "QueryProvideTemplateList",
      I: QueryProvideTemplateListRequest,
      O: QueryProvideTemplateListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.InsertProvideTemplate
     */
    insertProvideTemplate: {
      name: "InsertProvideTemplate",
      I: InsertProvideTemplateRequest,
      O: InsertProvideTemplateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.UpdateProvideTemplate
     */
    updateProvideTemplate: {
      name: "UpdateProvideTemplate",
      I: UpdateProvideTemplateRequest,
      O: UpdateProvideTemplateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.DeleteProvideTemplate
     */
    deleteProvideTemplate: {
      name: "DeleteProvideTemplate",
      I: DeleteProvideTemplateRequest,
      O: DeleteProvideTemplateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.InsertAppBanner
     */
    insertAppBanner: {
      name: "InsertAppBanner",
      I: InsertAppBannerRequest,
      O: InsertAppBannerResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.UpdateAppBanner
     */
    updateAppBanner: {
      name: "UpdateAppBanner",
      I: UpdateAppBannerRequest,
      O: UpdateAppBannerResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ui
     *
     * @generated from rpc api.fs.v1.FService.QueryAppBannerList
     */
    queryAppBannerList: {
      name: "QueryAppBannerList",
      I: QueryAppBannerListRequest,
      O: QueryAppBannerListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.QueryRecommendApkList
     */
    queryRecommendApkList: {
      name: "QueryRecommendApkList",
      I: QueryRecommendApkListRequest,
      O: QueryRecommendApkListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.InsertRecommendApk
     */
    insertRecommendApk: {
      name: "InsertRecommendApk",
      I: InsertRecommendApkRequest,
      O: InsertRecommendApkResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.UpdateRecommendApk
     */
    updateRecommendApk: {
      name: "UpdateRecommendApk",
      I: UpdateRecommendApkRequest,
      O: UpdateRecommendApkResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.QueryBindDistributorModel
     */
    queryBindDistributorModel: {
      name: "QueryBindDistributorModel",
      I: QueryBindDistributorModelRequest,
      O: QueryBindDistributorModelResponse,
      kind: MethodKind.Unary,
    },
    /**
     * -----------------------jeffery-------------
     *
     * @generated from rpc api.fs.v1.FService.BindDistributorModel
     */
    bindDistributorModel: {
      name: "BindDistributorModel",
      I: BindDistributorModelRequest,
      O: BindDistributorModelResponse,
      kind: MethodKind.Unary,
    },
    /**
     * 
     * ----------------------------------------------------------------------------------------------------------------------
     * 以下由 下载服务 调用
     *
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryDownloadList
     */
    queryDownloadList: {
      name: "QueryDownloadList",
      I: QueryDownloadListRequest,
      O: QueryDownloadListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryApkInfo
     */
    queryApkInfo: {
      name: "QueryApkInfo",
      I: QueryApkInfoRequest,
      O: QueryApkInfoResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryApkCategoryInfo
     */
    queryApkCategoryInfo: {
      name: "QueryApkCategoryInfo",
      I: QueryApkCategoryInfoRequest,
      O: QueryApkCategoryInfoResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryApkNewest
     */
    queryApkNewest: {
      name: "QueryApkNewest",
      I: QueryApkNewestRequest,
      O: QueryApkNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryApkWhite
     */
    queryApkWhite: {
      name: "QueryApkWhite",
      I: QueryApkWhiteRequest,
      O: QueryApkWhiteResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryFirmwareNewest
     */
    queryFirmwareNewest: {
      name: "QueryFirmwareNewest",
      I: QueryFirmwareNewestRequest,
      O: QueryFirmwareNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryAdvertisementNewest
     */
    queryAdvertisementNewest: {
      name: "QueryAdvertisementNewest",
      I: QueryAdvertisementNewestRequest,
      O: QueryAdvertisementNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryHomeBackgroundImageNewest
     */
    queryHomeBackgroundImageNewest: {
      name: "QueryHomeBackgroundImageNewest",
      I: QueryHomeBackgroundImageNewestRequest,
      O: QueryHomeBackgroundImageNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryNotificationNewest
     */
    queryNotificationNewest: {
      name: "QueryNotificationNewest",
      I: QueryNotificationNewestRequest,
      O: QueryNotificationNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryDistributorDetailNewest
     */
    queryDistributorDetailNewest: {
      name: "QueryDistributorDetailNewest",
      I: QueryDistributorDetailNewestRequest,
      O: QueryDistributorDetailNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryAdvertisementPictureNewest
     */
    queryAdvertisementPictureNewest: {
      name: "QueryAdvertisementPictureNewest",
      I: QueryAdvertisementPictureNewestRequest,
      O: QueryAdvertisementPictureNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * for apk update
     *
     * @generated from rpc api.fs.v1.FService.QueryAppBannerNewest
     */
    queryAppBannerNewest: {
      name: "QueryAppBannerNewest",
      I: QueryAppBannerNewestRequest,
      O: QueryAppBannerNewestResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.fs.v1.FService.GetRecommendApk
     */
    getRecommendApk: {
      name: "GetRecommendApk",
      I: GetRecommendApkRequest,
      O: GetRecommendApkResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ----------------------------------------------------------------------------------------------------------------------
     *
     * @generated from rpc api.fs.v1.FService.QueryApkNewVersionNewest
     */
    queryApkNewVersionNewest: {
      name: "QueryApkNewVersionNewest",
      I: QueryApkNewVersionNewestRequest,
      O: QueryApkNewVersionNewestResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

