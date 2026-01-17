// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full">
      {/* ==================== Top部分 ==================== */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center bg-blue-100 px-4">
        <motion.h1
          className="text-7xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ryo Lab!
        </motion.h1>
        <motion.p
          className="text-2xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Ryo Engineering Laboratory
        </motion.p>
        {/* アイコン画像 */}
        <div className="flex flex-wrap justify-center gap-6">
          <img
            src="/flask.png"
            alt="Flask"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </section>

      {/* ==================== About This Page ==================== */}
      <section className="min-h-screen flex flex-col justify-center bg-white px-6">
        <h2 className="text-6xl font-extrabold text-center mb-10">
          About This Page
        </h2>
        <p className="max-w-3xl mx-auto text-center text-gray-700 leading-relaxed text-lg">
          このサイトは、私のポートフォリオやスキルをまとめたページです。
          Webエンジニアとしての活動、制作した作品、そして学んだ知識を共有することを目的としています。
          最新の技術を使った開発事例や学習過程も掲載しています。
          ぜひご覧いただき、私のスキルや経験をご確認ください。
          継続的な学習と挑戦を大切にしています。
        </p>
      </section>

      {/* ==================== About Me ==================== */}
      <section className="min-h-screen flex flex-col justify-center bg-gray-100 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* アイコン */}
          <div className="flex-shrink-0 mb-8">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover"
            />
          </div>
          {/* 自己紹介文 */}
          <div className="flex-1">
            <h2 className="text-6xl font-extrabold text-center mb-8">
              About Me
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-lg">
              都会より田舎が好きで、自然や離島を旅することが趣味です。<br />
              カメラ撮影や温泉めぐりが好きで、観光地を深く考察することが得意です。<br />
              エンジニアとしては、React・TypeScriptを中心にWebアプリを構築しています。<br />
              新しい技術を学ぶことに前向きで、情報発信にも力を入れています。<br />
              「人と話すのが好き」なので、チームでの開発にもやりがいを感じます。
            </p>
            {/* QiitaとGitHubリンク */}
            <div className="text-sm text-gray-500 mt-2">
              <a
                href="https://qiita.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4 hover:underline"
              >
                Qiita
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </div>
            <Link
              to="/about"
              className="inline-block mt-6 text-blue-600 hover:underline"
            >
              もっと見る →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
