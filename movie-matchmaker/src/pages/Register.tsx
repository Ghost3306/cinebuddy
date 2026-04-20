import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const set = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Registration successful");
        navigate("/login");
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
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Join CineFlow today
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Password", key: "password", type: "password" },
              {
                label: "Confirm Password",
                key: "confirmPassword",
                type: "password",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-foreground">
                  {f.label}
                </label>

                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-md bg-secondary text-foreground outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-md">
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Register;