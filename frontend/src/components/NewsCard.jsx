import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const NewsCard = ({
  id,
  title,
  author,
  created_at,
  created_locally,
  slug,
  handleSnackOpen
}) => {
  const navigate = useNavigate()
  const datePosted = new Date(created_at).getDate();
  const currentDate = new Date().getDate();
  const daysPassed = currentDate - datePosted;
  const dateMap = {
    0: "today",
    1: "yesterday",
  };
  const handleDelete = () => {
    // const url = `http://127.0.0.1:8000/api/delete-story/${id}`;
    const url = `/api/delete-story/${id}`;
    axios.get(url).then((res) => {
      navigate("/");
    }).catch(e => {
      handleSnackOpen('something went wrong', 'error')
    });
  };
  return (
    <div className="flex w-full border-t-2 border-gray-600 text-secondary">
      <div className="flex flex-col md:flex-row justify-between w-full text-center md:text-start my-6 lg:md:my-3">
        <p className=" text-3xl md:text-5xl font-bold">{title}</p>
        <div className="w-full lg:w-[20rem] md:text-end">
          <div className="text-sm">
            <p>posted By: {author}</p>
            <p>
              posted:{" "}
              {daysPassed in dateMap
                ? `${dateMap[daysPassed]}`
                : `${daysPassed} days ago`}
            </p>

            {created_locally && (
              <div className="z-[100]">
                <Link to={`/update-story/${slug}`}>
                  <button className="bg-secondary mt-2 py-2 px-5 text-primary rounded">
                    update
                  </button>
                </Link>

                <div
                  onClick={handleDelete}
                  className="inline ml-2 cursor-pointer"
                >
                  <DeleteIcon />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
