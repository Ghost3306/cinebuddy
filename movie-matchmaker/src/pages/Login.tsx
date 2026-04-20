import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Login successful");

        localStorage.setItem("user_uuid", data.uuid);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", data.email);

        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        className="flex-1 flex items-center justify-center px-6"
        style={{ paddingTop: "var(--nav-height)" }}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 py-16">
          <div className="text-center">
            <h1 className="font-display text-4xl italic tracking-wide">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to continue to CineFlow
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-3 rounded-md bg-secondary text-foreground outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-3 rounded-md bg-secondary text-foreground outline-none focus:ring-1 focus:ring-primary"
                required
              />

              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-md">
            Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Login;