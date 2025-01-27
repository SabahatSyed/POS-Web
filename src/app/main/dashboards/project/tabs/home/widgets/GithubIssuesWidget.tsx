import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { useAppSelector } from 'app/store';
import { ApexOptions } from 'apexcharts';
import { selectWidgets } from '../../../store/widgetsSlice';
import GithubIssuesDataType from '../../../types/GithubIssuesDataType';

/**
 * The GithubIssuesWidget widget.
 */
function GithubIssuesWidget() {
	const theme = useTheme();
	const [awaitRender, setAwaitRender] = useState(true);
	const [tabValue, setTabValue] = useState(0);
	const widgets = useAppSelector(selectWidgets);
	const { overview, series, ranges, labels } = widgets?.githubIssues as GithubIssuesDataType;
	const currentRange = Object.keys(ranges)[tabValue];
	const dummyData = {
    overview: {
      totalIssues: 120,
      openIssues: 45,
      closedIssues: 75,
    },
    issues: [
      {
        id: 1,
        title: "Issue 1",
        status: "open",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-02",
      },
      {
        id: 2,
        title: "Issue 2",
        status: "closed",
        createdAt: "2023-01-03",
        updatedAt: "2023-01-04",
      },
      {
        id: 3,
        title: "Issue 3",
        status: "open",
        createdAt: "2023-01-05",
        updatedAt: "2023-01-06",
      },
    ],
  };
	const chartOptions: ApexOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'line',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: [theme.palette.primary.main, theme.palette.secondary.main],
		labels,
		dataLabels: {
			enabled: true,
			enabledOnSeries: [0],
			background: {
				borderWidth: 0
			}
		},
		grid: {
			borderColor: theme.palette.divider
		},
		legend: {
			show: false
		},
		plotOptions: {
			bar: {
				columnWidth: '50%'
			}
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 0.75
				}
			}
		},
		stroke: {
			width: [3, 0]
		},
		tooltip: {
			followCursor: true,
			theme: theme.palette.mode
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			axisTicks: {
				color: theme.palette.divider
			},
			labels: {
				style: {
					colors: theme.palette.text.secondary
				}
			},
			tooltip: {
				enabled: false
			}
		},
		yaxis: {
			labels: {
				offsetX: -16,
				style: {
					colors: theme.palette.text.secondary
				}
			}
		}
	};

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
					Github Issues Summary
				</Typography>
				<div className="mt-12 sm:mt-0 sm:ml-8">
					<Tabs
						value={tabValue}
						onChange={(ev, value: number) => setTabValue(value)}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="-mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: (
								<Box
									sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							)
						}}
					>
						{Object.entries(ranges).map(([key, label]) => (
							<Tab
								className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
								disableRipple
								key={key}
								label={label}
							/>
						))}
					</Tabs>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-24 w-full mt-32 sm:mt-16">
				<div className="flex flex-col flex-auto">
					<Typography
						className="font-medium"
						color="text.secondary"
					>
						New vs. Closed
					</Typography>
					<div className="flex flex-col flex-auto">
						<ReactApexChart
							className="flex-auto w-full"
							options={chartOptions}
							series={series[currentRange]}
							height={320}
						/>
					</div>
				</div>
				<div className="flex flex-col">
					<Typography
						className="font-medium"
						color="text.secondary"
					>
						Overview
					</Typography>
					<div className="flex-auto grid grid-cols-4 gap-16 mt-24">
						<div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-indigo-50 text-indigo-800">
							<Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
								{dummyData.overview.openIssues}
							</Typography>
							<Typography className="mt-4 text-sm sm:text-lg font-medium">New Issues</Typography>
						</div>
						<div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-green-50 text-green-800">
							<Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
								{dummyData.overview.closedIssues}
							</Typography>
							<Typography className="mt-4 text-sm sm:text-lg font-medium">Closed</Typography>
						</div>
						<Box
							sx={{
								backgroundColor: (_theme) =>
									_theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
						>
							<Typography className="text-5xl font-semibold leading-none tracking-tight">
								{}
							</Typography>
							<Typography className="mt-4 text-sm font-medium text-center">Fixed</Typography>
						</Box>
						<Box
							sx={{
								backgroundColor: (_theme) =>
									_theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
						>
							<Typography className="text-5xl font-semibold leading-none tracking-tight">
							</Typography>
							<Typography className="mt-4 text-sm font-medium text-center">Won't Fix</Typography>
						</Box>
						<Box
							sx={{
								backgroundColor: (_theme) =>
									_theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
						>
							<Typography className="text-5xl font-semibold leading-none tracking-tight">
							</Typography>
							<Typography className="mt-4 text-sm font-medium text-center">Re-opened</Typography>
						</Box>
						<Box
							sx={{
								backgroundColor: (_theme) =>
									_theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
						>
							<Typography className="text-5xl font-semibold leading-none tracking-tight">
							</Typography>
							<Typography className="mt-4 text-sm font-medium text-center">Needs Triage</Typography>
						</Box>
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default memo(GithubIssuesWidget);
