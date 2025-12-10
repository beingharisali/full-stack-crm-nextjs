import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
	const pathname = usePathname();

	const isActive = (path) => {
		return pathname === path;
	};

	return (
		<div className="hidden md:flex flex-col w-64 bg-gray-800 rounded-2xl h-[80vh]">
			<div className="flex flex-col flex-1 overflow-y-auto">
				<nav className="flex flex-col flex-1 overflow-y-auto bg-linear-to-b from-gray-700 to-blue-500 px-2 py-4 gap-10 rounded-2xl">
					<div>
						<Link
							href="/welcome"
							className={`flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 rounded-2xl ${
								isActive("/welcome") ? "bg-gray-700" : ""
							}`}>
							Dashboard
						</Link>
					</div>
					<div className="flex flex-col flex-1 gap-3">
						<Link
							href="/properties/property"
							className={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl ${
								isActive("/properties/property") ? "bg-gray-700" : ""
							}`}>
							Home
						</Link>
						<Link
							href="/profile"
							className={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl ${
								isActive("/profile") ? "bg-gray-700" : ""
							}`}>
							Profile
						</Link>
						<Link
							href="/lead"
							className={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl ${
								isActive("/lead") ? "bg-gray-700" : ""
							}`}>
							Lead
						</Link>
						<Link
							href="/agent"
							className={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl ${
								isActive("/agent") ? "bg-gray-700" : ""
							}`}>
							Agents
						</Link>
						<Link
							href="/properties"
							className={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl ${
								isActive("/properties") ? "bg-gray-700" : ""
							}`}>
							Properties
						</Link>
						<Link
							href="/transactions"
							className={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl ${
								isActive("/transactions") ? "bg-gray-700" : ""
							}`}>
							Transactions
						</Link>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;