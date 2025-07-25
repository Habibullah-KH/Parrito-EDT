'use client';
import Link from "next/link";
import ButtonBorder from "../Buttons/Button_border/ButtonBorder";
import DashboardBanner from "./component/Dashboard banner/DashboardBanner";
import DashboardNavbar from "./component/DashboardNavbar/DashboardNavbar";

export default function Dashboard(){
    return (
        <>
            <div className="flex flex-col items-center justify-baseline mx-auto">

               <DashboardBanner/>

               <DashboardNavbar/>
          
            </div>
        </>
    );
}