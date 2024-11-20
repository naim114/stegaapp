import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

export default function Steganalysis() {
    const [file, setFile] = React.useState(null);

    function handleChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile));
        }
    }

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Steganalysis
            </Typography>
            <Typography component="p" variant="p" sx={{ mb: 3, fontWeight: 'bold' }}>
                Upload an image to do steganalysis, then click ‘Go’.
            </Typography>

            {/* Step 1 */}
            <Typography component="p" variant="p" sx={{ mb: 1 }}>
                Step 1: Choose an image for steganalysis
            </Typography>
            <input type="file" onChange={handleChange} />

            {/* Step 2 */}
            {file && (
                <>
                    <Typography component="p" variant="p" sx={{ mt: 4, mb: 1 }}>
                        Step 2: Preview your image
                    </Typography>
                    <img src={file} alt="Preview" style={{ height: 300 }} />
                </>
            )}

            {/* Step 3 (conditionally render this section if a file is selected) */}
            {file && (
                <>
                    <Typography component="p" variant="p" sx={{ mt: 4, mb: 1 }}>
                        Step 3: Submit the image for steganalysis
                    </Typography>
                    <Button variant="contained">Steganalyse Now</Button>
                </>
            )}
        </Box>
    );
}
