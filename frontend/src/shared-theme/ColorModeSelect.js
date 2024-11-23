import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Select
      value={mode}
      onChange={(event) => setMode(event.target.value)}
      SelectDisplayProps={{
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="light"><LightModeIcon /></MenuItem>
      <MenuItem value="dark"><DarkModeIcon /></MenuItem>
    </Select>
  );
}
