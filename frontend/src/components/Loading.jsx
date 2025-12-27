import { AiOutlineLoading } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';

const Loading = () => {
  return (
    <div className="w-100 min-vh-25 d-flex flex-column justify-content-center align-items-center gap-3">
      <AiOutlineLoading className="spinner-border text-dark fs-3" />
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loading;