import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const handleLogin = async (e)=>{

    e.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        {email,password}
      );

      alert("Login successful");

      /* Save token */
      localStorage.setItem("token", res.data.token);

      /* Save user info */
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email
        })
      );

      window.location.href="/admin";

    }
    catch(error){

      alert("Login failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      {/* Background Gradient */}

<div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-200"></div>


{/* Floating Blobs */}

<div className="absolute w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20 top-10 left-10"></div>

<div className="absolute w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl flex overflow-hidden w-[900px]">
      

        {/* LEFT PANEL */}

        <div className="w-1/2 bg-blue-600 text-white p-10 flex flex-col justify-between">

          <div>

            <h2 className="text-2xl font-bold mb-6">
              SmartOffice
            </h2>

            <h1 className="text-3xl font-bold leading-snug">
              Elevate your workspace management.
            </h1>

            <p className="mt-4 text-blue-100">
              Seamlessly control your enterprise resources
              with our next-generation admin suite.
            </p>

          </div>

          <div className="text-sm text-blue-200 mt-10">
            Trusted by 500+ global teams
          </div>

        </div>


        {/* RIGHT PANEL */}

        <div className="w-1/2 p-10">

          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-sm mb-8">
            Please enter your admin credentials to continue.
          </p>


          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}

            <div>

              <label className="text-sm text-gray-600">
                Email Address
              </label>

              <input
                type="email"
                placeholder="admin@smartoffice.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="mt-2 w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>


            {/* Password */}

            <div>

              <label className="text-sm text-gray-600">
                Password
              </label>

              <div className="relative mt-2">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <span
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >

                  {showPassword ? <FaEyeSlash/> : <FaEye/>}

                </span>

              </div>

            </div>


            {/* Login Button */}

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              Sign In to Dashboard →
            </button>

          </form>


          <div className="text-center text-sm text-gray-500 mt-6">

            <a href="/" className="hover:text-blue-600">
              ← Back to Homepage
            </a>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AdminLogin;