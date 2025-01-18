import {Checkbox, TableHead} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {EnhancedTableProps} from "../../../../const/pagenation";
import {StyledTableCell} from "../../../../const/tablestyle";

export function AppUser_Column(props: EnhancedTableProps) {
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
                <StyledTableCell align="center">用户姓名</StyledTableCell>
                <StyledTableCell align="center">用户密码</StyledTableCell>
                <StyledTableCell align="center">Mac地址</StyledTableCell>
                <StyledTableCell align="center">IP</StyledTableCell>
                <StyledTableCell align="center">国家</StyledTableCell>
                <StyledTableCell align="center">城市</StyledTableCell>
                <StyledTableCell align="center">是否激活</StyledTableCell>
                <StyledTableCell align="center">是否过期</StyledTableCell>
                <StyledTableCell align="center">是否服务</StyledTableCell>

                {/*<StyledTableCell align="center">distributor_id</StyledTableCell>*/}
                {/*<StyledTableCell align="center">model_id</StyledTableCell>*/}
                <StyledTableCell align="center">分销商名称</StyledTableCell>
                <StyledTableCell align="center">型号名称</StyledTableCell>
                <StyledTableCell align="center">最后登录时间</StyledTableCell>
                <StyledTableCell align="center">运营商</StyledTableCell>
                <StyledTableCell align="center">编辑AppUser</StyledTableCell>
                <StyledTableCell align="center">删除AppUser</StyledTableCell>
            </TableRow>
        </TableHead>
    );
}
