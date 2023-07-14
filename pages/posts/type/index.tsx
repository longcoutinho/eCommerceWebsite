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
    TextField
} from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import {TypeItem} from "../../../src/components/interface";
// components
import FullLayout from "../../../src/layouts/full/FullLayout";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef} from "react";
import {
    faInfoCircle,
    faPen,
    faTrash,
    faStar,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {Backend} from "../../../src/components/contants/FnCommon";

export default function PostType() {
    const router = useRouter();
    const [listItemsType, setListItemType] = useState<TypeItem[]>([]);
    const [searchType, setSearchType] = useState("default");
    const [open, setOpen] = useState(false);
    const [titleDialog, setTitleDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");
    const [priority, setPriority] = useState(0);
    const [id, setId] = useState("");
    const [handleType, setHandleType] = useState(0);
    const inputElement = useRef<any>(null);

    const getItemTypeData = () => {
        axios({
            method: "get",
            url: Backend.URL + "/type/0",
        }).then(
            (res) => {
                setListItemType(res.data);
                console.log(res.data);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    useEffect(() => {
        getItemTypeData();
        //console.log(listPostsMenu);
    },[]);

    const deletePost = (id: any) => {
        axios({
            method: "delete",
            url: "/type" + "/" + id,
        }).then(
            (res) => {
                setOpen(false);
                getItemTypeData();
            },
            (err) => {
                console.log(err);
            }
        );
    };

    const handleClickDelete = (id) => {
        setId(id);
        setTitleDialog("XÓA LOẠI SẢN PHẨM")
        setContentDialog("Bạn có muốn xóa loại sản phẩm này ?");
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
        // searchPosts(params);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const addType = () => {
        setOpen(true);
        setHandleType(3);
        setTitleDialog("THÊM MỚI LOẠI SẢN PHẨM");
        setContentDialog("Tên loại sản phẩm");
    }

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

    const addNewItemType = (content) => {
        axios({
            method: "post",
            url: "/type",
            data: {
                name: content,
                serviceType: 0,
            }
        }).then(
            (res) => {
                setOpen(false);
                getItemTypeData();
            },
            (err) => {
                console.log(err);
            }
        );
    }
    const handleAgreeButton = (type) => {
        if (type == 1) {
            changePostsPriority(priority, id);
        }
        else if (type == 2) {
            deletePost(id);
        }
        else if (type == 3) {
            addNewItemType(inputElement.current.value);
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
                // searchPosts(null);
            },
            (err) => {
                console.log(err);
            }
        );
        console.log("kk");
    }

    const handleInputDialog = (e) => {
        inputElement.current.value = e;
    }
    const ListItemType = () => {
        const ListPostsContent = listItemsType.map((type, index) => {
            return (
                <Box className="list-item-types" key={index}>
                    <Box>
                        <p style={{textTransform: "uppercase",
                            fontWeight: 700,
                            fontSize: "23px"}}>{type.name}</p>
                    </Box>
                    <Box className="group-action-icon">
                        <FontAwesomeIcon
                            // onClick={() => editPost(post.id)}
                            className="action-icon"
                            icon={faPen}
                        ></FontAwesomeIcon>
                        <FontAwesomeIcon
                            onClick={() => handleClickDelete(type.id)}
                            className="action-icon"
                            icon={faTrash}
                        ></FontAwesomeIcon>
                    </Box>
                </Box>
            );
        });

        return (
            <Box className="list-posts-content flex-row full-width full-height">
                {ListPostsContent}
                <Box sx={{marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center"}} className="add-type">
                    <FontAwesomeIcon
                        onClick={() => addType()}
                        className="action-icon"
                        icon={faPlus}
                    ></FontAwesomeIcon>
                </Box>
            </Box>
        );
    };

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
                <DialogContentText sx={{display: "flex", flexDirection: "column"}} id="alert-dialog-description">
                    {props.content}
                    <input ref={inputElement} onChange={(e: any) => handleInputDialog(e.target.value)}/>
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
                <ListItemType></ListItemType>
            </Box>
            <DialogComponent title={titleDialog} content={contentDialog}></DialogComponent>
        </PageContainer>
    )
}

PostType.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};