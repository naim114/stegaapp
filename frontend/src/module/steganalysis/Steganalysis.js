import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Steganalysis() {
    const [file, setFile] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                    <img src={file} alt="Preview" style={{ maxHeight: 300 }} />
                </>
            )}

            {/* Step 3 (conditionally render this section if a file is selected) */}
            {file && (
                <>
                    <Typography component="p" variant="p" sx={{ mt: 4, mb: 1 }}>
                        Step 3: Submit the image for steganalysis
                    </Typography>
                    <Button variant="contained" onClick={handleOpen}>Steganalyse Now</Button>
                </>
            )}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Steganalysis Result
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Malicious Payload Type:
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        Confidence Percentage:
                    </Typography>

                    <Button variant="contained" sx={{ mt: 4 }}>Save Result</Button>
                </Box>
            </Modal>
        </Box>
    );
}
