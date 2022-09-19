import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UpdateStory = ({ handleSnackOpen }) => {
  const { storySlug } = useParams();
  const navigate = useNavigate();
  const [fields, setfields] = useState({
    title: "",
    text: "",
    author: "",
    category: "",
    slug: "",
  });
  const [category, setcategory] = useState("");
  const [hasError, sethasError] = useState(false);

  const [fieldErrors, setfieldErrors] = useState({
    title: [],
    text: [],
    author: [],
    category: [],
  });
  const [slug, setslug] = useState("");

  const fetchStory = () => {
    const url = `/api/news-by-slug/${storySlug}`;
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        setfields({
          title: res.data.title,
          text: res.data.text ? res.data.text : '',
          author: res.data.author,
          category: res.data.category,
        });
        setslug(res.data.slug);
      })
      .catch((e) => {
        navigate("/");
        handleSnackOpen("something went wrong", "error");
      });
  };

  useEffect(() => {
    fetchStory();
  }, []);
  const handleSubmit = () => {
    console.log(slug)
    const url = `/api/update-story/${slug}`;
    axios
      .post(url, {
        ...fields,
      })
      .then((res) => {
        handleSnackOpen("story has been updated", "success");
        navigate("/");
      })
      .catch((e) => {
        console.log(e.response.data)
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
      <p className="text-center font-bold text-2xl mt-[8rem]">Update Story</p>
      <div className="w-full md:w-[50%] flex flex-col m-auto">
        <input
          placeholder="title"
          type="text"
          value={fields.title}
          onChange={(e) =>
            setfields((prev) => ({ ...prev, title: e.target.value }))
          }
          className={`w-full border-1 placeholder-secondary p-2 ${
            hasError && fieldErrors.title
              ? "border-red-500"
              : "border-secondary"
          } rounded-l bg-transparent`}
        />
        {hasError &&
          fieldErrors.title &&
          fieldErrors.title.map((error, i) => (
            <p key={i} className="text-sm text-red-600 mb-1">
              {error}
            </p>
          ))}
        <textarea
          placeholder="description"
          value={fields.text}
          onChange={(e) =>
            setfields((prev) => ({ ...prev, text: e.target.value }))
          }
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
          value={fields.category}
          onChange={(e) =>
            setfields((prev) => ({ ...prev, category: e.target.value }))
          }
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
            value={fields.author}
            onChange={(e) =>
              setfields((prev) => ({
                ...prev,
                author: e.target.value,
              }))
            }
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

export default UpdateStory;
