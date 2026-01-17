import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// ==== 型定義 ====
interface Portfolio {
  id: number;
  title: string;
  category: string;
  description: string;
}

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category_id: number;
}

interface SkillCategory {
  id: number;
  name: string;
  skills: Skill[];
}

// ==== コンポーネント ====
const AdminDashboard: React.FC = () => {
  const location = useLocation();
  // 遷移元タブを復元（なければ portfolio）
  const [activeTab, setActiveTab] = useState<"portfolio" | "skills">(
    location.state?.activeTab ?? "portfolio"
  );
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==== データ取得 ====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [portfolioRes, skillsRes] = await Promise.all([
          fetch("http://localhost:8080/api/works"),
          fetch("http://localhost:8080/api/skillCategories"),
        ]);

        if (!portfolioRes.ok || !skillsRes.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const portfolioData = await portfolioRes.json();
        const skillsData = await skillsRes.json();

        setPortfolios(portfolioData);
        setSkillCategories(skillsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePortfolio = async (id: number) => {
    const ok = window.confirm("このポートフォリオを削除しますか？\n関連する画像もすべて削除されます。");
    if (!ok) return;
  
    try {
      const res = await fetch(`http://localhost:8080/api/works/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }
  
      // state から削除
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };  

  const handleDeleteSkillCategory = async (id: number) => {
    const ok = window.confirm("このスキルを削除しますか？");
    if (!ok) return;
  
    try {
      const res = await fetch(`http://localhost:8080/api/skillCategory/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }
  
      // state から削除
      setSkillCategories((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };  

  // ==== ローディング・エラー ====
  if (loading) return <div className="text-center py-16">読み込み中です...</div>;
  if (error) return <div className="text-red-600 text-center py-16">{error}</div>;

  // ==== JSX ====
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">管理ダッシュボード</h1>
        <Link
          to="/admin/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ログアウト
        </Link>
      </div>

      {/* タブ切り替え */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-2 rounded ${
            activeTab === "portfolio" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ポートフォリオ一覧
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2 rounded ${
            activeTab === "skills" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          スキル一覧
        </button>
      </div>

      {/* ======== ポートフォリオ一覧 ======== */}
      {activeTab === "portfolio" && (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">ポートフォリオ一覧</h2>
            <Link
              to="/admin/portfolio/add"
              state={{ activeTab }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              新規追加
            </Link>
          </div>

          <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border">タイトル</th>
                  <th className="p-3 border">カテゴリ</th>
                  <th className="p-3 border">説明</th>
                  <th className="p-3 border w-[160px] text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3 border break-words">
                      {p.title}
                    </td>

                    <td className="p-3 border break-words">
                      {p.category}
                    </td>

                    <td className="p-3 border break-words">
                      {p.description}
                    </td>

                    <td className="p-3 border">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/portfolio/edit/${p.id}`}
                          state={{ activeTab }}
                          className="w-[60px] text-center bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                        >
                          編集
                        </Link>

                        <button
                          onClick={() => handleDeletePortfolio(p.id)}
                          className="w-[60px] bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      )}

      {/* ======== スキル一覧 ======== */}
      {activeTab === "skills" && (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">スキル一覧</h2>
            <Link
              to="/admin/skills/add"
              state={{ fromTab: activeTab }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              新規追加
            </Link>
          </div>

          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">カテゴリ</th>
                <th className="p-3 border">スキル一覧</th>
                <th className="p-3 border w-[160px] text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {skillCategories.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 border font-semibold">{c.name || "（未設定）"}</td>
                  <td className="p-3 border">
                    {c.skills.length > 0 ? (
                      c.skills.map((s) => (
                        <span
                          key={s.id}
                          className="inline-block bg-gray-100 px-2 py-1 mr-2 mb-1 rounded"
                        >
                          {s.name} ({s.proficiency}%)
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">スキル未登録</span>
                    )}
                  </td>
                  <td className="p-3 border">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/skills/edit/${c.id}`}
                          state={{ activeTab }}
                          className="w-[60px] text-center bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDeleteSkillCategory(c.id)}
                          className="w-[60px] bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
