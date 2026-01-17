import React from "react";

const AboutMe: React.FC = () => {
  const careers = [
    {
      date: "2018.4〜",
      title: "大学進学",
      description: "地元北海道の文系私立大学に進学。専攻は英米文化学科。",
    },
    {
      date: "2021.4〜",
      title: "就職活動",
      description:
        "旅行業界を志望していたがコロナ発生により断念。衰退しない業界を考えIT業界へ。PHPで自主制作を行った経験をきっかけにIT業界を目指す。",
    },
    {
      date: "2022.4〜2025.6",
      title: "就職",
      description: "地元のSES企業に就職。札幌から大阪へ異動し以下の案件を担当。",
      projects: [
        {
          name: "マテハン企業向け 製品自動格納システム（パッケージ開発）",
          scale: "規模：5名",
          phase: "担当フェーズ：詳細設計〜リリース（メンバー）",
          tech: "フロント：独自ツール / バックエンド：Java / DB：Oracle",
          note: "新卒初案件。月残業70時間の厳しい状況であったが責任感でやり遂げる。"
        },
        {
          name: "電気・通信企業向け 顧客契約管理システム（保守開発）",
          scale: "規模：15名",
          phase: "担当フェーズ：詳細設計〜リリース（メンバー）",
          tech: "フロント：Vue.js / バックエンド：Java, C言語 / DB：Oracle",
          note: "保守業務に携わることでシステム構成全体を理解し、ITリテラシーを向上。"
        },
      ]
    },
    {
      date: "2025.7〜",
      title: "転職",
      description: "別SES企業へ転職（現職）。",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-12">About Me</h1>
      <div className="max-w-4xl mx-auto relative border-l-4 border-yellow-500">
        {careers.map((career, index) => (
          <div key={index} className="mb-10 ml-6">
            {/* Timeline Dot */}
            <div className="absolute -left-3 w-6 h-6 bg-yellow-500 rounded-full border-4 border-white"></div>
            {/* Content */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <span className="text-sm text-gray-500">{career.date}</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-1">
                {career.title}
              </h3>
              <p className="mt-2 text-gray-700">{career.description}</p>

              {/* 案件カード */}
              {career.projects && (
                <div className="mt-4 space-y-4">
                  {career.projects.map((project, pIndex) => (
                    <div
                      key={pIndex}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                    >
                      <h4 className="font-semibold text-gray-800">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.scale}</p>
                      <p className="text-sm text-gray-600">{project.phase}</p>
                      <p className="text-sm text-gray-600">{project.tech}</p>
                      <p className="text-sm text-gray-700 mt-1">{project.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
