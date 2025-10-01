import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const loginAPI = `${import.meta.env.VITE_BASE_API}/users/login`;
  const registerAPI = `${import.meta.env.VITE_BASE_API}/users/register`;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin ? loginAPI : registerAPI;
      let body;

      if (isLogin) {
        body = {
            username: formData.username.includes("@") ? undefined : formData.username,
            email: formData.username.includes("@") ? formData.username : undefined,
            password: formData.password,
        };
      } else {
        body = new FormData();
        body.append("name", formData.name);
        body.append("username", formData.username);
        body.append("email", formData.email);
        body.append("password", formData.password);
        if (formData.avatar) body.append("avatar", formData.avatar);
      }

      const res = await fetch(url, {
        method: "POST",
        body: isLogin ? JSON.stringify(body) : body,
        headers: isLogin
          ? { "Content-Type": "application/json" }
          : undefined, 
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        alert(isLogin ? "Login successful 🎉" : "Registered successfully 🎉");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white via-blue-200 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg cursor-pointer"
              />
            </>
          )}

          {isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-900 text-white rounded-lg font-semibold hover:bg-indigo-800 transition duration-300"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-900 font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
