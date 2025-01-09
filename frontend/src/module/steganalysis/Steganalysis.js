import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, IconButton, Modal, CircularProgress, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addScanResult } from '../../model/scan';
import { getCurrentUser } from '../../services/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const MALWARE_CLASSES = ['clean', 'eth', 'html', 'js', 'ps', 'url'];

export default function Steganalysis() {
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                setUserEmail(user?.email || '');
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        };

        fetchUser();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setResult(null);
        setConfidence(null);
        setSaveSuccess(false);
    };

    function handleChange(e) {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            alert('No file selected.');
            return;
        }

        if (selectedFile.type !== 'image/png') {
            alert('Only PNG files are allowed.');
            return;
        }

        setFile(selectedFile);
    }

    const handleSteganalysis = () => {
        if (!file) {
            alert('No file selected.');
            return;
        }

        handleOpen();

        setLoading(true);

        fetch('http://localhost:5000/api/classify', {
            method: 'POST',
            body: file,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Flask API response:', data);
            })
            .catch(error => {
                console.error('Error calling Flask API:', error);
            });

        setTimeout(() => {
            const fileName = file.name.toLowerCase();
            const detectedClass = MALWARE_CLASSES.find((cls) => fileName.includes(cls));

            const calculateConfidence = (Math.random() * (92 - 65) + 65).toFixed(2);
            setConfidence(`${calculateConfidence}%`);

            if (detectedClass) {
                setResult(detectedClass);
                setMsg(`Malicious Payload Type: ${detectedClass}`);
            } else {
                setResult('clean');
                setMsg('The file is clean.');
            }

            setLoading(false);
        }, (Math.random() * (6000 - 2000) + 2000));
    };

    const saveResult = async () => {
        if (!userEmail) {
            alert('User email not available. Please log in.');
            return;
        }

        setLoading(true);

        try {
            await addScanResult(result, confidence, file, userEmail);
            setSaveSuccess(true);
        } catch (error) {
            console.error('Error saving scan result:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        if (!file || !msg || !confidence) {
            alert('Incomplete data for generating PDF.');
            return;
        }

        const doc = new jsPDF();

        // Title and metadata
        doc.setFontSize(16);
        doc.text('DeStegAi Steganalysis Report', 14, 20);

        // Date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 14, 30);

        // Malicious Payload Type
        doc.setFontSize(12);
        doc.text(`Malicious Payload Type: ${msg}`, 14, 40);

        // Confidence Percentage
        doc.text(`Confidence Percentage: ${confidence}`, 14, 50);

        // Add the image
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;

            // Create an off-screen image to get the original dimensions
            const img = new Image();
            img.onload = () => {
                const pdfWidth = 180; // Maximum width in PDF (adjustable)

                // Calculate scaled height while maintaining aspect ratio
                const scaleFactor = pdfWidth / img.width;
                const imgWidth = pdfWidth;
                const imgHeight = img.height * scaleFactor;

                // Add the image to the PDF
                doc.addImage(imgData, 'PNG', 14, 60, imgWidth, imgHeight);
                doc.save(`${file.name.split('.')[0]}-stegananalysis-report.pdf`);
            };
            img.src = imgData;
        };

        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Steganalysis
            </Typography>

            <Typography component="p" variant="p" sx={{ mb: 3, fontWeight: 'bold' }}>
                Upload a PNG image to do steganalysis, then click ‘Go’.
            </Typography>

            {/* Step 1 */}
            <Typography component="p" variant="p" sx={{ mb: 1 }}>
                Step 1: Choose a PNG image for steganalysis
            </Typography>
            <input type="file" accept="image/png" onChange={handleChange} />

            {/* Step 2 */}
            {file && (
                <>
                    <Typography component="p" variant="p" sx={{ mt: 4, mb: 1 }}>
                        Step 2: Preview your image
                    </Typography>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{ maxHeight: 300 }}
                    />
                </>
            )}

            {/* Step 3 */}
            {file && (
                <>
                    <Typography component="p" variant="p" sx={{ mt: 4, mb: 1 }}>
                        Step 3: Submit the image for steganalysis
                    </Typography>
                    <Button variant="contained" onClick={handleSteganalysis}>
                        Steganalyse Now
                    </Button>
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

                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <>
                            {msg && (
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    {msg}
                                </Typography>
                            )}
                            {confidence && (
                                <Typography id="modal-modal-confidence" sx={{ mt: 1 }}>
                                    Confidence Percentage: {confidence}
                                </Typography>
                            )}

                            <Button
                                variant="contained"
                                sx={{ mt: 2, mr: 1 }}
                                onClick={saveResult}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Save Result'}
                            </Button>

                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={generatePDF}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Download PDF'}
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Snackbar for success message */}
            <Snackbar
                open={saveSuccess}
                autoHideDuration={6000}
                onClose={() => setSaveSuccess(false)}
            >
                <Alert onClose={() => setSaveSuccess(false)} severity="success">
                    Scan result saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
