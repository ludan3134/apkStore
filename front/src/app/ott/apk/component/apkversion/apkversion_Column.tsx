import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../../const/pagenation";

export function Apkversion_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">版本</StyledTableCell>
                <StyledTableCell align="center">MD5</StyledTableCell>
                <StyledTableCell align="center">存放路径</StyledTableCell>
                <StyledTableCell align="center">内容</StyledTableCell>
                <StyledTableCell align="center">强制更新</StyledTableCell>
                <StyledTableCell align="center">服务器位置</StyledTableCell>
                <StyledTableCell align="center">文件大小</StyledTableCell>
                <StyledTableCell align="center">创建时间</StyledTableCell>
                <StyledTableCell align="center">更新时间</StyledTableCell>
                {/*<StyledTableCell align="center">是否删除</StyledTableCell>*/}
                <StyledTableCell align="center">是否强制卸载</StyledTableCell>
                <StyledTableCell align="center">编辑版本</StyledTableCell>
                <StyledTableCell align="center">删除版本</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
