import React from "react";
import { supabase } from "../services/supabaseClient";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import useAuthStore from "../stores/useAuthStore";
import { Link } from "react-router-dom"; // For navigation links

const NavBar: React.FC = () => {
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      signOut();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold">
          DekuCards
        </Link>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
