import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function LocationBar({location}) {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <LocationOnIcon color={"inherit"}/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        {location}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
