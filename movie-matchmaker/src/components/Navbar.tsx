import { Radio, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, LogOut, Clapperboard, Radio as RadioIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedUserName = localStorage.getItem("user_name");
    const savedUserUuid = localStorage.getItem("user_uuid");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    if (savedUserUuid) {
      setIsLoggedIn(true);
      setUserName(savedUserName || "User");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    setIsLoggedIn(false);
    setUserName("");

    navigate("/login");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 bg-background/90 backdrop-blur-md border-b border-border"
      style={{ height: "var(--nav-height)" }}
    >
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="font-display text-2xl tracking-wider text-primary"
        >
          CINEBUDDY
        </Link>

          <div className="hidden md:flex items-center gap-2">
  <Link to="/">
    <Button variant="ghost" className="rounded-xl">
      Home
    </Button>
  </Link>

  <Link to="/collections">
    <Button variant="ghost" className="rounded-xl flex items-center gap-2">
      <Clapperboard size={16} />
      Collections
    </Button>
  </Link>

  <Link to="/radio">
    <Button variant="ghost" className="rounded-xl flex items-center gap-2">
      <RadioIcon size={16} />
      Radio
    </Button>
  </Link>
  
</div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {isLoggedIn ? (
          <>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-sm">
              <User size={16} />
              <span>{userName}</span>
            </div>

            <Link to="/profile">
              <Button size="sm" className="rounded-sm">
                Profile
              </Button>
            </Link>

            <Button
              size="sm"
              variant="destructive"
              className="rounded-sm flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button size="sm" className="rounded-sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
