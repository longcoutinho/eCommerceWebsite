import { ReactElement, useState } from "react";
import { Checkbox, Box, FormControl, TextField, Button } from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import {Item} from "../../src/components/interface";
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

export default function Items() {
  const router = useRouter();
  const [listItemts, setListItem] = useState<Item[]>([]);
  useEffect(() => {
    axios({
      method: "get",
      url: Backend.URL + "/item",
    }).then(
        (res) => {
          setListItem(res.data.content);
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
      pathname: "/items/update",
      search: "?" + new URLSearchParams({ id: id }),
    });
  }

  const deletePost = (id: any) => {
    axios({
      method: "delete",
      url: Backend.URL + "/item" + "/" + id,
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
    const ListPostsContent = listItemts.map((post, index) => {
      return (
          <Box className="list-posts" key={index}>
            <Box className="list-posts-image">
              <img
                  className="posts-image"
                  src={post.titleImageUrlStream}
              ></img>
            </Box>
            <Box className="list-posts-title">
              <p>{post.title}</p>
                <p className="posts-introduction">{post.introduction}</p>
                <p>{post.createAt}</p>
            </Box>
            <Box className="group-action-icon">
              <FontAwesomeIcon
                  onClick={() => redirect(post.id)}
                  className="action-icon"
                  icon={faInfoCircle}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                  onClick={() => editPost(post.id)}
                  className="action-icon"
                  icon={faPen}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                  onClick={() => deletePost(post.id)}
                  className="action-icon"
                  icon={faTrash}
              ></FontAwesomeIcon>
              {/*<FontAwesomeIcon*/}
              {/*    style={{color: (post.priority == 1)?"yellow":"black"}}*/}
              {/*    className="action-icon"*/}
              {/*    icon={faStar}*/}
              {/*></FontAwesomeIcon>*/}
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

Items.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
