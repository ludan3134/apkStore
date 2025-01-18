import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../../const/pagenation";

export function TVApk_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">名称</StyledTableCell>

                <StyledTableCell align="center">类型</StyledTableCell>
                <StyledTableCell align="center">包名</StyledTableCell>
                <StyledTableCell align="center">apk图标</StyledTableCell>
                <StyledTableCell align="center">滚动横幅</StyledTableCell>
                <StyledTableCell align="center">排序</StyledTableCell>
                {/*<StyledTableCell align="center">版本数量</StyledTableCell>*/}
                <StyledTableCell align="center">星级</StyledTableCell>
                <StyledTableCell align="center">下载次数</StyledTableCell>
                <StyledTableCell align="center">分销商</StyledTableCell>
                <StyledTableCell align="center">型号</StyledTableCell>
                <StyledTableCell align="center">发布市场</StyledTableCell>
                <StyledTableCell align="center">滚动</StyledTableCell>
                <StyledTableCell align="center">是否弹框提示</StyledTableCell>
                <StyledTableCell align="center">是否提示更新</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
                <StyledTableCell align="center">更新时间</StyledTableCell>
                <StyledTableCell align="center">版本</StyledTableCell>
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
