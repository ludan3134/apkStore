import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function CircularIndeterminate() {
    return (
        <React.Fragment>
            <Dialog
                open={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">....ing</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box sx={{display: "flex"}}>
                            <CircularProgress/>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
