import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import { Button } from "@/components/ui/button";
import useUserStore from "../stores/useUserStore";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  ArrowRightStartOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const NavBar: React.FC = () => {
  const signOut = useUserStore((state) => state.signOut);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const barsIconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const bodyClassList = document.body.classList;
    if (bodyClassList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        barsIconRef.current &&
        !barsIconRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      signOut();
    }
  };

  return (
    <div className="pointer-events-none absolute z-10">
      <nav className="fixed left-0 right-0 top-0 z-10">
        <div className="container mx-auto flex items-center justify-end p-4">
          <div className="pointer-events-auto relative">
            <Button
              onClick={toggleDropdown}
              ref={barsIconRef}
              className="rounded-md p-2"
              variant="outline"
              size="icon"
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 w-48 rounded-md border"
              >
                <div className="flex flex-col">
                  <Button
                    className="hover:card dark:hover:card w-full rounded-none bg-background px-4 py-2 text-left"
                    variant="ghost"
                    onClick={toggleTheme}
                  >
                    {theme === "light" ? (
                      <>
                        <MoonIcon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <SunIcon className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    )}
                  </Button>
                  <div className="border-b"></div>

                  <Button
                    className="w-full rounded-none bg-background px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                    variant="ghost"
                    onClick={handleSignOut}
                  >
                    <ArrowRightStartOnRectangleIcon className="mr-2 h-4 w-4" />{" "}
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
