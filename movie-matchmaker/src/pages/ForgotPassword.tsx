import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: 'var(--nav-height)' }}>
        <div className="w-full max-w-md space-y-6 py-16">
          <div className="text-center">
            <h1 className="font-display text-4xl italic tracking-wide">Reset Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-foreground">If an account exists with that email, we've sent a reset link.</p>
              <Link to="/login" className="text-primary hover:underline text-sm">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-md bg-secondary text-foreground outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-md">Send Reset Link</Button>
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
