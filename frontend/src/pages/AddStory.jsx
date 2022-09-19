import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddStory = ({ handleSnackOpen }) => {
  const navigate = useNavigate();

  const [title, settitle] = useState("");
  const [text, settext] = useState("");
  const [author, setauthor] = useState("");
  const [category, setcategory] = useState("");

  const [hasError, sethasError] = useState(false);
  const [fieldErrors, setfieldErrors] = useState({
    title: [],
    text: [],
    author: [],
    category: [],
  });
  const handleSubmit = () => {
    console.log(category);
    const url = "/api/add-story";
    axios
      .post(url, {
        title: title,
        text: text,
        author: author,
        category: category,
      })
      .then((res) => {
        handleSnackOpen("story has been added", "success");
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        sethasError(true);
        setfieldErrors((prev) => ({
          ...prev,
          ...e.response.data,
        }));
        handleSnackOpen("something went wrong", "error");
      });
  };
  return (
    <div className="m-auto w-[90%] md:w-[80%]">
      <Link to="/">
        <ArrowBackIcon />
      </Link>
      <p className="text-center font-bold text-2xl mt-[8rem]">Add Story</p>
      <div className="w-full md:w-[50%] flex flex-col m-auto">
        <input
          placeholder="title"
          type="text"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          className={`w-full border-1 placeholder-secondary p-2 ${
            hasError && fieldErrors.title
              ? "border-red-500"
              : "border-secondary"
          } rounded-l bg-transparent`}
        />
        {hasError &&
          fieldErrors.title &&
          fieldErrors.text.map((error, i) => (
            <p key={i} className="text-sm text-red-600 mb-1">
              {error}
            </p>
          ))}
        <textarea
          placeholder="description"
          value={text}
          onChange={(e) => settext(e.target.value)}
          className={`mt-3 h-[7rem] w-full border-1 placeholder-secondary p-2 ${
            hasError && fieldErrors.text ? "border-red-500" : "border-secondary"
          } rounded-l bg-transparent`}
        />
        {hasError &&
          fieldErrors.text &&
          fieldErrors.text.map((error, i) => (
            <p key={i} className="text-sm text-red-600 mb-1">
              {error}
            </p>
          ))}
        <select
          className={`mt-3 w-full border-1 placeholder-secondary p-2 ${
            hasError && fieldErrors.category
              ? "border-red-500"
              : "border-secondary"
          } rounded-l bg-transparent`}
          value={category}
          onChange={(e) => setcategory(e.target.value)}
        >
          <option className="bg-secondary text-white" value="">
            select category
          </option>
          <option className="bg-secondary text-white" value="story">
            Story
          </option>
          <option className="bg-secondary text-white" value="job">
            Job
          </option>
        </select>
        {hasError &&
          fieldErrors.category &&
          fieldErrors.category.map((error, i) => (
            <p key={i} className="text-sm text-red-600 mb-1">
              {error}
            </p>
          ))}
        <div className="w-50% mt-3">
          <input
            placeholder="who's posting"
            value={author}
            onChange={(e) => setauthor(e.target.value)}
            className={`border-1 placeholder-secondary p-2 ${
              hasError && fieldErrors.author
                ? "border-red-500"
                : "border-secondary"
            } rounded-l bg-transparent`}
          />
          {hasError &&
            fieldErrors.author &&
            fieldErrors.author.map((error, i) => (
              <p key={i} className="text-sm text-red-600 mb-1">
                {error}
              </p>
            ))}
        </div>
        <button
          className="bg-secondary mt-2 py-2 px-5 text-primary rounded w-fit"
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default AddStory;
