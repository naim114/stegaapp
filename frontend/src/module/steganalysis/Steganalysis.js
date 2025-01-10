import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, IconButton, Modal, CircularProgress, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addScanResult } from '../../model/scan';
import { getCurrentUser } from '../../services/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const malwareInfo = {
    clean: {
        description: "The file is clean and does not contain any malicious payloads.",
        prevention: "No action needed.",
        removal: "No action needed.",
        impact: "No risk to your system or data.",
        symptoms: "None.",
        examples: "Not applicable.",
        references: "Not applicable."
    },
    eth: {
        description: "The file contains Ethereum-based malware, potentially targeting cryptocurrency wallets.",
        prevention: "Avoid downloading files from untrusted sources. Use antivirus software.",
        removal: "Use a reliable antivirus tool to remove the malware. Change wallet credentials if affected.",
        impact: "May result in theft of cryptocurrency or compromised wallet security.",
        symptoms: "Unexpected transactions, unauthorized access to wallet, or slow system performance.",
        examples: "Clipboard hijacking malware that replaces copied wallet addresses.",
        references: "https://www.cert.gov/crypto-malware-prevention"
    },
    html: {
        description: "The file contains HTML-based malware, often used for phishing or injecting malicious scripts.",
        prevention: "Enable browser security settings and avoid opening suspicious links or files.",
        removal: "Scan your system with updated antivirus software. Remove any unauthorized browser extensions.",
        impact: "May lead to credential theft, data leakage, or unauthorized system access.",
        symptoms: "Unusual pop-ups, redirected browser pages, or unauthorized browser extensions.",
        examples: "Phishing pages mimicking login screens for popular websites.",
        references: "https://www.cybersecurity-guide.org/html-malware-guide"
    },
    js: {
        description: "The file contains JavaScript malware, which can execute harmful scripts on your system.",
        prevention: "Disable JavaScript on untrusted websites and ensure your browser is up-to-date.",
        removal: "Run a full system scan with antivirus software. Clear browser cache and cookies.",
        impact: "Can steal sensitive information, exploit vulnerabilities, or install additional malware.",
        symptoms: "Unusual browser behavior, unauthorized transactions, or pop-ups.",
        examples: "Cryptojacking scripts that mine cryptocurrency using your device's resources.",
        references: "https://www.cybersecure.com/javascript-malware-overview"
    },
    ps: {
        description: "The file contains PowerShell malware, often used for executing malicious commands.",
        prevention: "Disable PowerShell execution for untrusted scripts. Use endpoint protection tools.",
        removal: "Run a specialized anti-malware scan to remove malicious scripts.",
        impact: "Allows attackers to execute commands, access sensitive data, or spread malware.",
        symptoms: "High CPU usage, unauthorized system changes, or unexpected PowerShell windows.",
        examples: "Fileless malware attacks leveraging PowerShell scripts.",
        references: "https://docs.microsoft.com/en-us/powershell/security-best-practices"
    },
    url: {
        description: "The file contains URL-based malware, redirecting users to malicious websites.",
        prevention: "Avoid clicking on unknown URLs. Use web filters and security extensions.",
        removal: "Clear browser history and scan for malware. Update your browser security settings.",
        impact: "Can lead to phishing attacks, drive-by downloads, or ransomware infections.",
        symptoms: "Redirected browsing, suspicious network activity, or slow system performance.",
        examples: "Links leading to fake login pages or automatic malware downloads.",
        references: "https://www.sans.org/url-malware-protection"
    }
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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

    const handleSteganalysis = async () => {
        if (!file) {
            alert('No file selected.');
            return;
        }

        handleOpen();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/classify', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error in API call');
            }

            const data = await response.json();
            const detectedClass = data.detected_class;
            const confidencePercentage = data.confidence;

            setResult(detectedClass);
            setConfidence(confidencePercentage);

            if (detectedClass !== 'clean') {
                setMsg(data.message); // Message comes from API
            } else {
                setMsg('The file is clean.');
            }
        } catch (error) {
            console.error('Error in steganalysis:', error);
            setMsg('Error analyzing the file. Please try again.');
        } finally {
            setLoading(false);
        }
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
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '2500px' } }}>
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
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <CircularProgress size={48} />
                        </Box>
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

                            {result && malwareInfo[result] && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6">Malware Details</Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Description:</strong> {malwareInfo[result].description}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Prevention:</strong> {malwareInfo[result].prevention}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Removal:</strong> {malwareInfo[result].removal}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Impact:</strong> {malwareInfo[result].impact}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Symptoms:</strong> {malwareInfo[result].symptoms}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Examples:</strong> {malwareInfo[result].examples}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>References:</strong> {malwareInfo[result].references}
                                    </Typography>
                                </Box>
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
