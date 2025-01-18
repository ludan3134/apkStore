export const IsIdOption = [
    {
        id: 1,
        label: "是",
    },
    {
        id: -1,
        label: "否",
    },
];
export const IsWSTOption = [
    {
        id: 1,
        label: "是",
    },
    {
        id: 2,
        label: "否",
    },
];
export const IsM3UOption = [
    {
        id: 1,
        label: "增量",
    },
    {
        id: 2,
        label: "全量",
    },
];
export const IsDistributorOption = [
    {
        id: 0,
        label: "否",
    },
    {
        id: 1,
        label: "是",
    },
];
export const ResourceTypeOption = [
    {
        id: "live",
        label: "live",
    },
    {
        id: "playback",
        label: "playback",
    },
    {
        id: "vod",
        label: "vod",
    },
];
export const UpdateFirewareversionOption = [
    {
        id: 1,
        label: "全量包",
    },
    {
        id: 2,
        label: "增量包",
    },
];
export const AddOption = [
    {
        id: "boot",
        label: "开机广告",
    },
    {
        id: "lanucher",
        label: "桌面广告",
    },
];
export const AgreementOption = [
    {
        id: 1,
        label: "协议",
    },
    {
        id: 2,
        label: "隐私",
    },
];
export const AddrOption = [
    {
        id: 1,
        label: "默认",
    },
    // {
    //     id: 2,
    //     label: '隐私'
    // }
];
export const IsBoolOption = [
    {
        id: true,
        label: "yes",
    },
    {
        id: false,
        label: "no",
    },
];
export const AppUserfunOption = [
    {
        id: 1,
        label: "批量创建AppUser",
    },
    {
        id: 2,
        label: "批量更新AppUser状态",
    },
];

export const DomainOption = [
    {
        id: 1,
        label: "3A域名",
    },
    {
        id: 2,
        label: "DNS域名",
    },
];
export const DecodeOption = [
    {
        id: 1,
        label: "硬解",
    },
    {
        id: 2,
        label: "软解",
    },
];
export const IsStringOption = [
    {
        id: "true",
        label: "是",
    },
    {
        id: "false",
        label: "否",
    },
    {
        id: "",
        label: "(默认)",
    },
];
export const IsBitrateOption = [
    {
        id: 1,
        label: "失败",
    },
    {
        id: 2,
        label: "成功",
    },
];
export const XCTypeOption = [
    {
        id: "live",
        label: "直播",
    },
    {
        id: "playback",
        label: "回放",
    },
    {
        id: "vod",
        label: "点播",
    },
];
export const IsStringOptionForFirware = [
    {
        id: "true",
        label: "是",
    },
    {
        id: "false",
        label: "否",
    },
];
export const IsTypeOption = [
    {
        value: 1,
        label: "盒子",
    },
    {
        value: 2,
        label: "电视机",
    },
];
export const platformTypeOption = [
    {
        id: 1,
        label: "ott",
    },
    {
        id: 2,
        label: "tv",
    },
];
export const TvmAddressOption = [
    {
        id: 1,
        label: "直播xc地址",
    },
    {
        id: 2,
        label: "直播m3u地址",
    },
    {
        id: 3,
        label: "epg地址",
    },
    {
        id: 4,
        label: "赛事地址",
    },
    {
        id: 5,
        label: " 回放源地址",
    },
    {
        id: 6,
        label: "回放播放地址",
    },
];
export const MowoCategoryOption = [
    {
        id: "home",
        label: "home",
    },
    {
        id: "live",
        label: "live",
    },
    {
        id: "vod",
        label: "vod",
    },
    {
        id: "youtube",
        label: "youtube",
    },

];
export const TvmrebroadcastUseFlagOption = [
    {
        id: 0,
        label: "不可用",
    },
    {
        id: 1,
        label: "有预告无回播",
    },
    {
        id: 2,
        label: "有预告有回播",
    },
    {
        id: 3,
        label: "无预告有回播",
    },
];
export const usageOption = [
    {
        id: 1,
        label: "拉流账户",
    },
    {
        id: 2,
        label: "普通账户",
    },
];
export const isPayOption = [
    {
        id: 0,
        label: "免费",
    },
    {
        id: 1,
        label: "收费",
    },
];
export const DurationOption = [
    {
        id: "default",
        label: "default",
    },
    {
        id: "3day",
        label: "3天",
    },
    {
        id: "7day",
        label: "7天",
    },
    {
        id: "1month",
        label: "1个月",
    },
    {
        id: "3month",
        label: "3个月",
    },
    {
        id: "6month",
        label: "6个月",
    },
    {
        id: "1year",
        label: "1年",
    },
    {
        id: "14month",
        label: "14个月",
    },
    {
        id: "2year",
        label: "2年",
    },
    {
        id: "10year",
        label: "10年",
    },
];
export const DurationOptionWithOutDefault = [
    {
        id: "3day",
        label: "3天",
    },
    {
        id: "7day",
        label: "7天",
    },
    {
        id: "1month",
        label: "1个月",
    },
    {
        id: "3month",
        label: "3个月",
    },
    {
        id: "6month",
        label: "6个月",
    },
    {
        id: "1year",
        label: "1年",
    },
    {
        id: "14month",
        label: "14个月",
    },
    {
        id: "2year",
        label: "2年",
    },
    {
        id: "10year",
        label: "10年",
    },
];
// 为什么选用 connectRpc,fastHttp这两项内容,postgresql相关技术以及jackson的写法
// 前端组件库选用mui/antdesign的原因
// 解决后台鉴权认证的策略/以及盒子鉴权认证的策略
// 考勤解决文件上传的问题.
// 登录问题要解决下.解决双token登录认证问题
