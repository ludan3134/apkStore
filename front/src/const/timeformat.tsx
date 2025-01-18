import React from "react";

export const Timeformat = ({time}) => {
    console.log("time", time);
    // 将 BigInt 时间戳转换为毫秒级别的时间戳
    const milliseconds = Number(time);
    console.log("milliseconds", milliseconds);

    // 使用 JavaScript Date 对象来处理时间戳
    const date = new Date(milliseconds * 1000); // 乘以 1000 将秒转换为毫秒

    // 获取日期和时间的各个部分
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    // 构建日期格式字符串
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return <span>{formattedDate}</span>;
};

export const TimeComponent = ({timestamp, timezone}) => {
    console.log("1", timestamp);
    console.log("2", timezone);

    timestamp = timestamp ? timestamp : null;
    if (typeof timezone !== "number") {
        return <span>Invalid timezone</span>;
    }
    var timezoneOffset = new Date().getTimezoneOffset() / 60;
    var timezoneDiff = timezone + timezoneOffset;
    console.log("timezoneDiff", timezoneDiff);
    var number = timezoneDiff * 60 * 60;
    console.log("number", number);
    timestamp = timestamp + number;
    console.log("timestamp", timestamp);
    const date = new Date(timestamp * 1000); // 乘以 1000 将秒转换为毫秒
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    // 构建日期格式字符串
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log("date", formattedDate);

    return <span>{formattedDate}</span>;
};
