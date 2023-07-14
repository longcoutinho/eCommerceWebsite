import { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade, Alert
} from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
import {Post, TypePost} from "../src/components/interface";
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

export default function Home() {
  const router = useRouter();
  const [listPosts, setListPost] = useState<Post[]>([]);
  const [listPostsMenu, setListPostsMenu] = useState<TypePost[]>([]);
  const [searchType, setSearchType] = useState("default");
  const [open, setOpen] = useState(false);
  const [titleDialog, setTitleDialog] = useState("");
  const [contentDialog, setContentDialog] = useState("");
  const [priority, setPriority] = useState(0);
  const [id, setId] = useState("");
  const [handleType, setHandleType] = useState(0);
  const [alertVisibility, setAlertVisibility] = useState(false);
  const [alertType, setAlertType] = useState<any>("");
  const [alertContent, setAlertContent] = useState("");


  axios.defaults.baseURL = "http://10.248.158.167:1112";

  const getListTypePost = () => {
    axios({
      method: "get",
      url: "http://10.248.158.167:1112/type/0",
    }).then(
        (res) => {
          setListPostsMenu(res.data);
        },
        (err) => {
          console.log(err);
        }
    );
  }

  const searchPosts = (params: any) => {
      axios({
        method: "get",
        url: "http://10.248.158.167:1112/posts",
        params: params,
      }).then(
          (res) => {
            setListPost(res.data.content);
          },
          (err) => {
            console.log(err);
          }
      );
  }

  useEffect(() => {
    getListTypePost();
    searchPosts(null);
    //console.log(listPostsMenu);
  },[]);

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
      url: "/posts" + "/" + id,
    }).then(
      (res) => {
        setOpen(false);
        setAlertVisibility(true);
        setAlertType("success");
        setAlertContent("Xóa bài viết thành công");
        searchPosts(null);
      },
      (err) => {
        setAlertVisibility(true);
        setAlertType("error");
        setAlertContent(err.response.data);
      }
    );
  };

  const AlertComponent = () => {
    return(
        <Box sx={{position: "fixed", top: "60px", right: "0px"}}>
          <Fade
              in={alertVisibility} //Write the needed condition here to make it appear
              timeout={{ enter: 1000, exit: 1000 }} //Edit these two values to change the duration of transition when the element is getting appeared and disappeard
              addEndListener={() => {
                setTimeout(() => {
                  setAlertVisibility(false)
                }, 2000);
              }}
          >
            <Alert severity={alertType} variant="standard" className="alert">
              {/*<AlertTitle>Success</AlertTitle>*/}
              {alertContent}
            </Alert>
          </Fade>
        </Box>
    )
  }

  const handleClickDelete = (id) => {
    setId(id);
    setTitleDialog("XÓA BÀI VIẾT")
    setContentDialog("Bạn có muốn xóa bài viết ?");
    setOpen(true);
    setHandleType(2);
  };

  const handleTypePost = (event: any) => {
    setSearchType(event.target.value as string);
  }

  const buildObjectFilter = () : object => {
    const params = {
      typeId: searchType == "default" ? null : searchType,
    }
    return params;
  }

  const searchPostsProcess = () => {
    let params = buildObjectFilter();
    searchPosts(params);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (priority, id) => {
    setPriority(priority);
    setId(id);
    setTitleDialog("THAY ĐỔI ƯU TIÊN BÀI VIẾT")
    if (priority == 0) {
      setContentDialog("Bạn có muốn thêm ưu tiên cho bài viết ?");
    }
    else {
      setContentDialog("Bạn có muốn bỏ ưu tiên bài viết ?");
    }
    setOpen(true);
    setHandleType(1);
  };

  const handleAgreeButton = (type) => {
    if (type == 1) {
      changePostsPriority(priority, id);
    }
    else if (type == 2) {
      deletePost(id);
    }
  }

  const changePostsPriority = (priority, id) => {
    axios({
      method: "put",
      url: "/posts/priority" + "/" + id,
      params: {
        priority: 1 - priority,
      }
    }).then(
        (res) => {
          setOpen(false);
          searchPosts(null);
          setAlertVisibility(true);
          setAlertType("success");
          setAlertContent("Thành công!");
        },
        (err) => {
          setAlertVisibility(true);
          setAlertType("error");
          setAlertContent(err.response.data);
        }
    );
    console.log("kk");
  }

  const ListPosts = () => {
    const ListPostsContent = listPosts.map((post, index) => {
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
              onClick={() => handleClickDelete(post.id)}
              className="action-icon"
              icon={faTrash}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
                onClick={() => handleClickOpen(post.priority, post.id)}
                style={{color: (post.priority == 1)?"#FCA130":"black"}}
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

  const FilterPosts = () => {
    // @ts-ignore
    // @ts-ignore
    return (
        <Box sx={{width: "100%"}}>
          <p>Tìm kiếm bài viết</p>
          <Box sx={{border: "2px solid black", padding: "20px"}}>
            <Box sx={{display: "flex", flexDirection: "row"}}>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  onChange={handleTypePost}
                  defaultValue={searchType}
              >
                <MenuItem value={"default"}>Loại bài viết</MenuItem>
                {listPostsMenu.map((type) => (
                    <MenuItem value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Button onClick={searchPostsProcess} sx={{backgroundColor: "gray", color: "white"}}>Tìm kiếm</Button>
            </Box>
          </Box>
        </Box>
    )
  }

  const DialogComponent = (props) => {
    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleAgreeButton(handleType)}>Đồng ý</Button>
        <Button onClick={handleClose} autoFocus>
          Hủy bỏ
        </Button>
      </DialogActions>
    </Dialog>)
  }

  return (
    <PageContainer
      title="Web admin phong thủy"
      description="Quản lý web phong thủy"
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <FilterPosts></FilterPosts>
        <ListPosts></ListPosts>
        <AlertComponent></AlertComponent>
      </Box>
      <DialogComponent title={titleDialog} content={contentDialog}></DialogComponent>
    </PageContainer>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
