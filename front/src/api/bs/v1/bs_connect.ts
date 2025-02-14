// as 服务, 即是 a3 的 grpc 服务

// @generated by protoc-gen-connect-es v0.13.0 with parameter "target=ts"
// @generated from file api/bs/v1/bs.proto (package api.bs.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CountBoxSettingRequest, CountBoxSettingResponse, CountBoxStbMappingRequest, CountBoxStbMappingResponse, QueryBoxRecordListRequest, QueryBoxRecordListResponse, QueryBoxSettingListRequest, QueryBoxSettingListResponse, QueryBoxStbMappingListRequest, QueryBoxStbMappingListResponse, QueryScanGunListRequest, QueryScanGunListResponse, UpsertBoxSettingRequest, UpsertBoxSettingResponse, UpsertBoxStbMappingListRequest, UpsertBoxStbMappingListResponse, UpsertScanGunListRequest, UpsertScanGunListResponse } from "./bs_pb.ts";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service api.bs.v1.BService
 */
export const BService = {
  typeName: "api.bs.v1.BService",
  methods: {
    /**
     *  rpc Ping(PingRequest) returns (PingResponse);
     * ----------------------------------------------------------------------------------------------------------------------
     * 以下是管理界面使用的
     * ----------------------------------------------------------------------------------------------------------------------
     * 
     *
     * @generated from rpc api.bs.v1.BService.CountBoxSetting
     */
    countBoxSetting: {
      name: "CountBoxSetting",
      I: CountBoxSettingRequest,
      O: CountBoxSettingResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.bs.v1.BService.UpsertBoxSetting
     */
    upsertBoxSetting: {
      name: "UpsertBoxSetting",
      I: UpsertBoxSettingRequest,
      O: UpsertBoxSettingResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.bs.v1.BService.QueryBoxSettingList
     */
    queryBoxSettingList: {
      name: "QueryBoxSettingList",
      I: QueryBoxSettingListRequest,
      O: QueryBoxSettingListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.bs.v1.BService.QueryBoxRecordList
     */
    queryBoxRecordList: {
      name: "QueryBoxRecordList",
      I: QueryBoxRecordListRequest,
      O: QueryBoxRecordListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ----------------------------------------------------------------------------------------------------------------------
     * 以下是装箱界面使用的,  web 后台管理界在不需要使用
     * ----------------------------------------------------------------------------------------------------------------------
     * 
     *
     * @generated from rpc api.bs.v1.BService.UpsertScanGunList
     */
    upsertScanGunList: {
      name: "UpsertScanGunList",
      I: UpsertScanGunListRequest,
      O: UpsertScanGunListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.bs.v1.BService.QueryScanGunList
     */
    queryScanGunList: {
      name: "QueryScanGunList",
      I: QueryScanGunListRequest,
      O: QueryScanGunListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * 
     *
     * @generated from rpc api.bs.v1.BService.CountBoxStbMapping
     */
    countBoxStbMapping: {
      name: "CountBoxStbMapping",
      I: CountBoxStbMappingRequest,
      O: CountBoxStbMappingResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.bs.v1.BService.UpsertBoxStbMappingList
     */
    upsertBoxStbMappingList: {
      name: "UpsertBoxStbMappingList",
      I: UpsertBoxStbMappingListRequest,
      O: UpsertBoxStbMappingListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc api.bs.v1.BService.QueryBoxStbMappingList
     */
    queryBoxStbMappingList: {
      name: "QueryBoxStbMappingList",
      I: QueryBoxStbMappingListRequest,
      O: QueryBoxStbMappingListResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

