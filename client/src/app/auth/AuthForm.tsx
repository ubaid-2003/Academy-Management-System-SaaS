"use client";

import { useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // For now just log the form data
    console.log("Form submitted:", form);
    alert("Form submitted! Check console for data.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm p-6 mx-auto mt-10 bg-white rounded-lg shadow"
    >
      <h2 className="mb-4 text-2xl font-bold text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      {mode === "register" && (
        <>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
          />
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
          />
        </>
      )}

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      />

      {mode === "register" && (
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
      )}

      <button
        type="submit"
        className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
