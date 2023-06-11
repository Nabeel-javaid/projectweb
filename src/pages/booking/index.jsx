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
import Link from "next/link";

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
        {sortedData.map((item, index) => (
          <div className="w-[70%] h-60 border-orange-500 shadow-lg rounded m-7 flex flex-row p-4" key={item.id}>
            {/* Logo */}
            <div id="logo" className="w-[18%] flex items-center justify-center border-r px-4 solid">
              <Image src={logos[item.index % logos.length]} width={200} />
            </div>
            {/* Departure and Arrival Times */}
            <div id="times" className="w-[50%] flex flex-row items-center justify-start p-4 ml-5 border-r">
              {/* ... */}
            </div>
            {/* Pricing and Booking */}
            <div id="pricing" className="flex-col justify-between p-4 h-full flex w-[20%]">
              {/* ... */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default
