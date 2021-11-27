import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Welcome | Shiftium</title>
      </Head>
      <header className="bg-blue-900 text-white py-5">
        <div className="mx-5 flex justify-between flex-wrap">
          <h1 className="text-xl">Shiftium</h1>
        </div>
      </header>
      <div className="container max-w-5xl mx-auto">
        <div className="bg-white px-8 py-5 rounded-lg mt-10">
          <h2 className="text-2xl font-bold pb-2">Welcome to Shiftium!</h2>
          <p>
            Shiftiumへようこそ。
            <br />
            Shiftiumはシンプルで簡単な勤怠管理システムです。
          </p>
          <Link href="/login">
            <a className="bg-blue-900 text-white px-5 py-2 inline-block my-10 rounded-md shadow-md duration-200 hover:opacity-70">
              ログイン
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
