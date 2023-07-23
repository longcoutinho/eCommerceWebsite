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
    Fade, Alert,
    TextField,
} from "@mui/material";
import PageContainer from "../../src/components/container/PageContainer";
import {Post, TypePost} from "../../src/components/interface";
// components
import FullLayout from "../../src/layouts/full/FullLayout";
import axios from "axios";
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

export default function Item() {
    const router = useRouter();
    const [listPostsMenu, setListPostsMenu] = useState<TypePost[]>([]);
    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");
    const [priority, setPriority] = useState(0);
    const [id, setId] = useState("");
    const [handleType, setHandleType] = useState(0);
    const [alertVisibility, setAlertVisibility] = useState(false);
    const [alertType, setAlertType] = useState<any>("");
    const [alertContent, setAlertContent] = useState("");

    const getListTypePost = () => {
        axios({
            method: "get",
            url: Backend.URL + "/type/1",
        }).then(
            (res) => {
                setListPostsMenu(res.data);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    useEffect(() => {
        getListTypePost();
        //console.log(listPostsMenu);
    },[]);

    const redirect = (id: any) => {
        router.push({
            pathname: "/items/detail",
            search: "?" + new URLSearchParams({ id: id }),
        });
    };

    const editPost = (id: any) => {
        router.push({
            pathname: "/items/update",
            search: "?" + new URLSearchParams({ id: id }),
        });
    }

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

    const buildObjectFilter = (searchType: any, title: any) : object => {
        const params = {
            typeId: searchType == "default" ? null : searchType,
            title: title,
        }
        return params;
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = (priority, id) => {
        setPriority(priority);
        setId(id);
        setTitleDialog("THAY ĐỔI ƯU TIÊN VẬT PHẨM")
        if (priority == 0) {
            setContentDialog("Bạn có muốn thêm ưu tiên cho vật phẩm ?");
        }
        else {
            setContentDialog("Bạn có muốn bỏ ưu tiên vật phẩm ?");
        }
        setOpen(true);
        setHandleType(1);
    };

    const ListPosts = (props: any) => {
        const [listPosts, setListPost] = useState<Post[]>([]);
        const [typePost, setTypePost] = useState("");
        const changePostsPriority = (priority, id) => {
            axios({
                method: "put",
                url: Backend.URL + "/item/priority" + "/" + id,
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

        const searchPostsProcess = (typePost: any, title: any) => {
            let params = buildObjectFilter(typePost, title);
            searchPosts(params);
        }

        const handleAgreeButton = (type) => {
            if (type == 1) {
                changePostsPriority(priority, id);
            }
            else if (type == 2) {
                deletePost(id);
            }
        }

        const deletePost = (id: any) => {
            axios({
                method: "delete",
                url: Backend.URL + "/item" + "/" + id,
            }).then(
                (res) => {
                    setOpen(false);
                    setAlertVisibility(true);
                    setAlertType("success");
                    setAlertContent("Xóa vật phẩm thành công");
                    searchPosts(null);
                },
                (err) => {
                    setAlertVisibility(true);
                    setAlertType("error");
                    setAlertContent(err.response.data);
                }
            );
        };

        const searchPosts = (params: any) => {
            axios({
                method: "get",
                url: Backend.URL + "/item",
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

        useEffect(() => {
            console.log(props.type);
            setTypePost(props.type);
            searchPostsProcess(props.type, props.title);
        },[props]);

        return (
            <Box className="list-posts-content flex-row full-width full-height">
                {ListPostsContent}
                <DialogComponent title={titleDialog} content={contentDialog}></DialogComponent>
            </Box>
        );
    };

    const FilterPosts = () => {
        const [searchType, setSearchType] = useState("default");
        const [searchTitle, setSearchTitle] = useState("");
        const [lastTitle, setLastTitle] = useState("");

        const searchPost = () => {
            setLastTitle(searchTitle);
        }

        const handleTypePost = (event: any) => {
            setSearchType(event.target.value as string);
        }

        const handleTitlePost = (event: any) => {
            setSearchTitle(event.target.value as string);
        }

        // @ts-ignore
        // @ts-ignore
        return (
            <Box sx={{width: "100%"}}>
                <p>Tìm kiếm bài viết</p>
                <Box sx={{border: "2px solid black", padding: "20px"}}>
                    <Box sx={{display: "flex", flexDirection: "row", gap: "10px"}}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            onChange={handleTypePost}
                            defaultValue={searchType}
                        >
                            <MenuItem value={"default"}>Loại vật phẩm</MenuItem>
                            {listPostsMenu.map((type) => (
                                <MenuItem value={type.id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Tiêu đề vật phẩm"
                            onChange={handleTitlePost}
                        ></TextField>
                    </Box>
                    <Box sx={{marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Button onClick={() => searchPost()} sx={{backgroundColor: "gray", color: "white"}}>Tìm kiếm</Button>
                    </Box>
                    <ListPosts type={searchType} title={lastTitle}></ListPosts>
                </Box>
            </Box>
        )
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
                <AlertComponent></AlertComponent>
            </Box>
        </PageContainer>
    );
}

Item.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};
