import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../../const/pagenation";

export function Appsversion_Column(props: EnhancedTableProps) {
    const {onSelectAllClick, numSelected, rowCount} = props;

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                        sx={{
                            // 设置背景颜色
                            color: "white", // 替换为你想要的背景颜色
                        }}
                    />
                </StyledTableCell>
                {/*<StyledTableCell align="center">id</StyledTableCell>*/}
                {/*<StyledTableCell align="center">创建时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">更新时间</StyledTableCell>*/}
                {/*<StyledTableCell align="center">固件Id</StyledTableCell>*/}
                <StyledTableCell align="center">版本名称</StyledTableCell>
                <StyledTableCell align="center">发布日期</StyledTableCell>
                <StyledTableCell align="center">更新日志</StyledTableCell>
                <StyledTableCell align="center">是否最新</StyledTableCell>
                <StyledTableCell align="center">是否公开</StyledTableCell>
                <StyledTableCell align="center">是否支付</StyledTableCell>
                <StyledTableCell align="center">文件大小</StyledTableCell>
                <StyledTableCell align="center">下载地址</StyledTableCell>
                <StyledTableCell align="center">强制卸载</StyledTableCell>

                <StyledTableCell align="center">编辑版本</StyledTableCell>
                <StyledTableCell align="center">删除版本</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
