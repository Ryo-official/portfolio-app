// src/pages/admin/PortfolioEdit.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

interface WorkImage {
  id?: number;
  url: string;
  description: string;
}

interface Portfolio {
  id: number;
  title: string;
  description: string;
  category: string;
  year: number;
  images: WorkImage[];
}

const PortfolioEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // 遷移元タブ（AdminDashboard から渡される）
  const activeTab =
    (location.state as { activeTab?: "portfolio" | "skills" })?.activeTab ??
    "portfolio";
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
  
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchWork(id);
        setPortfolio(data);
      } catch (err: any) {
        alert("データ取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);  

  const fetchWork = async (id: string) => {
    const res = await fetch(`http://localhost:8080/api/works/${id}`);
    if (!res.ok) {
      throw new Error("データ取得に失敗しました");
    }
    return res.json();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!portfolio) return;
  
    const { name, value } = e.target;
  
    setPortfolio({
      ...portfolio,
      [name]: name === "year" ? Number(value) : value,
    });
  };  

  const handleAddImage = () => {
    if (!portfolio) return;
    setPortfolio({
      ...portfolio,
      images: [...portfolio.images, { url: "", description: "" }],
    });
  };

  const handleRemoveImage = (index: number) => {
    if (!portfolio) return;
    const updated = portfolio.images.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, images: updated });
  };

  // ✅ 画像アップロード処理
  const handleFileUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok && portfolio) {
      const updated = [...portfolio.images];
      updated[index].url = data.url;
      setPortfolio({ ...portfolio, images: updated });
    } else {
      alert("アップロードに失敗しました");
    }
  };

  const handleImageChange = (index: number, field: keyof WorkImage, value: string) => {
    if (!portfolio) return;
    const updated = [...portfolio.images];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio({ ...portfolio, images: updated });
  };

  const handleSubmit = async () => {

    if (!portfolio || !id) return;

    try {
      const res = await fetch(`http://localhost:8080/api/works/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolio),
      });
  
      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }
  
      alert("更新が完了しました");
  
      const updated = await fetchWork(id);
      setPortfolio(updated);
  
    } catch (err) {
      alert("更新に失敗しました");
    }
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">ポートフォリオ編集</h2>

        <form onSubmit={(e) => {e.preventDefault();handleSubmit();}} className="space-y-4">
          {/* 基本情報 */}
          <div>
            <label className="block mb-1 font-semibold">タイトル</label>
            <input
              type="text"
              name="title"
              value={portfolio.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">説明</label>
            <textarea
              name="description"
              value={portfolio.description}
              onChange={handleChange}
              className="w-full border rounded p-3 h-32"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">カテゴリ</label>
            <input
              type="text"
              name="category"
              value={portfolio.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">制作年</label>
            <input
              type="number"
              name="year"
              value={portfolio.year}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* ====== 画像アップロード ====== */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-lg">画像一覧</label>
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                ＋ 画像追加
              </button>
            </div>

            {portfolio.images.map((img, index) => (
              <div key={index} className="border p-4 mb-4 rounded-lg bg-gray-50">
                {/* ファイル選択 */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, index);
                  }}
                  className="mb-3"
                />

                {/* プレビュー */}
                {img.url && (
                  <img
                    src={img.url}
                    alt="preview"
                    className="w-48 h-48 object-cover rounded mb-3 border"
                  />
                )}

                {/* 説明入力 */}
                <textarea
                  placeholder="この画像の説明を入力"
                  value={img.description}
                  onChange={(e) => handleImageChange(index, "description", e.target.value)}
                  className="w-full border rounded p-3 h-24"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-600 mt-2 hover:text-red-800"
                >
                  ✕ この画像を削除
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Link
              to="/admin"
              onClick={() =>
                navigate("/admin", { state: { activeTab } })
              }
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              戻る
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioEdit;
