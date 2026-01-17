// src/pages/SkillsPage.tsx
import React, { useEffect, useState } from "react";

// ======================
// 型定義
// ======================
interface Skill {
  id?: number;
  name: string;
  description?: string;
  proficiency: number; // 習熟度 (0〜100)
}

interface SkillCategory {
  id?: number;
  name: string;
  description?: string;
  skills: Skill[];
}

// ======================
// 円形プログレスバー
// ======================
const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      {/* 背景円 */}
      <circle
        stroke="#4B5563"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* 進捗円 */}
      <circle
        stroke="#22C55E"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      {/* パーセンテージ表示 */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-white"
        fontSize="18"
        fill="#fff"
      >
        {percentage}%
      </text>
    </svg>
  );
};

// ======================
// スキルカード
// ======================
const SkillCard: React.FC<Skill> = ({ name, proficiency }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative flex items-center justify-center">
        <CircularProgress percentage={proficiency} />
      </div>
      <span className="text-white font-semibold mt-6 text-lg text-center">{name}</span>
    </div>
  );
};

// ======================
// Skills ページ本体
// ======================
const SkillsPage: React.FC = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/skillCategories")
      .then((res) => {
        if (!res.ok) throw new Error("スキルデータの読み込みに失敗しました");
        return res.json();
      })
      .then((data: SkillCategory[]) => {
        setSkillCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-white text-center py-16">読み込み中です...</div>;
  if (error)
    return <div className="text-red-500 text-center py-16">{error}</div>;

  return (
    <div className="bg-gray-900 w-full min-h-screen">
      <h1 className="text-5xl font-bold text-center text-white py-16">
        技術スタック
      </h1>

      <div className="w-full max-w-6xl mx-auto px-4">
        {skillCategories.map((category) => (
          <div key={category.id || category.name} className="mb-16">
            <h2 className="text-3xl font-extrabold text-yellow-400 mb-8 text-center">
              {category.name || "未分類"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
              {category.skills.map((skill) => (
                <SkillCard key={skill.id || skill.name} {...skill} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="text-white max-w-2xl mx-auto text-center space-y-3 pb-16 text-base sm:text-lg">
        <p>
          <span className="font-bold">30%:</span> 自己学習の範囲
        </p>
        <p>
          <span className="font-bold">60%:</span> 一人称で扱うことができる
        </p>
        <p>
          <span className="font-bold">100%:</span> プロジェクト全体を推進できる
        </p>
      </div>
    </div>
  );
};

export default SkillsPage;
