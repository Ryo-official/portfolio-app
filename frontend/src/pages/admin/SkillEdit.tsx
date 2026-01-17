import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

type Skill = {
  id?: number;
  name: string;
  proficiency: number;
};

type SkillCategory = {
  id?: number;
  name: string;
  description: string;
  skills: Skill[];
};

const SkillEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab =
    (location.state as { activeTab?: "portfolio" | "skills" })?.activeTab ??
    "skills";

  const [skillCategory, setSkillCategory] =
    useState<SkillCategory | null>(null);
  const [loading, setLoading] = useState(true);

  // ===== 取得 =====
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchSkillCategory(id);
        setSkillCategory(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const fetchSkillCategory = async (id: string): Promise<SkillCategory> => {
    const res = await fetch(`http://localhost:8080/api/skillCategory/${id}`);
    if (!res.ok) throw new Error();
    return res.json();
  };

  // ===== 保存 =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !skillCategory) return;

    const res = await fetch(
      `http://localhost:8080/api/skillCategory/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillCategory),
      }
    );

    if (!res.ok) return;

    navigate("/admin", { state: { activeTab } });
  };

  // ===== Skill 操作 =====
  const handleDelete = (index: number) => {
    if (!skillCategory) return;
    const skills = [...skillCategory.skills];
    skills.splice(index, 1);
    setSkillCategory({ ...skillCategory, skills });
  };

  const handleAddSkill = () => {
    if (!skillCategory) return;
    setSkillCategory({
      ...skillCategory,
      skills: [...skillCategory.skills, { name: "", proficiency: 0 }],
    });
  };

  if (loading || !skillCategory) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-gray-100 p-10"
    >
      <h1 className="text-4xl font-bold mb-10 text-center">
        カテゴリ編集
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
            value={skillCategory.name}
            onChange={(e) =>
              setSkillCategory({ ...skillCategory, name: e.target.value })
            }
            className="w-full border p-3 rounded"
          />
        </label>

        {/* ===== スキル一覧 ===== */}
        <div className="space-y-6">
          {skillCategory.skills.map((skill, index) => (
            <div key={index} className="border rounded p-4">
              <label className="block mb-3">
                <span className="font-semibold block mb-1">
                  スキル名 <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={skill.name}
                  onChange={(e) => {
                    const skills = [...skillCategory.skills];
                    skills[index].name = e.target.value;
                    setSkillCategory({ ...skillCategory, skills });
                  }}
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
                    onChange={(e) => {
                      const skills = [...skillCategory.skills];
                      skills[index].proficiency = Number(e.target.value);
                      setSkillCategory({ ...skillCategory, skills });
                    }}
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

              {skillCategory.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
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
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ＋ スキル追加
          </button>
        </div>

        {/* ===== 操作ボタン ===== */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/admin", { state: { activeTab } })}
            className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            戻る
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </form>
  );
};

export default SkillEdit;
