import { Box, Typography, Container, Grid } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from "react-router-dom";

const Footer = () => {

    return (
        <Container sx={{mt:10}}>
            <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center">
                <Link to="https://twitter.com/227020426_PA">
                    <TwitterIcon/>
                </Link>
            </Grid>
            <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center">
                <Typography>
                227020426 - Suen Man Chun
                </Typography>
            </Grid>
        </Container>
    )
}

export default Footer;