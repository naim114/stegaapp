import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import modelPath from '../../assets/model/model.json';

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
    const [result, setResult] = React.useState(null);
    const [confidence, setConfidence] = React.useState(null);
    const [model, setModel] = React.useState(null);
    const [message, setMessage] = React.useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setResult(null);
        setConfidence(null);
    };

    React.useEffect(() => {
        // Fetch data from the Flask backend
        fetch('http://127.0.0.1:5000/api/test')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error fetching data:', error));

        const loadModel = async () => {
            try {
                // Set TensorFlow.js backend
                await tf.setBackend('webgl');
                await tf.ready();
                console.log('TensorFlow.js backend ready');

                // Load the model from the public folder
                const modelURL = '/model/model.json'; // Public folder path
                const loadedModel = await tf.loadGraphModel(process.env.PUBLIC_URL + modelURL);
                setModel(loadedModel);
                console.log('Model loaded successfully');
            } catch (error) {
                console.error('Error loading model:', error.message, error.stack);
            }
        };

        loadModel();
    }, []);


    function handleChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile));
        }
    }

    const handleSteganalysis = async () => {
        if (!file) {
            console.error('No file selected');
            return;
        }
        if (!model) {
            console.error('Model not loaded');
            return;
        }

        try {
            const img = new Image();
            img.src = file;
            img.onload = async () => {
                const tensor = tf.browser.fromPixels(img)
                    .resizeBilinear([224, 224])
                    .expandDims()
                    .div(255.0);

                console.log("Input tensor shape:", tensor.shape);

                const prediction = model.predict(tensor);
                const predictionData = await prediction.array(); // Use `array` to read data

                const classId = predictionData[0]; // Update based on your model output
                const confidence = predictionData[1]; // Update based on your model output

                setResult(`Class ${classId}`);
                setConfidence(`${(confidence * 100).toFixed(2)}%`);
                handleOpen();

                tensor.dispose();
            };
        } catch (error) {
            console.error('Error during inference:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h4" variant="h4" sx={{ mb: 1 }}>
                Steganalysis
            </Typography>

            <Typography component="p" variant="p" sx={{ mb: 3, fontWeight: 'bold' }}>
                {message}
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
                    {result && (
                        <>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Malicious Payload Type: {result}
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                                Confidence Percentage: {confidence}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
