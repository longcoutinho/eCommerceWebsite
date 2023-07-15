import { ReactElement, useState } from "react";
import { Checkbox, Box, FormControl, TextField, Button} from "@mui/material";
import axios from "axios";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { useEffect} from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Backend} from "../../../src/components/contants/FnCommon";
const Editor = dynamic(() => import("../../../src/components/editor"), {
  loading: () => <p>loading...</p>,

  ssr: false,
});

export interface Post {
    titleImageUrlStream: string;
    title: string;
    author: string;
    type: Number;
    content: any;
    id: Number;
    createTime: Date;
  }

export default function CreatePost() {
  const [content, setContent] = useState<any>();
  const [detailPost, setListPost] = useState<Post>();
  const handleChange = (e: any) => {
    console.log("e", e);
    setContent(e);
  };
  const route = useRouter();
  useEffect(() => {
    if (route.query.id !== undefined) {
      const URL = Backend.URL + "/posts/" + route.query.id;
      console.log(route.query.id);
      axios({
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        method: "get",
        url: URL,
      }).then(
        (res) => {
          const newArr = res.data as Post;
          console.log(res.data);
          setListPost(newArr);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [route.query]);

  const goBack = () => {
      route.back();
  }

  const DetailPost = () => {
    return (
      <Box
        className="detail-posts-container flex-col"
      >
          <Box sx={{display: "flex", flexDirection: "row"}}>
              <Box sx={{fontSize: "40px", width: "20px"}}>
                  <FontAwesomeIcon style={{color: 'black'}} icon={faBackward} id="delete-cart-item"/>
              </Box>
              <Button onClick={() => goBack()} sx={{color: 'black'}}>Back</Button>
          </Box>
          <Box className="detailposts-title" sx={{marginTop: "20px", textAlign: "center", fontSize: "30px", textTransform: "uppercase", fontWeight: "700"}}>
              <p>{detailPost?.title}</p>
          </Box>
        <Box sx={{marginTop: "20px"}}
          dangerouslySetInnerHTML={{ __html: detailPost?.content }}
        ></Box>
      </Box>
    );
  }

  return (
    <PageContainer title="Web admin phong thủy" description="Quản lý web phong thủy">
      <DetailPost></DetailPost>
    </PageContainer>
  );
}

CreatePost.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
