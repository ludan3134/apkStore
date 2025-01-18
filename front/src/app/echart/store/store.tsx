import {proxy} from "valtio";
import {ChartFilter, ChartStore} from "./model";
import {useProxy} from "valtio/utils";
import dayjs from "dayjs";

export const ChartFilterStoreProxy = proxy<ChartStore>({
    chartFilter: {} as ChartFilter
});

export const useproxy_ChartFilter = () => {
    var ChartFilterStore = useProxy(ChartFilterStoreProxy);
    console.info("调用时间范围格式,返回Rows列表:", ChartFilterStore);
    return ChartFilterStore.chartFilter;
};

export const pre_ChartFilterLoader = async () => {
    const now = dayjs();
    // 设置 startTime 为当前日期的前15天
    ChartFilterStoreProxy.chartFilter.startTime = now.subtract(15, 'day').startOf('day');
    // 设置 endTime 为当前日期的最后一刻
    ChartFilterStoreProxy.chartFilter.endTime = now.endOf('day');
    ChartFilterStoreProxy.chartFilter.distributorId = ""
    ChartFilterStoreProxy.chartFilter.modelId = ""


    return true;
};
