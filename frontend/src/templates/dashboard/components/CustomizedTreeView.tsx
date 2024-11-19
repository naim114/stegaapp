import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { useTheme } from '@mui/material/styles';

type Color = 'blue' | 'green';

type TreeItemData = {
  id: string;
  label: string;
  color?: Color;
  children?: TreeItemData[];
};

const ITEMS: TreeItemData[] = [
  {
    id: '1',
    label: 'Website',
    children: [
      { id: '1.1', label: 'Home', color: 'green' },
      { id: '1.2', label: 'Pricing', color: 'green' },
      {
        id: '1.4',
        label: 'Blog',
        children: [
          { id: '1.4.1', label: 'Announcements', color: 'blue' },
          { id: '1.4.2', label: 'April lookahead', color: 'blue' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Store',
    children: [
      { id: '2.1', label: 'All products', color: 'green' },
      {
        id: '2.2',
        label: 'Categories',
        children: [
          { id: '2.2.1', label: 'Gadgets', color: 'blue' },
          { id: '2.2.2', label: 'Phones', color: 'blue' },
        ],
      },
    ],
  },
];

function CustomLabel({ color, label }: { color?: Color; label: string }) {
  const theme = useTheme();
  const colors = {
    blue: theme.palette.primary.main,
    green: theme.palette.success.main,
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {color && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: colors[color],
            marginRight: 1,
          }}
        />
      )}
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}

function renderTree(items: TreeItemData[]) {
  return items.map((item) => (
    <TreeItem
      key={item.id}
      nodeId={item.id}
      label={<CustomLabel color={item.color} label={item.label} />}
    >
      {item.children && renderTree(item.children)}
    </TreeItem>
  ));
}

export default function CustomizedTreeView() {
  return (
    <Card variant="outlined" sx={{ flexGrow: 1, padding: 2 }}>
      <CardContent>
        <Typography variant="h6">Product Tree</Typography>
        <TreeView
          defaultCollapseIcon={<span>-</span>}
          defaultExpandIcon={<span>+</span>}
          defaultExpanded={['1']}
        >
          {renderTree(ITEMS)}
        </TreeView>
      </CardContent>
    </Card>
  );
}
