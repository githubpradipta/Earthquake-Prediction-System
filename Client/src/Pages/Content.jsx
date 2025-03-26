import React, { useState } from "react";
import axios from "axios";
import LocationIcon from "../assets/icons/LocationIcon";

export default function Content() {
  const [eqLevel, setEqLevel] = useState("");
  const [magnitude, setMagnitude] = useState("");
  const [place, setPlace] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const manageInput = (e) => {
    setPlace(e.target.value);
  }
  const submitData = () => {
    setIsSubmit(true);
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?components=locality:${place}&key=AIzaSyBNDBUxJypU7-zBUgfsEOl0ohltK4I7B64`)
      .then((res) => {
        setAddress(res.data.results[0].formatted_address)
        let location = res.data.results[0].geometry.location;
        let lat = location.lat.toFixed(2);
        let long = location.lng.toFixed(2);
        // console.log(lat,long);

        axios.post(`http://localhost:5000/prediction`, { lat, long, depth: 4 })
          .then((res) => {
            setIsSubmit(false);
            let mag = res.data.magnitude;
            setMagnitude(mag);

            if(mag <= 4) setEqLevel("Week Zone")
            else if(mag >= 5 && mag<6) setEqLevel("Moderate Zone")
            else setEqLevel("Strong Zone")
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
      <div className="outter bg-gradient-to-b from-gray-800 to-slate-700 h-screen bg--200 flex justify-center items-center">
        {
          magnitude == "" ?
            <>
              <div className="box w-full bg-blue-300 mx-12 py-10 px-2 flex flex-col items-center border border-blue-400 rounded-xl">
                <div className="text text-center mb-15 px-4">
                  <h1 className="font-bold text-3xl mb-5">Search by Place Name</h1>
                  <p className="text-sm">Get the most accurate prediction of earthquake and let know if the place is earthquake probable place or not</p>
                </div>
                <div className="input w-full flex flex-col md:flex-row items-center justify-center gap-3 px-3">
                  <input
                    className="border w-full border-blue-500 bg-sky-200 outline-0 rounded-md mb-5 md:mb-0 px-3 py-3 
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
            
              <div className="box text-gray-300 w-full mx-8 py-5 px-3 flex flex-col justify-center">
                <div className="upper flex mb-10">
                  <LocationIcon />
                  <h1 className="locationName text-md font-normal ml-2">{address}</h1>
                </div>
                <div className="body mt-5 w-full flex flex-col items-center">
                  <div className="top text-center mb-10">
                    <h1 className="text-2xl font-semibold mb-3">Strong</h1>
                    <p className="fonst-semibold text-xs px-13 font-medium">Will have major damage if earthquake comes</p>
                  </div>
                  <div className="mid flex flex-col items-center">
                  <div className="magnitude text-8xl font-bold my-5">{magnitude}.7</div>
                  <div className="level text-sm font-semibold">{eqLevel}</div>
                  </div>
                  
                </div>
              </div>
            </>
        }

      </div>

    </>
  );
}

