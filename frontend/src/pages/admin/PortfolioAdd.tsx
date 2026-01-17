// src/pages/admin/PortfolioAdd.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

const PortfolioAdd: React.FC = () => {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<Portfolio>({
    id: 0,
    title: "",
    description: "",
    category: "",
    year: new Date().getFullYear(),
    images: [],
  });

  const [saving, setSaving] = useState(false);

  // ===== 基本情報 =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPortfolio({ ...portfolio, [name]: value });
  };

  // ===== 画像追加 =====
  const handleAddImage = () => {
    setPortfolio({
      ...portfolio,
      images: [...portfolio.images, { url: "", description: "" }],
    });
  };

  // ===== 画像削除 =====
  const handleRemoveImage = (index: number) => {
    const images = portfolio.images.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, images });
  };

  // ===== ファイルアップロード =====
  const handleUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("画像アップロードに失敗しました");
      return;
    }

    const data = await res.json();
    const images = [...portfolio.images];
    images[index].url = data.url;
    setPortfolio({ ...portfolio, images });
  };

  // ===== 画像説明 =====
  const handleImageDesc = (index: number, value: string) => {
    const images = [...portfolio.images];
    images[index].description = value;
    setPortfolio({ ...portfolio, images });
  };

  // ===== 保存 =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("http://localhost:8080/api/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(portfolio),
    });

    setSaving(false);

    if (!res.ok) {
      alert("登録に失敗しました");
      return;
    }

    // 返却されたJSONの取得は、resから取り出す必要がある
    const data = await res.json();
    alert("ポートフォリオを登録しました");
    navigate(`/admin/portfolio/edit/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">ポートフォリオ新規追加</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* タイトル */}
          <div>
            <label className="block font-semibold mb-1">タイトル</label>
            <input
              name="title"
              value={portfolio.title}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block font-semibold mb-1">説明</label>
            <textarea
              name="description"
              value={portfolio.description}
              onChange={handleChange}
              className="w-full border rounded p-3 h-32"
              required
            />
          </div>

          {/* カテゴリ / 年 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">カテゴリ</label>
              <input
                name="category"
                value={portfolio.category}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="w-32">
              <label className="block font-semibold mb-1">制作年</label>
              <input
                type="number"
                name="year"
                value={portfolio.year}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* ===== 画像管理 ===== */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-lg">画像</label>
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                ＋ 画像追加
              </button>
            </div>

            {portfolio.images.map((img, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUpload(e.target.files[0], index);
                    }
                  }}
                  className="mb-2"
                />

                {img.url && (
                  <img
                    src={`http://localhost:8080${img.url}`}
                    alt="preview"
                    className="w-48 h-48 object-cover rounded mb-2 border"
                  />
                )}

                <textarea
                  placeholder="画像の説明"
                  value={img.description}
                  onChange={(e) => handleImageDesc(index, e.target.value)}
                  className="w-full border rounded p-3 h-24"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-600 mt-2"
                >
                  ✕ 削除
                </button>
              </div>
            ))}
          </div>

          {/* ボタン */}
          <div className="flex justify-between pt-4">
            <Link
              to="/admin"
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              戻る
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {saving ? "保存中..." : "登録"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioAdd;
