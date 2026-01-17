import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
            />
            <h1 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
              Ryo_Lab
            </h1>
          </Link>

          {/* ナビゲーション */}
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/skills" className="hover:underline">Skills</Link>
              </li>
              <li>
                <Link to="/works" className="hover:underline">Works</Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">About me</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 各ページがここに差し込まれる */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2025 My Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
