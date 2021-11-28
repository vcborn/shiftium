import type { GetServerSideProps, NextPage } from "next";

import nookies from "nookies";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  DownloadIcon,
  LogoutIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import Head from "next/head";

import { firebaseConfig, logout } from "../../lib/utils";
import { firebaseAdmin } from "../../lib/firebaseAdmin";
import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { CSVLink } from "react-csv";

const formatDate = (dt: Date) => {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  return y + "-" + m + "-" + d;
};

export type userList = {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  disabled: boolean;
};

export type timeList = {
  date: string;
  startTime: string;
  endTime: string;
};

const AdminPage: NextPage<{ user: "" }> = ({ user }) => {
  const router = useRouter();

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore();

  const onLogout = async () => {
    await logout();
    router.push("/login");
  };

  const [timeListData, setAllData] = useState<timeList[]>([]);
  const allUser: userList[] = JSON.parse(user);
  // value = selectしたメールアドレス
  const [value, setValue] = useState("");
  let nowID = "";

  const GetAllData = async () => {
    if (nowID !== "") {
      let i = 0;
      let allData: timeList[] = [];
      while (i <= 30) {
        let dt = new Date();
        let minus = dt.setDate(dt.getDate() - i);
        const subCol = collection(db, "shift", formatDate(dt), nowID);
        const docRef = doc(subCol, "1");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = {
            date: docSnap.data().date,
            startTime: docSnap.data().startTime,
            endTime: docSnap.data().endTime,
          };
          allData.push(data);
        }
        i++;
      }

      setAllData(allData);
    }
  };

  const setData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    nowID = e.target.value;
    setValue(e.target.value);
    GetAllData();
  };

  const showMain = () => {
    router.push("/dashboard");
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <Head>
        <title>Admin | Shiftium</title>
      </Head>
      <header className="bg-blue-900 text-white py-5">
        <div className="mx-5 flex justify-between flex-wrap">
          <h1 className="text-xl">Shiftium</h1>
          <div>
            <button onClick={showMain}>
              <UserCircleIcon className="duration-200 inline-block w-6 hover:opacity-70 mr-3" />
            </button>
            <button onClick={onLogout}>
              <LogoutIcon className="duration-200 inline-block w-6 hover:opacity-70" />
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto">
        <div className="bg-white px-8 py-5 rounded-lg mt-10">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold">管理画面</h2>
            <select
              value={value}
              onChange={(e) => {
                setData(e);
              }}
              className="rounded-md border-gray-200 shadow-md duration-200 my-3 px-5 py-2 hover:opacity-70"
            >
              <option value="">メールアドレスを選択...</option>
              {allUser.map(({ uid, email }) => (
                <option key={uid} value={uid}>
                  {email}
                </option>
              ))}
            </select>
            <CSVLink
              data={timeListData}
              className="bg-blue-900 inline-block h-10 w-10 rounded-full duration-200 hover:opacity-70 shadow-md"
            >
              <DownloadIcon className="rounded-full text-white p-2" />
            </CSVLink>
            <table className="my-6 border-collapse w-full text-center">
              <tbody>
                <tr className="border-b border-gray-400">
                  <td className="w-20 md:w-40">日付</td>
                  <td>出勤時刻</td>
                  <td>退勤時刻</td>
                </tr>
                {timeListData.map(({ date, startTime, endTime }) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{startTime}</td>
                    <td>{endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const session = cookies.session || "";

  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  const fetchAllAuthUsers = async () => {
    const result: admin.auth.UserRecord[] = [];

    let listUsersResult = await firebaseAdmin.auth().listUsers(1000);
    result.push(...listUsersResult.users);

    while (!!listUsersResult.pageToken) {
      listUsersResult = await firebaseAdmin
        .auth()
        .listUsers(1000, listUsersResult.pageToken);
      result.push(...listUsersResult.users);
    }
    return result;
  };
  const oneuser = JSON.stringify(await fetchAllAuthUsers());

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getIdTokenResult(user).then((idTokenResult: any) => {
        if (!idTokenResult.claims.admin) {
          Router.replace("/dashboard");
        }
      });
    }
  });

  return {
    props: {
      user: oneuser,
    },
  };
};

export default AdminPage;
