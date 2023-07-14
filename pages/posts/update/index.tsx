import {ReactElement, useEffect, useState} from "react";
import {Checkbox, Box, FormControl, TextField, Button, AlertColor, Select, InputLabel, MenuItem} from "@mui/material";
import axios from "axios";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import Image from "../../../src/components/Image";
import dynamic from "next/dynamic";
import {Alert, Fade} from "@mui/material";
import {TypePost, Post} from "../../../src/components/interface"
import { useRouter } from "next/router";
const Editor = dynamic(() => import("../../../src/components/editor"), {
    loading: () => <p>loading...</p>,

    ssr: false,
});


export default function UpdatePost() {
    const [content, setContent] = useState<any>();
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File>();
    const [introduction, setIntroduction] = useState("");
    const [alertType, setAlertType] = useState<any>("");
    const [alertContent, setAlertContent] = useState("");
    const [typePost, setTypePost] = useState("undefined");
    const [priorityPost, setPriorityPost] = useState(0);
    const [demoImageURL, setDemoImageURL] = useState("");
    const [alertVisibility, setAlertVisibility] = useState(false);
    const route = useRouter();
    const handleChange = (e: any) => {
        console.log(e);
        setContent(e);
    };
    axios.defaults.baseURL = 'http://10.248.158.167:1112';
    const [listPostsMenu, setListPostsMenu] = useState<TypePost[]>([])
    useEffect(() => {
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
        console.log(listPostsMenu);
    },[]);

    useEffect(() => {
        if (route.query.id !== undefined) {
            const URL = "http://10.248.158.167:1112/posts/" + route.query.id;
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
                    console.log(res.data.title);
                    setTitle(res.data.title);
                    setTypePost(res.data.typeId);
                    setIntroduction(res.data.introduction);
                    setContent(res.data.content);
                    setPriorityPost(res.data.priority);
                    setDemoImageURL(res.data.titleImageUrlStream);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }, [route.query]);

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

    const validateUpdatePost = () => {
        console.log(typePost);
        if (title === "") {
            setAlertVisibility(true);
            setAlertType("error");
            setAlertContent("Tiêu đề bài viết không được để trống!");
        }
        else if (typePost === "undefined") {
            setAlertVisibility(true);
            setAlertType("error");
            setAlertContent("Vui lòng chọn loại bài viết!");
        }
        else if (introduction === undefined) {
            setAlertVisibility(true);
            setAlertType("error");
            setAlertContent("Giới thiệu bài viết không được để trống!");
        }
        else if (content === undefined) {
            setAlertVisibility(true);
            setAlertType("error");
            setAlertContent("Nội dung bài viết không được để trống!");
        }
        else {
            updatePost();
        }
    }

    const handlePriority = (e: any) => {
        setPriorityPost(e ? 1 : 0);
    }

    const updatePost = () => {
        axios({
            headers: {
                'Accept': '*/*',
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
            },
            method: 'put',
            url: '/posts' + "/" + route.query.id,
            data: {
                title: title,
                content: content,
                imageTitle: image,
                introduction: introduction,
                typeId: typePost,
                priority: priorityPost,
            }
        })
            .then((response) => {
                setAlertVisibility(true);
                setAlertType("success");
                setAlertContent("Cập nhật bài viết thành công!");
            }, (error) => {
                setAlertVisibility(true);
                setAlertType("error");
                setAlertContent(error.response.data);
            });
    }

    const handleTypePost = (event: any) => {
        setTypePost(event.target.value as string);
    }

    const handleImage = (e: any) => {
        let listFile: File;
        listFile = e.target.files[0];
        console.log(e.target.files[0]);
        setImage(listFile);
    }

    const ErrorAlert = (props) => {
        return <Alert sx={{display: props.dis?"flex":"none"}} severity={props.type}>{props.content}</Alert>
    }

    return (
        <PageContainer title="Web admin phong thủy" description="Quản lý web phong thủy">
            <Box sx={{border: '2px solid black', padding: '20px', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                <FormControl sx={{width: "100%"}}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <p>Ảnh đại diện bài viết: </p>
                        <input
                            type="file" multiple
                            accept="image/*"
                            name="myImage"
                            onChange={(e: any) => handleImage(e)}
                        />
                        <Box>
                            <img style={{marginTop: "15px", width: "150px", height: "150px", objectFit: "cover", display: (demoImageURL == "")?"none":"block"}} src={demoImageURL}></img>
                        </Box>
                    </Box>
                    <TextField sx={{width: "100%", marginTop: "20px"}}
                               id="title-post"
                               label="Tiêu đề bài viết"
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   console.log(event.target.value);
                                   setTitle(event.target.value);
                               }}
                               value={title}
                    />
                    <Box>
                        <p>Loại bài viết</p>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            onChange={handleTypePost}
                            value={typePost}
                        >
                            <MenuItem value="undefined" disabled={true}>Loại bài viết</MenuItem>
                            {listPostsMenu.map((type) => (
                                <MenuItem value={type.id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box>
                        {/*<textarea onChange={(event: any) => {*/}
                        {/*    console.log(event.target.value);*/}
                        {/*    setIntroduction(event.target.value);*/}
                        {/*  }}></textarea>*/}
                        <TextField sx={{width: "100%", marginTop: "20px"}}
                                   id="title-post"
                                   label="Giới thiệu về bài viết"
                                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                       console.log(event.target.value);
                                       setIntroduction(event.target.value);
                                   }}
                                   value={introduction}
                        />
                        <Box>
                            <p>Nội dung bài viết</p>
                            <Editor onChange={(e: any) => handleChange(e)} value={content} />
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <input checked={priorityPost == 1} style={{height: "20px", width: "20px"}} type="checkbox" onChange={(e) => handlePriority(e.target.checked)} />
                        <p>Bài viết ưu tiên</p>
                    </Box>
                </FormControl>
                <AlertComponent></AlertComponent>
                <Button variant="contained" sx={{marginTop: '20px', border: '1px solid black'}} onClick={() => validateUpdatePost()}>Cập nhật bài viết</Button>
            </Box>
        </PageContainer>
    );
}

UpdatePost.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};
