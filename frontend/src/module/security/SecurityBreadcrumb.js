
import * as React from 'react';
import Typography from '@mui/material/Typography';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { StyledBreadcrumbs } from '../../services/helpers';

export default function SecurityBreadcrumb() {
    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            <Typography variant="body1">Dashboard</Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Security
            </Typography>
        </StyledBreadcrumbs>
    )
}