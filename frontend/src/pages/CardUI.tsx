import { Link } from "react-router-dom";

const CardUI = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-green-400">
      <Link to="/" className="btn">
        Go to Home
      </Link>
    </div>
  );
};

export default CardUI;
