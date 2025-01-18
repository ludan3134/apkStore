import React, {useRef, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Chart_Filter} from "./filter";
import {useproxy_ChartFilter} from "../store/store";
import {authProxy, useauthUserNameProxy} from "../../auth/store/store";
import {MacActivityFilter, MacDailyActivity, MacModelCount} from "../../../api/ax/v1/axm_pb";
import {grpcpulldata} from "../api/grpcpulldata";
import Divider from 'antd/es/divider';
import {grpcpullPiedata} from "../api/grpcpullPiedata";

const DauBar: React.FC = () => {
    var chartFilter = useproxy_ChartFilter();
    var userName = useauthUserNameProxy();
    console.log("userName", userName)
    const [xdata, setXdata] = useState([])
    const [ydata, setYdata] = useState<MacDailyActivity[]>([])
    const [total, setTotal] = useState<number>()
    const [pietotal, setPietotal] = useState<number>()

    const [ypieData, setYpieData] = useState<MacModelCount[]>()
    const chartRef = useRef(null); // 创建一个 ref 用于引用 ECharts 实例

    React.useEffect(() => {
        const fetchData = async () => {
            chartRef.current.getEchartsInstance().showLoading(); // 显示加载状态
            const startDate = chartFilter.startTime.toDate();
            const endDate = chartFilter.endTime.toDate();
            const dateArray = [];
            var macActivityFilter: MacActivityFilter = {
                distributorId: chartFilter.distributorId,
                modelId: chartFilter.modelId,
                startTime: chartFilter.startTime.toISOString().split('T')[0],
                endTime: chartFilter.endTime.toISOString().split('T')[0]
            }
            // Ensure start date is before end date
            if (startDate && endDate && startDate <= endDate) {
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    dateArray.push(currentDate.toISOString().split('T')[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
            var res = await grpcpulldata(macActivityFilter, authProxy.token)
            var res1 = await grpcpullPiedata(macActivityFilter, authProxy.token)
            setYdata(res.macActivityList)
            setTotal(res.total)
            setXdata(dateArray);
            setYpieData(res1.macActivityList)
            setPietotal(res1.total)

            chartRef.current?.getEchartsInstance().hideLoading(); // 隐藏加载状态

        };
        fetchData(); // 调用异步函数
    }, [chartFilter]);

    const loadingOption = {
        text: '加载中...',
        color: '#4413c2',
        textColor: '#270240',
        maskColor: 'rgba(194, 88, 86, 0.3)',
        zlevel: 0
    };

    const option = {
        grid: {top: '20%', right: 30, bottom: "25%", left: '5%'},
        title: {
            text: '日活数量',
            subtext: `${total}`,
            left: 'center'
        },
        tooltip: {},
        dataset: {
            dimensions: ['date', 'macCount'],
            source: ydata
        },
        xAxis: {
            type: 'category',
            data: xdata
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            type: 'bar',
            encode: {
                x: 'date',
                y: 'macCount'
            },
            label: {
                show: true,
                position: "top",  // 展示在柱子的上方
                color: "#333",
            },
        }]
    };
    const option2 = {
        title: {
            text: '型号分布',
            subtext: `${pietotal}`,
            left: 'center',
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '60%',
                data: ypieData,
                label: {
                    show: true,
                    position: 'outside', // 设置标签显示在饼图外侧
                    formatter: '{b}: {c}', // 使用 {b} 表示数据名，{c} 表示数据值
                    color: '#333' // 设置标签文字颜色
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    return <>
        {userName === 'admin' && <Chart_Filter/>}
        <Divider orientation="left" plain>
        </Divider>
        <ReactECharts
            option={option}
            style={{height: 400}}
            opts={{renderer: 'svg'}}
            loadingOption={loadingOption}
            ref={chartRef}
        />
        <Divider orientation="left" plain>
        </Divider>
        <ReactECharts
            option={option2}
            style={{height: 400}}
            opts={{renderer: 'svg'}}
            loadingOption={loadingOption}
        />
    </>

};

export default DauBar;
