import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {StyledTableCell} from "../../../../../const/tablestyle";
import {EnhancedTableProps} from "../../../../../const/pagenation";

export function Apps_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">app名称</StyledTableCell>
                <StyledTableCell align="center">包名</StyledTableCell>

                <StyledTableCell align="center">app描述</StyledTableCell>
                <StyledTableCell align="center">应用图标</StyledTableCell>
                <StyledTableCell align="center">分类推荐轮播图</StyledTableCell>
                <StyledTableCell align="center">排序</StyledTableCell>
                <StyledTableCell align="center">宣传图</StyledTableCell>
                <StyledTableCell align="center">分类推荐图片</StyledTableCell>
                <StyledTableCell align="center">系统要求</StyledTableCell>
                <StyledTableCell align="center">评分</StyledTableCell>
                <StyledTableCell align="center">分类名称</StyledTableCell>
                <StyledTableCell align="center">价格套餐</StyledTableCell>
                <StyledTableCell align="center">分销商</StyledTableCell>
                <StyledTableCell align="center">型号</StyledTableCell>
                <StyledTableCell align="center">是否推送市场</StyledTableCell>
                <StyledTableCell align="center">是否桌面显示</StyledTableCell>
                <StyledTableCell align="center">桌面显示排序</StyledTableCell>

                <StyledTableCell align="center">是否弹框</StyledTableCell>

                {/*<StyledTableCell align="center">版权信息</StyledTableCell>*/}
                <StyledTableCell align="center">版本</StyledTableCell>
                <StyledTableCell align="center">编辑</StyledTableCell>
                <StyledTableCell align="center">删除</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
