import { ReactElement, useState } from "react";
import { Checkbox, Box, FormControl, TextField, Button } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
// components
import SalesOverview from "../src/components/dashboard/SalesOverview";
import YearlyBreakup from "../src/components/dashboard/YearlyBreakup";
import RecentTransactions from "../src/components/dashboard/RecentTransactions";
import ProductPerformance from "../src/components/dashboard/ProductPerformance";
import Blog from "../src/components/dashboard/Blog";
import MonthlyEarnings from "../src/components/dashboard/MonthlyEarnings";
import FullLayout from "../src/layouts/full/FullLayout";
import Editor from "../src/components/editor";
import axios from "axios";
import Image from "../src/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  faInfoCircle,
  faPen,
  faTrash,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface Post {
  image: string;
  title: string;
  author: string;
  id: Number;
}

export default function Home() {
  const router = useRouter();
  const [listPosts, setListPost] = useState<Post[]>([
    {
      title: "Bài viết dành cho người mù",
      image: "abc",
      author: "longhvh",
      id: 1,
    },
    {
      title: "Bài viết dành cho người mù",
      image: "abc",
      author: "longhvh",
      id: 1,
    },
  ]);
  useEffect(() => {
    axios({
      method: "get",
      url: "http://10.248.158.167:1112/posts",
    }).then(
      (res) => {
        setListPost(res.data.content);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  axios.defaults.baseURL = "http://10.248.158.167:1112";

  const redirect = (id: any) => {
    router.push({
      pathname: "/posts/detail",
      search: "?" + new URLSearchParams({ id: id }),
    });
  };

  const deletePost = (id: any) => {
    axios({
      method: "delete",
      url: "http://10.248.158.167:1112/posts",
    }).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const ListPosts = () => {
    const ListPostsContent = listPosts.map((post, index) => {
      return (
        <Box className="list-posts" key={index}>
          <Box className="list-posts-image">
            <Image
              className="posts-image"
              src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
            ></Image>
          </Box>
          <Box className="list-posts-title">
            <p>{post.title}</p>
          </Box>
          <Box className="group-action-icon">
            <FontAwesomeIcon
              onClick={() => redirect(post.id)}
              className="action-icon"
              icon={faInfoCircle}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className="action-icon"
              icon={faPen}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              onClick={() => deletePost(post.id)}
              className="action-icon"
              icon={faTrash}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className="action-icon"
              icon={faStar}
            ></FontAwesomeIcon>
          </Box>
        </Box>
      );
    });

    return (
      <Box className="list-posts-content flex-row full-width full-height">
        {ListPostsContent}
      </Box>
    );
  };

  return (
    <PageContainer
      title="Web admin phong thủy"
      description="Quản lý web phong thủy"
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ListPosts></ListPosts>
      </Box>
    </PageContainer>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
