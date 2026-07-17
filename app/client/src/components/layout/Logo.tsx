import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <div className="hover:scale-95 duration-300 cursor-pointer flex items-center">
      <Link
        to="/"
        className="flex items-center justify-center gap-2 text-xl font-bold"
      >
        <img
          src={theme === "dark" ? "/icon_dark.svg" : "/icon_light.svg"}
          alt="JobFit Logo"
          className="w-8 h-8 mr-2"
        />
        <span className="text-2xl font-black text-foreground">JobFit</span>
      </Link>
    </div>
  );
};

export default Logo;
