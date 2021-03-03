import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import HeatmapViz from './HeatmapViz';
import TableauViz from './TableauViz';
import SearchBar from './SearchBar';
export default function HeatmapPage() {
    return (
        <div>
            <Container maxWidth="md">
                {/* <Typography variant="h3" gutterBottom>
                    Second page
                </Typography> */}
                <SearchBar />
                <TableauViz />
            </Container>
        </div>
    )
}