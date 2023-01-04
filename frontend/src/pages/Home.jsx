import { useState, useReducer, useEffect } from "react";
import TopStoryCard from "../components/TopStoryCard";
import NewsCard from "../components/NewsCard";
import SearchIcon from "@mui/icons-material/Search";
import { ThreeCircles } from "react-loader-spinner";
import { Pagination } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const initialState = {
  newsFeed: [],
  topStories: [],
  isFetching: false,
  isSearching: false,
  hasError: false,
  errorMessage: "",
};

const ACTIONS = {
  FetchRequest: "fetching",
  FetchSuccess: "successful",
  FetchFailed: "failed",
  SearchRequest: "searching",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FetchRequest:
      return {
        ...state,
        hasError: false,
        isFetching: true,
      };
    case ACTIONS.SearchRequest:
      return {
        ...state,
        isSearching: true,
      };
    case ACTIONS.FetchSuccess:
      return {
        ...state,
        isFetching: false,
        isSearching: false,
        newsFeed: action.payload.newsFeed,
        topStories: action.payload.topStories,
      };

    case ACTIONS.FetchFailed:
      return {
        ...state,
        isFetching: false,
        hasError: true,
        isSearching: false,
      };
  }
};

const Home = ({ handleSnackOpen }) => {
  const [search, setsearch] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setcurrentPage] = useState(1);
  const [filter, setfilter] = useState("");
  const newsPerPage = 10;
  const lastIndex = currentPage * newsPerPage;
  const firstIndex = lastIndex - newsPerPage;

  const paginate = (e, value) => {
    setcurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchData = () => {
    const topStoriesUrl = "/api/top-news/5";
    // const topStoriesUrl = "http://127.0.0.1:8000/api/top-news/5";
    const newsFeedUrl = "/api/news";
    // const newsFeedUrl = "http://127.0.0.1:8000/api/news";
    const getTopStories = axios.get(topStoriesUrl);
    const getNewsFeed = axios.get(newsFeedUrl);

    axios
      .all([getTopStories, getNewsFeed])
      .then(
        axios.spread((...allData) => {
          const allTopStories = allData[0].data;
          const allNewsFeed = allData[1].data;
          dispatch({
            type: ACTIONS.FetchSuccess,
            payload: {
              newsFeed: allNewsFeed,
              topStories: allTopStories,
            },
          });
        })
      )
      .catch(() => {
        dispatch({
          type: ACTIONS.FetchFailed,
        });
        handleSnackOpen("something went wrong", "error");
      });
  };
  const SyncDB = () => {
    const url = "/api/sychronize-DB";
    // const url = "http://127.0.0.1:8000/api/sychronize-DB";
    console.log("called");
    axios
      .get(url)
      .then((res) => fetchData())
      .catch((e) => {
        fetchData();
      });
  };
  useEffect(() => {
    SyncDB();
    const interval = setInterval(() => {
      SyncDB();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch({
      type: ACTIONS.FetchRequest,
    });
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setsearch(e.target.value);
    dispatch({
      type: ACTIONS.SearchRequest,
    });
    // const searchUrl = `http://127.0.0.1:8000/api/news/search?query=${e.target.value}`;
    const searchUrl = `/api/news/search?query=${e.target.value}`;
    axios.get(searchUrl).then(({ data }) => {
      dispatch({
        type: ACTIONS.FetchSuccess,
        payload: {
          newsFeed: data,
          topStories: state.topStories,
        },
      });
    });
  };

  const handleFilter = () => {
    if (filter === 'all'){
      fetchData()
      return
    } 
    // const url = `http://127.0.0.1:8000/api/news-by-category/${filter}`;
    const url = `/api/news-by-category/${filter}`;
    dispatch({
      type: ACTIONS.FetchRequest,
    });
    axios
      .get(url)
      .then(({ data }) => {
        console.log(data)
        dispatch({
          type: ACTIONS.FetchSuccess,
          payload: {
            newsFeed: data,
            topStories: state.topStories,
          },
        });
      })
      .catch((e) => {
        dispatch({
          type: ACTIONS.FetchFailed,
        });
        handleSnackOpen("something went wrong", "error");
      });
  };
  return (
    <div className="w-[95%] lg:w-[60%] m-auto">
      <div className="">
        <div className="mt-4 flex justify-between">
          <p className="font-bold text-2xl capitalize text-secondary p-3">
            Hot Top Stories <LocalFireDepartmentIcon />
          </p>
          <div className="text-primary bg-secondary p-1 rounded my-auto cursor-pointer">
            <Link to="/add-story">
              <AddIcon />
            </Link>
          </div>
        </div>
        <div className="p-3 flex flex-row lg:justify-between overflow-x-scroll w-full lg:overflow-auto snap-x">
          {state.isFetching ? (
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
          ) : (
            <>
              {state.topStories.map((story, i) => (
                <div key={i}>
                  <Link to={`/detail/${story.slug}`}>
                    <TopStoryCard
                      title={story.title}
                      category={story.category}
                      createdAt={story.created_at}
                      author={story.author}
                    />
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="mt-4 w-full">
        <div className="flex justify-between flex-col md:flex-row ">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="font-bold text-2xl p-3">Headlines</p>
          </div>
          <div className="flex w-full md:w-[70%] flex-col md:flex-row justify-end items-center">
            <div className="flex mb-3 md:mb-0 items-center justify-end h-[3rem] md:w-[49%]">
              <select
                className="border-1 md:w-[50%] placeholder-secondary p-2 h-[3rem] border-secondary rounded-l bg-transparent border-r-0"
                value={filter}
                onChange={(e) => setfilter(e.target.value)}
              >
                <option className="bg-secondary text-white" value="all">
                  All
                </option>
                <option className="bg-secondary text-white" value="story">
                  Story
                </option>
                <option className="bg-secondary text-white" value="job">
                  Job
                </option>
              </select>
              <button
                onClick={handleFilter}
                className="border-1 border-l-0 rounded-r border-secondary h-[3rem] hover:bg-zinc-300"
              >
                <FilterAltIcon />
              </button>
            </div>
            <div className="w-full md:w-[49%] text-center">
              <input
                type="search"
                value={search}
                placeholder="Search headlines"
                onChange={handleSearch}
                className=" border-1 placeholder-secondary p-2 h-[3rem] border-secondary rounded-l bg-transparent border-r-0"
              />
              <button
                onClick={handleSearch}
                className="border-1 border-l-0 rounded-r border-secondary h-[3rem] hover:bg-zinc-300"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>

        {state.isFetching || state.isSearching ? (
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
        ) : (
          <div className="p-3">
            {state.newsFeed.length ? (
              state.newsFeed.slice(firstIndex, lastIndex).map((feed, i) => (
                <div key={i}>
                  <Link to={`/detail/${feed.slug}`}>
                    <NewsCard {...feed} handleSnackOpen={handleSnackOpen} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-2xl font-bold text-center">
                Sorry, thers's no Feed at this time
              </div>
            )}
            <div></div>
            <div className="flex justify-center">
              <Pagination
                count={Math.ceil(state.newsFeed.length / newsPerPage)}
                size="large"
                color="standard"
                onChange={paginate}
                defaultPage={1}
                page={currentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
