import Link from "next/link";
import {
	Home,
	User,
	Users,
	Briefcase,
	CreditCard,
	LayoutDashboard,
} from "lucide-react";

const Sidebar = () => {
	const navItems = [
		{
			title: "Dashboard",
			href: "/welcome",
			icon: <LayoutDashboard size={20} />,
		},
		{
			title: "Home",
			href: "/home",
			icon: <Home size={20} />,
		},
		{
			title: "Profile",
			href: "/profile",
			icon: <User size={20} />,
		},
		{
			title: "Lead",
			href: "/lead",
			icon: <Users size={20} />,
		},
		{
			title: "Agents",
			href: "/agent",
			icon: <Briefcase size={20} />,
		},
		{
			title: "Transactions",
			href: "/transactions",
			icon: <CreditCard size={20} />,
		},
	];

	return (
		<div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 sticky top-0 h-screen">
			{/* Logo Section */}
			<div className="flex items-center justify-center h-16 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
				<div className="text-xl font-bold text-white">Dashboard</div>
			</div>

			{/* Navigation Links - Scrollable if content overflows */}
			<nav className="flex-1 py-4 px-3 overflow-y-auto">
				<div className="space-y-1">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center px-3 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
							<div className="mr-3">{item.icon}</div>
							<span className="font-medium">{item.title}</span>
						</Link>
					))}
				</div>
			</nav>
		</div>
	);
};

export default Sidebar;
