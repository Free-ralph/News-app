import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import { Pagination } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Details = ({ handleOpen }) => {
  const { newsSlug } = useParams();
  const [loading, setloading] = useState(false);
  const [News, setNews] = useState({
    comments: [],
  });
  const [hasError, sethasError] = useState(false);
  const [fieldErrors, setfieldErrors] = useState({
    text: "",
    author: "",
  });
  const comments = useRef();
  const commentor = useRef();
  const [currentPage, setcurrentPage] = useState(1);
  const commentsPerPage = 10;
  const [dateTime, setdateTime] = useState({
    date: "",
    time: "",
  });
  const lastIndex = currentPage * commentsPerPage;
  const firstIndex = lastIndex - commentsPerPage;

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const timePosted = new Date(News.created_at).getTime();
    const currentTime = new Date().getTime();
    const prevTime = currentTime - timePosted;
    const time = new Date().toLocaleTimeString(prevTime);
    const date = new Date().toLocaleDateString(prevTime);
    setdateTime((prev) => ({ ...prev, time: time, date: date }));
  }, []);
  const fetchNews = () => {
    setloading(true);
    // const url = `http://127.0.0.1:8000/api/news-by-slug/${newsSlug}`;
    const url = `/api/news-by-slug/${newsSlug}`;
    axios
      .get(url)
      .then(({ data }) => {
        setNews(data);
        setloading(false);
      })
      .catch((error) => {
        console.log("error");
        setloading(false);
      });
  };

  const handlePostComment = () => {
    sethasError(false);
    // const url = "http://127.0.0.1:8000/api/add-comment";
    const url = "/api/add-comment";
    axios
      .post(url, {
        parent_id: parseInt(News.id),
        text: comments.current.value,
        author: commentor.current.value,
      })
      .then((res) => {
        fetchNews();
      })
      .catch((error) => {
        console.log(error.response.data);
        sethasError(true);
        setfieldErrors((prev) => ({
          ...error.response.data,
        }));
        handleOpen("Something went wrong", "error");
      });
  };

  const paginate = (e, value) => {
    setcurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="w-[95%] lg:w-[60%] m-auto mt-6">
      <Link to="/">
        <ArrowBackIcon />
      </Link>
      {!loading ? (
        <>
          <p className="font-bold text-3xl text-center">{News.title}</p>
          <p className="text-center">posted by: {News.author}</p>
          <p className="text-center">
            posted: {`${dateTime.date} at ${dateTime.time}`}
          </p>

          <div className="text-center font-semibold text-lg mt-10">
            <p>
              For Exclusive Details,{" "}
              <a href={News.url} className="text-blue-700" target="blank">
                Click Here
              </a>
            </p>
          </div>

          <div className="font-bold mt-10">Comments</div>
          <div>
            <textarea
              placeholder="add comment"
              ref={comments}
              className={`border-1 placeholder-secondary p-2 ${(hasError && fieldErrors.text) ? 'border-red-500': 'border-secondary' } rounded-l bg-transparent w-full h-[7rem]`}
            />
            {(hasError && fieldErrors.text) && fieldErrors.text.map((error, i) => (
                <p key = {i} className="text-sm text-red-600 mb-1">{error}</p>
            ))}
            <input
              placeholder="who's commenting ?"
              ref={commentor}
              className={`border-1 placeholder-secondary p-2 ${(hasError && fieldErrors.author) ? 'border-red-500': 'border-secondary' } rounded-l bg-transparent w-[50%] block`}
            />
            {(hasError && fieldErrors.author) && fieldErrors.author.map((error, i) => (
                <p key = {i} className="text-sm text-red-600 mb-1">{error}</p>
            ))}
            <button
              className="bg-secondary mt-2 py-2 px-5 text-primary rounded"
              onClick={handlePostComment}
            >
              Post
            </button>
          </div>
          <div>
            {News.comments.slice(firstIndex, lastIndex).map((comment, i) => (
              <div key={i} className="my-4">
                <p>{comment.author} :</p>
                <p
                  className="border-1 border-secondary rounded p-5 mt-2"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                ></p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              count={Math.ceil(News.comments.length / commentsPerPage)}
              size="large"
              color="standard"
              onChange={paginate}
              defaultPage={1}
              page={currentPage}
            />
          </div>
        </>
      ) : (
        <div className="flex m-auto justify-center mt-10">
          <ThreeCircles
            height="80"
            width="80"
            color="#191814"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </div>
      )}
    </div>
  );
};

export default Details;
