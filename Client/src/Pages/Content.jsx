import React, { useState } from "react";
import axios from "axios";
import LocationIcon from "../assets/icons/LocationIcon";
import TargetIcon from "../assets/icons/TargetIcon";

export default function Content() {
  const [data, setData] = useState({mag:"",level:"",message:""});
  const [coordinates, setCoordinates] = useState({lat:"",long:""});
  
  const [theme,setTheme] = useState("");
  const [place, setPlace] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const API_KEY = import.meta.env.VITE_LOCATION_API;

  const manageInput = (e) => {
    setPlace(e.target.value);
  }
  const submitData = () => {
    setIsSubmit(true);
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?components=locality:${place}&key=${API_KEY}`)
      .then((res) => {
        setAddress(res.data.results[0].formatted_address)
        let location = res.data.results[0].geometry.location;
        let lat = location.lat.toFixed(2);
        let long = location.lng.toFixed(2);

        setCoordinates(coordinates=>({...coordinates,lat,long}))
        // console.log(lat,long);

        axios.post(`http://localhost:5000/prediction`, { lat, long, depth: 4 })
          .then((res) => {
            setIsSubmit(false);
            let mag = res.data.magnitude;
            let level = res.data.level;
            let message = res.data.message;
            setData(data=>({...data,mag,level,message}));

            if(level == "Strong") setTheme("red")
            else if(level == "Moderate") setTheme("yellow")
            else setTheme("green")
          })
          .catch(() => {
            setIsSubmit(false);
            Swal.fire({
              title: "Server Error",
              text: "Please check internet connection",
              icon: "error"
            });
          })

      })
      .catch(() => {
        setIsSubmit(false);
        Swal.fire({
          title: "Server Error",
          text: "Place does not exist",
          icon: "error"
        });
      })


  }
  


  return (
    <>
      <div className="outter px-5 bg-gradient-to-b from-gray-800 to-slate-700 h-screen bg--200 flex flex-col justify-center items-center">
        {
          data.mag == "" ?
            <>
              <div className="box w-full lg:w-1/2 mx-12 py-10 px-2 flex flex-col items-center border border-blue-400 rounded-xl">
                <div className="text text-gray-300 text-center mb-15 px-4">
                  <h1 className="font-bold text-3xl mb-5">Search by Place Name</h1>
                  <p className="text-sm px-10">Get the most accurate prediction of earthquake </p>
                </div>
                <div className="input w-full flex flex-col md:flex-row items-center justify-center gap-3 px-3">
                  <input
                    className="border w-full border-blue-500 bg-sky-200 outline-0 rounded-md px-3 py-3 
             placeholder:text-gray text-gray font-semibold 
             transition-all duration-300 ease-in-out"
                    placeholder="Enter Place Name"
                    type="text"
                    name="place"
                    onChange={manageInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitData();
                      }
                    }}
                  />
                  <button className="hover:bg-blue-500 bg-blue-400 text-white py-2.5 w-30 text-sm font-semibold rounded-md cursor-pointer
            transition-all duration-300 ease-in-out"
                    onClick={submitData}>
                    {isSubmit ? "Loading..." : "Sumbit"}
                  </button>

                </div>
              </div>
            </>
            :
            <>
                 <div className="input w-full lg:w-1/2 flex items-center justify-center gap-3 ">
                  <input
                    className="border w-full border-blue-500 bg-sky-200 outline-0 rounded-md md:mb-0 px-3 py-3 
             placeholder:text-gray text-gray font-semibold 
             transition-all duration-300 ease-in-out"
                    placeholder="Enter Place Name"
                    type="text"
                    name="place"
                    onChange={manageInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitData();
                      }
                    }}
                  />
                  <button className="hover:bg-blue-500 bg-blue-400 text-white py-3.5 w-30 text-sm font-semibold rounded-md cursor-pointer
            transition-all duration-300 ease-in-out"
                    onClick={submitData}>
                    {isSubmit ? "Loading..." : "Sumbit"}
                  </button>

                </div>

                <div className="box text-gray-300 w-full lg:w-1/2 my-10 py-5 px-3 flex flex-col justify-center border-3 border-gray-600 rounded-xl">
                  <div className="upper flex mb-10 lg:mb-2">
                    <LocationIcon />
                    <h1 className="locationName text-md font-normal ml-2">{address}</h1>
                  </div>
                  <div className="body mt-5 w-full flex flex-col items-center">
                    <div className="top text-center mb-10 lg:mb-3">
                      <h1 className={`text-2xl text-${theme}-400 font-semibold mb-3`}>{data.level}</h1>
                      <p className="fonst-semibold text-xs px-13 font-medium">{data.message}</p>
                    </div>
                    <div className="mid flex flex-col items-center">
                      <div className={`magnitude text-8xl text-${theme}-400 font-bold my-5`}>{data.mag}</div>
                      <div className={`level text-sm font-semibold text-${theme}-400`}>{data.level} level</div>
                    </div>

                  </div>
                  <div className="lower mt-15 flex flex-col items-start gap-2">
                    <div className="icon"><TargetIcon/></div>
                    <p className="font-bold px-5">{coordinates.lat}, {coordinates.long}</p>
                  </div>
                </div>
              </>
        }

            </div>

      </>
      );
}

