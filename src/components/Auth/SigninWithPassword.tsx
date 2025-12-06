"use client";
import { EmailIcon } from "@/assets/icons";
import React, { useState, useEffect } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { loginHardcoded } from "@/utils/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye,  EyeOff } from 'lucide-react';

export default function SigninWithPassword() {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load stored credentials if "remember me" was used
  useEffect(() => {
    const saved = localStorage.getItem("rememberUser");

    if (saved) {
      const user = JSON.parse(saved);
      setData({
        email: user.email,
        password: user.password,
        remember: true,
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const ok = loginHardcoded(data.email, data.password);

    setTimeout(() => {
      setLoading(false);

      if (ok) {
        // Save credentials if remember is checked
        if (data.remember) {
          localStorage.setItem("rememberUser", JSON.stringify(data));
        } else {
          localStorage.removeItem("rememberUser");
        }

        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
       icon={null}              
  rightElement={<EmailIcon />} 
      />

      <InputGroup
        type={showPassword ? "text" : "password"}
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={null}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            
          >
           {showPassword ? <Eye /> : <EyeOff />}
          </button>
        }
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          checked={data.remember}
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
