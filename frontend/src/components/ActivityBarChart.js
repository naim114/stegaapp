import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { getAllLogs } from '../model/log';

function categorizeLogs(logs) {
  const categories = {
    'Logged in': 0,
    'ERROR': 0,
    'Update profile': 0,
    'New user created': 0,
  };

  logs.forEach(log => {
    const message = (log.activity || '').toLowerCase(); // Use the 'activity' field
    console.log('Processing Log Message:', message); // Debug each log message
    if (message.includes('logged in')) {
      categories['Logged in']++;
    } else if (message.includes('error')) {
      categories['ERROR']++;
    } else if (message.includes('update profile')) {
      categories['Update profile']++;
    } else if (message.includes('new user created')) {
      categories['New user created']++;
    }
  });

  console.log('Processed Categories:', categories); // Debug categorized data
  return categories;
}


export default function ActivityBarChart() {
  const theme = useTheme();
  const [categorizedData, setCategorizedData] = React.useState({
    'Logged in': 0,
    'ERROR': 0,
    'Update profile': 0,
    'New user created': 0,
  });
  const [totalLogs, setTotalLogs] = React.useState(0);
  const [percentageChange, setPercentageChange] = React.useState(0);

  React.useEffect(() => {
    const fetchLogsAndCategorize = async () => {
      try {
        const logs = await getAllLogs();
        console.log('Fetched Logs:', logs); // Debug log for fetched logs
        console.log('Single Log Example:', logs[0]);

        if (!Array.isArray(logs)) {
          throw new Error('Invalid logs data format');
        }

        const categorized = categorizeLogs(logs);
        setCategorizedData(categorized);

        // Calculate totals
        const total = logs.length;
        setTotalLogs(total);

        // Example: Calculate percentage change (mock previous period as 30% less)
        const previousTotal = total * 0.7; // Adjust logic as needed
        const change = ((total - previousTotal) / (previousTotal || 1)) * 100;
        setPercentageChange(change.toFixed(1));
      } catch (error) {
        console.error('Error fetching or categorizing logs:', error);
      }
    };

    fetchLogsAndCategorize();
  }, []);

  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];

  const dataKeys = Object.keys(categorizedData);
  const dataValues = Object.values(categorizedData);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Log Activities
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
            <Chip
              size="small"
              color={percentageChange >= 0 ? 'success' : 'error'}
              label={`${percentageChange}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Breakdown of activities for the last period
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: dataKeys,
            },
          ]}
          series={[
            {
              id: 'log-activities',
              label: 'Log Activities',
              data: dataValues,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
