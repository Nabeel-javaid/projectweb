import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "utils/supabase";
import qatar from "../../components/logos/qatar.png";
import emirates from "../../components/logos/emirates.png";
import singapore from "../../components/logos/singapore.png";
import Image from "next/image";
import Day from "../../components/Day";
import Time from "../../components/Time";
import Lottie from "react-lottie";
import animationData from "../../components/lottie/arrow.json";
//import next link component
import Link from "next/link";
import AdminDashboard from "../admin/index";

const Index = ({ data }) => {
  const logos = [qatar, emirates, singapore];
  const [sortedData, setSortedData] = useState(data);
  const [sortDirection, setSortDirection] = useState("asc");

  const sortDataByPrice = () => {
    const sorted = [...sortedData].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setSortedData(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  //get the query params using nextjs router
  const router = useRouter();
  const { departureCity, arrivalCity, date } = router.query;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="h-[100vh]">
      <div className="w-full h-[30%] flex flex-col items-center justify-center">
        <div className="font-bold text-2xl leading-tight flex items-center justify-center text-slate-600 shadow-lg mr-auto p-8 mt-14 rounded-lg ml-72 border-orange-400 border-2">
          {data ? sortedData.length : "Loading"} Flights Available
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center h-auto">
        <div className="flex justify-center my-4">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded hover:bg-orange-700"
            onClick={sortDataByPrice}
          >
            Sort by Price ({sortDirection === "asc" ? "Low to High" : "High to Low"})
          </button>
        </div>
        {sortedData.map((item) => (
          <div className="w-[70%] h-60 border-orange-500 shadow-lg rounded m-7 flex flex-row p-4" key={item.id}>
            {/* Logo */}
            <div id="logo" className="w-[18%] flex items-center justify-center border-r px-4 solid">
              <Image src={logos[Math.floor(Math.random() * logos.length)]} width={200} />
            </div>
            {/* Departure and Arrival Times */}
            <div id="times" className="w-[50%] flex flex-row items-center justify-start p-4 ml-5 border-r">
              <div className="flex flex-col p-3 solid w-[35%] h-full font-medium">
                <div className="text-slate-500 text-xl">
                  <Day date={item.departure_date} />
                </div>
                <div className="text-3xl my-4">
                  <Time timestamp={item.departure_time} />
                </div>
                <div className="text-2xl text-slate-500">
                  {item.departure_airport.charAt(0).toUpperCase() +
                    item.departure_airport.slice(1)}
                </div>
              </div>
              <div className="w-[30%] flex items-center justify-center">
                <div className="w-full transform rotate-90">
                  <Lottie options={defaultOptions} width={100} height={100} />
                </div>
              </div>
              <div className="flex flex-col p-3 solid w-[35%] h-full font-medium">
                <div className="text-slate-500 text-xl">
                  <Day date={item.departure_date} />
                </div>
                <div className="text-3xl my-4">
                  <Time timestamp={item.arrival_time} />
                </div>
                <div className="text-2xl text-slate-500">
                  {item.arrival_airport.charAt(0).toUpperCase() +
                    item.arrival_airport.slice(1)}
                </div>
              </div>
            </div>
            {/* Pricing and Booking */}
            <div id="pricing" className="flex-col justify-between p-4 h-full flex w-[20%]">
              <div className="ml-2 mt-4 font-medium">Start From</div>
              <div className="text-3xl font-medium text-slate-800 flex flex-row">
                ${item.price}/<span className="flex text-base mt-3 text-slate-500">person</span>
              </div>
              <Link href={`/userDetails?departure_airport=${item.departure_airport}&arrival_airport=${item.arrival_airport}&price=${item.price}&departure_time=${item.departure_time}&departure_date=${item.departure_date}`}>
                <button className="text-xl font-medium flex justify-start p-3 rounded bg-orange-500 text-white w-auto text-center hover:bg-orange-700 cursor-pointer">
                  Book Flight
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

//write the getServerSideProps to fetch the data from supabase
export async function getServerSideProps(context) {
  let { departureCity, arrivalCity, date } = context.query;
  //log data
  console.log(departureCity, arrivalCity, date);
  //make cities lowercase
  departureCity = departureCity.toLowerCase();
  arrivalCity = arrivalCity.toLowerCase();

  //get the data from the supabase
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("departure_airport", departureCity)
    .eq("status", "Confirmed")
    .eq("arrival_airport", arrivalCity);
  // .eq('date', date)

  console.log(data);
  // <AdminDashboard>  </AdminDashboard>

  return {
    props: {
      data,
    },
  };
}
