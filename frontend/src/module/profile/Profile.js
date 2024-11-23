import React, { useState } from 'react';
import { Box, Avatar, Stack, TextField, Button } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';

const ProfilePage = () => {
    // State for name, email, and avatar image URL
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [avatar, setAvatar] = useState('/static/images/avatar/1.jpg');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            {/* Profile Section */}
            <Stack direction="row" spacing={4} sx={{ marginBottom: 4 }}>
                <Avatar
                    alt="User Avatar"
                    src={avatar}
                    sx={{ width: 100, height: 100 }}
                />
                <Stack spacing={1} sx={{ flex: 1 }}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                </Stack>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ height: 100 }}
                >
                    <CameraAlt />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        hidden
                    />
                </Button>
            </Stack>
        </Box>
    );
};

export default ProfilePage;
