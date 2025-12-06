"use client";

import React, { useEffect, useState } from "react";
import { fetchDashboardStats, fetchRecentActivity } from "@/services/dashboard";
import { BarChart, BookOpen, Users, Wallet } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            const dashboardStats = await fetchDashboardStats();
            const recentActivity = await fetchRecentActivity();

            setStats(dashboardStats);
            setActivity(recentActivity);
        }
        loadData();
    }, []);


    const getRelativeTime = (isoDate: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(isoDate).getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <>
            <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
                Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <Card icon={<Users />} title="Total Users" value={stats?.users} />
                <Card icon={<BookOpen />} title="Total Inquiries" value={stats?.bookings} />
                <Card icon={<BarChart />} title="Fleet Listings" value={stats?.yachts} />
                <Card icon={<Wallet />} title="Total Revenue" value={`₹${stats?.revenue}`} />
            </div>

            <div className="mt-10 rounded-xl bg-white p-6 shadow dark:bg-gray-dark">
                <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
                    Recent Activity
                </h2>

                <ul className="space-y-3">
                    {activity.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-center justify-between border-b border-stroke pb-3 dark:border-dark-3"
                        >
                            <span className="text-dark dark:text-white">{item.message}</span>
                            <span className="text-sm text-dark-5 dark:text-dark-6">
                                {getRelativeTime(item.time)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

function Card({ icon, title, value }: any) {
    return (
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-dark">
            <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/20 p-4 text-primary">{icon}</div>
                <div>
                    <p className="text-sm text-dark-4 dark:text-dark-6">{title}</p>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">{value}</h2>
                </div>
            </div>
        </div>
    );
}