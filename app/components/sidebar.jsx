import Link from "next/link";

const Sidebar = () => {

	return (
		<div className="hidden md:flex flex-col w-64 bg-gray-800 rounded-2xl h-[80vh]">
			<div className="flex flex-col flex-1 overflow-y-auto">
				<nav className="flex flex-col flex-1 overflow-y-auto bg-linear-to-b from-gray-700 to-blue-500 px-2 py-4 gap-10 rounded-2xl">
					<div>
						<a
							href="#"
							className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
							Dashboard
						</a>
					</div>
					<div className="flex flex-col flex-1 gap-3">
						<a
							href="#"
							className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
							Home
						</a>
						<Link
							href="/profile"
							className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
							Profile
						</Link>
						<a
							href="/lead"
							className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
							Lead
						</a>
						<a
							href="/agent"
							className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
							Agents
						</a>
						<Link
							href="#"
							className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
							Comments
						</Link>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;