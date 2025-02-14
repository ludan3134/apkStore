// @generated by protoc-gen-es v1.3.0 with parameter "target=ts"
// @generated from file api/com/v1/pagemeta.proto (package api.com.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * ------------------------------------------------
 * PageMeta 分页信息
 * ------------------------------------------------
 *
 * @generated from message api.com.v1.PageMeta
 */
export class PageMeta extends Message<PageMeta> {
  /**
   * 偏移量 , 默认 0
   *
   * @generated from field: int32 offset = 1;
   */
  offset = 0;

  /**
   * 每页多少条记录 , how many records per page
   *
   * @generated from field: int32 limit = 2;
   */
  limit = 0;

  /**
   * current page total
   *
   * @generated from field: int32 current_page_total_records = 3;
   */
  currentPageTotalRecords = 0;

  /**
   * current page number
   *
   * @generated from field: int32 page_index = 4;
   */
  pageIndex = 0;

  /**
   * total pages
   *
   * @generated from field: int32 total_pages = 5;
   */
  totalPages = 0;

  /**
   * total record
   *
   * @generated from field: int32 total_records = 6;
   */
  totalRecords = 0;

  /**
   * loading id
   *
   * @generated from field: int64 loading_id = 8;
   */
  loadingId = protoInt64.zero;

  /**
   * @generated from field: string lang = 9;
   */
  lang = "";

  constructor(data?: PartialMessage<PageMeta>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "api.com.v1.PageMeta";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "offset", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "limit", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "current_page_total_records", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "page_index", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: "total_pages", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 6, name: "total_records", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 8, name: "loading_id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 9, name: "lang", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PageMeta {
    return new PageMeta().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PageMeta {
    return new PageMeta().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PageMeta {
    return new PageMeta().fromJsonString(jsonString, options);
  }

  static equals(a: PageMeta | PlainMessage<PageMeta> | undefined, b: PageMeta | PlainMessage<PageMeta> | undefined): boolean {
    return proto3.util.equals(PageMeta, a, b);
  }
}

/**
 * @generated from message api.com.v1.CommonMeta
 */
export class CommonMeta extends Message<CommonMeta> {
  /**
   * @generated from field: int32 begin = 1;
   */
  begin = 0;

  /**
   * @generated from field: int32 end = 2;
   */
  end = 0;

  /**
   * @generated from field: string distributor_id = 3;
   */
  distributorId = "";

  /**
   * @generated from field: string model_id = 4;
   */
  modelId = "";

  constructor(data?: PartialMessage<CommonMeta>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "api.com.v1.CommonMeta";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "begin", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "end", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "distributor_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "model_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CommonMeta {
    return new CommonMeta().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CommonMeta {
    return new CommonMeta().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CommonMeta {
    return new CommonMeta().fromJsonString(jsonString, options);
  }

  static equals(a: CommonMeta | PlainMessage<CommonMeta> | undefined, b: CommonMeta | PlainMessage<CommonMeta> | undefined): boolean {
    return proto3.util.equals(CommonMeta, a, b);
  }
}

