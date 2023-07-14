import { ReactElement, useState } from "react";
import { Checkbox, Box, FormControl, TextField, Button } from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import {Post, Order} from "../../src/components/interface";
// components
import FullLayout from "../../src/layouts/full/FullLayout";
import axios from "axios";
import Image from "../../src/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {
  faInfoCircle,
  faPen,
  faTrash,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {Backend} from "../../src/components/contants/FnCommon";

export default function Orders() {
  const router = useRouter();
  const [listPosts, setListPost] = useState<Order[]>([]);
  useEffect(() => {
    axios({
      method: "get",
      url: Backend.URL + "/order",
    }).then(
        (res) => {
          setListPost(res.data.content);
        },
        (err) => {
          console.log(err);
        }
    );
  }, []);

  const redirect = (id: any) => {
    router.push({
      pathname: "/posts/detail",
      search: "?" + new URLSearchParams({ id: id }),
    });
  };

  const editPost = (id: any) => {
    router.push({
      pathname: "/posts/update",
      search: "?" + new URLSearchParams({ id: id }),
    });
  }

  const deletePost = (id: any) => {
    axios({
      method: "delete",
      url: Backend.URL + "/posts" + "/" + id,
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
            <Box className="list-posts-title">
              <p>{post.name}</p>
              <p>{post.address}</p>
              <p>{post.phone}</p>
            </Box>
            <Box className="group-action-icon">
              <FontAwesomeIcon
                  onClick={() => redirect(post.id)}
                  className="action-icon"
                  icon={faInfoCircle}
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

Orders.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
