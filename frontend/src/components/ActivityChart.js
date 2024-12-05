import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { getAllLogs } from '../model/log'

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function getDaysInLast30() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  }
  return dates.reverse();
}

export default function ActivityChart() {
  const theme = useTheme();
  const [logData, setLogData] = React.useState([]);
  const [totalLogs, setTotalLogs] = React.useState(0);
  const [percentageChange, setPercentageChange] = React.useState(0);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  React.useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const logs = await getAllLogs();

        const logsCount = {};
        logs.forEach(log => {
          const date = new Date(log.date).toISOString().split('T')[0];
          logsCount[date] = (logsCount[date] || 0) + 1;
        });

        const dates = getDaysInLast30();
        const data = dates.map(date => logsCount[date] || 0);

        setLogData(data);
        setTotalLogs(logs.length);

        // Calculate percentage change
        const lastDay = data[data.length - 1] || 0;
        const previousTotal = data.slice(0, data.length - 1).reduce((sum, val) => sum + val, 0);
        setPercentageChange(((lastDay / (previousTotal || 1)) * 100).toFixed(1));
      } catch (error) {
        console.error('Error fetching logs for chart:', error);
      }
    };

    fetchActivityLogs();
  }, []);


  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Activities
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalLogs.toLocaleString()}
            </Typography>
            <Chip size="small" color="success" label={`${percentageChange}%`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Logs per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: getDaysInLast30(),
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: 'logs',
              label: 'Logs',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: logData,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-logs': {
              fill: "url('#logs')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.main} id="logs" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
