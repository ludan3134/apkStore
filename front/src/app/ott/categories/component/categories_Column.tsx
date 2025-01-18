import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";
import {useproxy_ApkCategorysFilter} from "../store/store";

export function ApkCategory_Column(props: EnhancedTableProps) {
    const {onSelectAllClick, numSelected, rowCount} = props;
    var ApkCategorysFilter = useproxy_ApkCategorysFilter();
    console.log("aaa", ApkCategorysFilter.parentId)
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
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">名称</StyledTableCell>
                <StyledTableCell align="center">排序</StyledTableCell>
                <StyledTableCell align="center">编辑分类菜单</StyledTableCell>
                {!ApkCategorysFilter.parentId && (
                    <StyledTableCell align="center">查看子级分类</StyledTableCell>
                )}
                <StyledTableCell align="center">删除分类菜单</StyledTableCell>

            </TableRow>
        </TableHead>
    );
}
