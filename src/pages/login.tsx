import type { FormEvent } from "react";

import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { login } from "../lib/utils"; // 上記で実装したファイル

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    await login(email, password); // email・passwordを使ってログイン
    router.push("/dashboard"); // ダッシュボードページへ遷移させる
  };

  return (
    <div className="bg-gray-100 h-screen">
      <Head>
        <title>Login | Shiftium</title>
      </Head>
      <header className="bg-blue-900 text-white py-5">
        <div className="mx-5 flex justify-between flex-wrap">
          <h1 className="text-xl">Shiftium</h1>
        </div>
      </header>
      <div className="container max-w-lg mx-auto">
        <div className="bg-white px-8 py-5 rounded-lg mt-10">
          <h2 className="text-2xl font-bold pb-2 text-center">ログイン</h2>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col my-3">
              <label htmlFor="email" className="mr-2 my-1">
                メールアドレス
              </label>
              <input
                id="email"
                value={email}
                placeholder="john.doe@example.com"
                className="border border-transparent bg-gray-100 rounded-md h-12 px-3 py-1 focus:outline-none focus:bg-white focus:border-blue-900"
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mr-2 my-1">
                パスワード
              </label>

              <input
                id="password"
                type="password"
                value={password}
                className="border border-transparent bg-gray-100 rounded-md h-12 px-3 py-1 focus:outline-none focus:bg-white focus:border-blue-900"
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div className="text-center mt-5">
              <button
                type="submit"
                className="bg-blue-900 text-white rounded-md shadow-md px-4 py-1.5 duration-200 hover:opacity-70"
              >
                ログイン
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
