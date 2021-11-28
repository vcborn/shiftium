import type { GetServerSideProps, NextPage } from "next";

import nookies from "nookies";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Clock from "react-live-clock";
import {
  DownloadIcon,
  BriefcaseIcon,
  ClockIcon,
  LogoutIcon,
  LibraryIcon,
} from "@heroicons/react/solid";
import Head from "next/head";

import { firebaseConfig, logout } from "../lib/utils";
import { firebaseAdmin } from "../lib/firebaseAdmin";
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
} from "firebase/firestore";
import axios from "axios";
import { CSVLink } from "react-csv";

const formatDate = (dt: Date) => {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  return y + "-" + m + "-" + d;
};

export type timeList = {
  date: string;
  startTime: string;
  endTime: string;
};

const DashboardPage: NextPage<{ uid: string; email: string }> = ({
  uid,
  email,
}) => {
  const router = useRouter();

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore();

  const onLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getData = async () => {
    const subCol = collection(db, "shift", formatDate(new Date()), uid);
    const docRef = doc(subCol, "1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        date: docSnap.data().date,
        startTime: docSnap.data().startTime,
        endTime: docSnap.data().endTime,
      };
    } else {
      await setDoc(docRef, {
        date: formatDate(new Date()),
        startTime: "HH時mm分dd秒",
        endTime: "HH時mm分dd秒",
      });
      return {
        date: "YYYY-MM-DD",
        startTime: "HH時mm分dd秒",
        endTime: "HH時mm分dd秒",
      };
    }
  };

  const setData = () => {
    getData().then((result) => {
      if (process.browser) {
        if (document.getElementById("startTime")) {
          document.getElementById("startTime")!.textContent = result.startTime;
        }
        if (document.getElementById("endTime")) {
          document.getElementById("endTime")!.textContent = result.endTime;
        }
        if (
          document.getElementById("startTime")?.textContent !== "HH時mm分dd秒"
        ) {
          document
            .getElementById("startButton")
            ?.setAttribute("disabled", "true");
        } else {
          document
            .getElementById("endButton")
            ?.setAttribute("disabled", "true");
        }
        if (
          document.getElementById("endTime")?.textContent !== "HH時mm分dd秒"
        ) {
          document
            .getElementById("endButton")
            ?.setAttribute("disabled", "true");
        }
      }
    });
  };

  const setStartTime = async () => {
    let time = new Date().toLocaleTimeString("en-GB");
    const subCol = collection(db, "shift", formatDate(new Date()), uid);
    await updateDoc(doc(subCol, "1"), {
      startTime: time,
    });
    if (process.browser) {
      document.getElementById("startButton")?.setAttribute("disabled", "true");
      document.getElementById("endButton")?.setAttribute("disabled", "false");
    }
    setData();
  };

  const setEndTime = async () => {
    let time = new Date().toLocaleTimeString("en-GB");
    const subCol = collection(db, "shift", formatDate(new Date()), uid);
    await updateDoc(doc(subCol, "1"), {
      endTime: time,
    });
    if (process.browser) {
      document.getElementById("endButton")?.setAttribute("disabled", "true");
    }
    setData();
  };

  setData();

  const [timeListData, setAllData] = useState<timeList[]>([]);

  const GetAllData = async () => {
    let i = 0;
    let allData: timeList[] = [];
    while (i <= 30) {
      let dt = new Date();
      let minus = dt.setDate(dt.getDate() - i);
      const subCol = collection(db, "shift", formatDate(dt), uid);
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
  };

  const send2Discord = async (status: string) => {
    const hookUrl = process.env.DISCORD_WEBHOOK_URL || "";
    const config = {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    };
    const postData = {
      username: "出退勤管理",
      content: email + "さんが" + status + "しました！",
    };
    const res = await axios.post(hookUrl, postData, config);
  };

  const showAdmin = () => {
    router.push("/admin/");
  };

  useEffect(() => {
    GetAllData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <Head>
        <title>Dashboard | Shiftium</title>
      </Head>
      <header className="bg-blue-900 text-white py-5">
        <div className="mx-5 flex justify-between flex-wrap">
          <h1 className="text-xl">Shiftium</h1>
          <div>
            <button onClick={showAdmin}>
              <LibraryIcon className="duration-200 inline-block w-6 hover:opacity-70 mr-3" />
            </button>
            <button onClick={onLogout}>
              <LogoutIcon className="duration-200 inline-block w-6 hover:opacity-70" />
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-lg mx-auto">
        <div className="bg-white px-8 py-5 rounded-lg mt-10">
          <div className="flex flex-col justify-center items-center">
            <p className=" text-3xl font-bold mt-10 mb-5">
              <Clock format={"YYYY年MM月DD日 HH時mm分ss秒"} ticking={true} />
            </p>
            <table className="mb-10">
              <tbody>
                <tr>
                  <td>
                    <ClockIcon className="inline-block w-6" />
                    出勤時刻：
                  </td>
                  <td id="startTime"></td>
                </tr>
                <tr>
                  <td>
                    <ClockIcon className="inline-block w-6" />
                    退勤時刻：
                  </td>
                  <td id="endTime"></td>
                </tr>
              </tbody>
            </table>
            <div className="grid grid-cols-2 gap-4 w-full text-xl mb-10">
              <button
                className="h-32 bg-green-600 duration-200 hover:bg-green-800 disabled:bg-green-800 text-white rounded-lg flex items-center justify-center"
                onClick={() => {
                  {
                    setStartTime();
                  }
                  {
                    send2Discord("出勤");
                  }
                }}
                id="startButton"
              >
                <BriefcaseIcon className="inline-block w-6" />
                出勤
              </button>
              <button
                className="h-32 bg-red-500 duration-200 hover:bg-red-700 disabled:bg-red-700 text-white rounded-lg flex items-center justify-center"
                onClick={() => {
                  {
                    setEndTime();
                  }
                  {
                    send2Discord("退勤");
                  }
                }}
                id="endButton"
              >
                <LogoutIcon className="inline-block w-6" />
                退勤
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 px-8 py-5 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-3">直近30日の記録</h2>
          <CSVLink
            data={timeListData}
            className="bg-blue-900 inline-block h-10 w-10 rounded-full duration-200 hover:opacity-70 shadow-md"
          >
            <DownloadIcon className="rounded-full text-white p-2" />
          </CSVLink>
          <div id="list">
            {timeListData.map(({ date, startTime, endTime }) => (
              <div className="mt-5" key={date}>
                <h4 className="font-bold text-lg">{date}</h4>
                <p>
                  出勤時刻：<span>{startTime}</span>
                </p>
                <p>
                  退勤時刻：<span>{endTime}</span>
                </p>
                <hr className="mt-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const session = cookies.session || "";

  // セッションIDを検証して、認証情報を取得する
  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      uid: user.uid,
      email: user.email,
    },
  };
};

export default DashboardPage;
