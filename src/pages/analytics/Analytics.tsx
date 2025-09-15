import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	TrendingUp,
	DollarSign,
	Users,
	Ticket,
	Download,
	Filter,
	RefreshCw,
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	PieLabelRenderProps,
} from "recharts";
import { Button } from "../../components/ui/Button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "../../components/ui/Card";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { formatCurrency, formatNumber } from "../../lib/utils";

export const Analytics: React.FC = () => {
	const [timeRange, setTimeRange] = useState("7d");
	const [selectedEvent, setSelectedEvent] = useState("all");
	const [isMobile, setIsMobile] = useState(false);

	// Detect screen size for responsive adjustments
	useEffect(() => {
		const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);
		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	// Mock analytics data
	const salesData = [
		{ date: "Jan 1", sales: 1200, revenue: 24000 },
		{ date: "Jan 2", sales: 1800, revenue: 36000 },
		{ date: "Jan 3", sales: 2200, revenue: 44000 },
		{ date: "Jan 4", sales: 1600, revenue: 32000 },
		{ date: "Jan 5", sales: 2800, revenue: 56000 },
		{ date: "Jan 6", sales: 3200, revenue: 64000 },
		{ date: "Jan 7", sales: 2400, revenue: 48000 },
	];

	const ticketTypeData = [
		{ name: "General", value: 18500, color: "#3B82F6" },
		{ name: "VIP", value: 3200, color: "#10B981" },
		{ name: "Premium", value: 1800, color: "#F59E0B" },
		{ name: "Student", value: 950, color: "#EF4444" },
	];

	const eventPerformance = [
		{
			event: "Summer Music Festival",
			revenue: 2777500,
			tickets: 18500,
			conversion: 12.5,
		},
		{
			event: "Tech Innovation Summit",
			revenue: 434850,
			tickets: 1450,
			conversion: 8.3,
		},
		{
			event: "Food & Wine Expo",
			revenue: 156000,
			tickets: 780,
			conversion: 15.2,
		},
		{
			event: "Art Gallery Opening",
			revenue: 89500,
			tickets: 358,
			conversion: 22.1,
		},
	];

	const totalStats = {
		totalRevenue: 4250000,
		totalTickets: 21700,
		averageOrderValue: 195.85,
		conversionRate: 12.5,
	};

	const renderCustomLabel = (props: PieLabelRenderProps): string => {
		console.log(props); // Inspect all props, including percent
		const labelName = props.name ?? "Unknown";
		const labelPercent =
			props.percent !== undefined
				? (props.percent * 100).toFixed(0)
				: "0";
		return `${labelName}: ${labelPercent}%`;
	};

	const iLabel = (props: any) => {
		const { name, percent } = props as {
			name?: string;
			percent?: number;
		};

		return (
			<text fontSize={isMobile ? 10 : 12}>
				{name ?? "Unknown"}{" "}
				{percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ""}
			</text>
		);
	};

	return (
		<div className="space-y-4 md:space-y-6 p-3 md:p-4 lg:p-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
						Analytics
					</h1>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
						Track your event performance and sales metrics
					</p>
				</div>

				<div className="flex flex-wrap gap-2 w-full sm:w-auto mt-3 sm:mt-0">
					<Button
						variant="outline"
						size={isMobile ? "sm" : "md"}
						responsive={isMobile}
						leftIcon={<RefreshCw className="w-4 h-4" />}
						className="flex-1 sm:flex-none"
					>
						Refresh
					</Button>
					<Button
						variant="outline"
						size={isMobile ? "sm" : "md"}
						responsive={isMobile}
						leftIcon={<Download className="w-4 h-4" />}
						className="flex-1 sm:flex-none"
					>
						Export
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex flex-wrap gap-2">
					<select
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}
						className="text-sm rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white py-2 px-3"
					>
						<option value="7d">Last 7 days</option>
						<option value="30d">Last 30 days</option>
						<option value="90d">Last 90 days</option>
						<option value="1y">Last year</option>
					</select>

					<select
						value={selectedEvent}
						onChange={(e) => setSelectedEvent(e.target.value)}
						className="text-sm hidden md:flex rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white py-2 px-3"
					>
						<option value="all">All Events</option>
						<option value="1">Summer Music Festival</option>
						<option value="2">Tech Innovation Summit</option>
					</select>

					<Button
						variant="outline"
						size={isMobile ? "sm" : "md"}
						responsive={isMobile}
						leftIcon={<Filter className="w-4 h-4" />}
					>
						More Filters
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
				<StatsCard
					title="Total Revenue"
					value={formatCurrency(totalStats.totalRevenue)}
					change={{
						value: 15,
						type: "increase",
						period: "last month",
					}}
					icon={DollarSign}
					color="green"
					compact={isMobile}
				/>
				<StatsCard
					title="Tickets Sold"
					value={formatNumber(totalStats.totalTickets)}
					change={{
						value: 8,
						type: "increase",
						period: "last month",
					}}
					icon={Ticket}
					color="blue"
					compact={isMobile}
				/>
				<StatsCard
					title="Avg Order Value"
					value={formatCurrency(totalStats.averageOrderValue)}
					change={{
						value: 5,
						type: "decrease",
						period: "last month",
					}}
					icon={Users}
					color="yellow"
					compact={isMobile}
				/>
				<StatsCard
					title="Conversion Rate"
					value={`${totalStats.conversionRate}%`}
					change={{
						value: 2,
						type: "increase",
						period: "last month",
					}}
					icon={TrendingUp}
					color="green"
					compact={isMobile}
				/>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
				{/* Sales Trend */}
				<Card className="overflow-hidden">
					<CardHeader className="pb-2 md:pb-3">
						<CardTitle className="text-lg md:text-xl">
							Sales Trend
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="h-64 sm:h-72 md:h-80">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={salesData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="date"
										tick={{ fontSize: isMobile ? 10 : 12 }}
									/>
									<YAxis
										tick={{ fontSize: isMobile ? 10 : 12 }}
									/>
									<Tooltip
										formatter={(value, name) => [
											name === "sales"
												? formatNumber(value as number)
												: formatCurrency(
														value as number
												  ),
											name === "sales"
												? "Tickets"
												: "Revenue",
										]}
									/>
									<Area
										type="monotone"
										dataKey="revenue"
										stackId="1"
										stroke="#3B82F6"
										fill="#3B82F6"
										fillOpacity={0.6}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Ticket Distribution */}
				<Card className="overflow-hidden">
					<CardHeader className="pb-2 md:pb-3">
						<CardTitle className="text-lg md:text-xl">
							Ticket Distribution
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="h-64 sm:h-72 md:h-80">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={ticketTypeData}
										cx="50%"
										cy="50%"
										outerRadius={isMobile ? 70 : 100}
										dataKey="value"
										label={iLabel}
									>
										{ticketTypeData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value) =>
											formatNumber(value as number)
										}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Event Performance Table */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg md:text-xl">
						Event Performance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[600px]">
							<thead>
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm">
										Event
									</th>
									<th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm">
										Revenue
									</th>
									<th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm">
										Tickets
									</th>
									<th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm">
										Conversion
									</th>
								</tr>
							</thead>
							<tbody>
								{eventPerformance.map((event, index) => (
									<motion.tr
										key={event.event}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
									>
										<td className="py-3 px-2 sm:px-4">
											<div className="font-medium text-gray-900 dark:text-white text-sm">
												{isMobile &&
												event.event.length > 20
													? `${event.event.substring(
															0,
															20
													  )}...`
													: event.event}
											</div>
										</td>
										<td className="py-3 px-2 sm:px-4 text-right font-semibold text-gray-900 dark:text-white text-sm">
											{isMobile
												? formatCurrency(event.revenue)
												: formatCurrency(event.revenue)}
										</td>
										<td className="py-3 px-2 sm:px-4 text-right text-gray-600 dark:text-gray-400 text-sm">
											{formatNumber(event.tickets)}
										</td>
										<td className="py-3 px-2 sm:px-4 text-right">
											<span
												className={`font-medium text-sm ${
													event.conversion >= 15
														? "text-green-600"
														: event.conversion >= 10
														? "text-yellow-600"
														: "text-red-600"
												}`}
											>
												{event.conversion}%
											</span>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
