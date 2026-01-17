// src/pages/admin/SkillAdd.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Skill = {
  name: string;
  proficiency: number;
};

type SkillCategory = {
  name: string;
  description: string;
  skills: Skill[];
};

const SkillAdd: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab =
    (location.state as { activeTab?: "portfolio" | "skills" })?.activeTab ??
    "skills";

  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<SkillCategory>({
    name: "",
    description: "",
    skills: [{ name: "", proficiency: 0 }],
  });

  // ===== スキル更新 =====
  const updateSkill = (
    index: number,
    key: keyof Skill,
    value: string | number
  ) => {
    const updated = [...category.skills];
    updated[index] = { ...updated[index], [key]: value };
    setCategory({ ...category, skills: updated });
  };

  const handleAddSkill = () => {
    setCategory({
      ...category,
      skills: [...category.skills, { name: "", proficiency: 0 }],
    });
  };

  const handleDeleteSkill = (index: number) => {
    const updated = category.skills.filter((_, i) => i !== index);
    setCategory({ ...category, skills: updated });
  };

  // ===== 保存 =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/skillCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) {
        return;
      }

      navigate("/admin", { state: { activeTab } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-gray-100 p-10"
    >
      <h1 className="text-4xl font-bold mb-10 text-center">
        スキルカテゴリ追加
      </h1>

      <div className="bg-white shadow rounded-lg p-8 w-full">
        {/* ===== カテゴリ名 ===== */}
        <label className="block mb-6">
          <span className="font-semibold block mb-2">
            カテゴリ名 <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            required
            value={category.name}
            onChange={(e) =>
              setCategory({ ...category, name: e.target.value })
            }
            className="w-full border p-3 rounded"
          />
        </label>

        {/* ===== スキル一覧 ===== */}
        <div className="space-y-6">
          {category.skills.map((skill, index) => (
            <div key={index} className="border rounded p-4">
              <label className="block mb-3">
                <span className="font-semibold block mb-1">
                  スキル名 <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(index, "name", e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block mb-3">
                <span className="font-semibold block mb-1">
                  習熟度
                </span>

                <div className="relative w-32">
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      updateSkill(
                        index,
                        "proficiency",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border p-2 pr-10 rounded bg-white"
                  >
                    {Array.from({ length: 101 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    %
                  </span>
                </div>
              </label>

              {category.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(index)}
                  className="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                >
                  削除
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ===== スキル追加 ===== */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ＋ スキル追加
          </button>
        </div>

        {/* ===== 操作ボタン ===== */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() =>
              navigate("/admin", { state: { activeTab } })
            }
            className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            戻る
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            保存
          </button>
        </div>
      </div>
    </form>
  );
};

export default SkillAdd;
