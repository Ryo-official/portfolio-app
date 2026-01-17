import React, { useState, useEffect } from "react";

interface PortfolioImage {
  url: string;
  description: string;
}

interface Portfolio {
  id: number;
  title: string;
  description: string;
  category: string;
  year: number;
  images: PortfolioImage[];
}

const Work: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Portfolio | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fetchError, setFetchError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/works")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Portfolio[]) => {
        console.log("✅ Raw JSON:", data);
        setPortfolios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch portfolios:", err);
        setFetchError(true);
        setLoading(false);
      });
  }, []);

  // スワイプ処理
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!selected || touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return; // 小さい動きは無視

    if (diff > 0) {
      // 左スワイプ → 次の画像
      setSelectedIndex((prev) => (prev + 1) % selected.images.length);
    } else {
      // 右スワイプ → 前の画像
      setSelectedIndex((prev) =>
        prev === 0 ? selected.images.length - 1 : prev - 1
      );
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (loading) return <p className="text-center py-20">読み込み中です...</p>;
  if (fetchError)
    return <p className="text-center py-20 text-red-500">ポートフォリオデータを取得できません。</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Works</h2>

      {/* 一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {portfolios.map((p) => (
          <div
            key={p.id}
            className="bg-gray-800 text-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              setSelected(p);
              setSelectedIndex(0);
              setImageError(false);
            }}
          >
            {p.images?.length > 0 ? (
              <img
                src={p.images[0].url}
                alt={p.title}
                className="rounded mb-2 w-full h-48 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="bg-gray-700 w-full h-48 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-300 mt-1">
              {p.category}（{p.year}）
            </p>
          </div>
        ))}
      </div>

      {/* ポップアップ */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="relative bg-white rounded-lg flex flex-col md:flex-row max-w-7xl w-full">
            {/* 閉じる */}
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded z-50"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            {/* 左：説明 */}
            <div className="md:w-1/3 p-4 flex flex-col justify-start">
              <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
              <p className="mb-4">{selected.images[selectedIndex]?.description}</p>
            </div>

            {/* 右：画像（スワイプ対応） */}
            <div
              className="md:w-2/3 p-4 flex flex-col items-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* サムネイル */}
              <div className="flex gap-2 mb-2 overflow-x-auto w-full">
                {selected.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`thumb-${idx}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer flex-shrink-0 border-2 ${
                      idx === selectedIndex ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setImageError(false);
                    }}
                    onError={() => setImageError(true)}
                  />
                ))}
              </div>

              {/* メイン画像 */}
              <div className="rounded w-full h-[80vh] flex items-center justify-center bg-gray-100">
                {imageError ? (
                  <p className="text-red-500 text-center px-4">画像を取得できません。</p>
                ) : (
                  <img
                    src={selected.images[selectedIndex]?.url}
                    alt={selected.title}
                    className="rounded max-h-[60vh] object-contain w-full transition-all duration-300"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
