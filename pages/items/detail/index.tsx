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
import { Item } from "../../../src/components/interface";
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

export default function ItemDetail() {
    const [content, setContent] = useState<any>();
    const [detailPost, setListPost] = useState<Item>();
    const handleChange = (e: any) => {
        console.log("e", e);
        setContent(e);
    };
    const route = useRouter();
    useEffect(() => {
        if (route.query.id !== undefined) {
            const URL = Backend.URL + "/item/" + route.query.id;
            console.log(route.query.id);
            axios({
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                method: "get",
                url: URL,
            }).then(
                (res) => {
                    const newArr = res.data as Item;
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
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Box sx={{fontSize: "20px", width: "20px"}}>
                        <FontAwesomeIcon style={{color: 'black'}} icon={faBackward} id="delete-cart-item"/>
                    </Box>
                    <Button onClick={() => goBack()} sx={{color: 'black'}}>Back</Button>
                </Box>
                <Box className="detailposts-title" sx={{marginTop: "20px", textAlign: "center", fontSize: "30px", textTransform: "uppercase", fontWeight: "700"}}>
                    <p>{detailPost?.title}</p>
                </Box>
                <Box>
                    <p className="title-detail-item">Giá sản phẩm:</p>
                    <Box className="content-detail-item">{detailPost?.price}</Box>
                </Box>
                <Box>
                    <p className="title-detail-item">Mô tả sản phẩm:</p>
                    <Box className="content-detail-item">{detailPost?.introduction}</Box>
                </Box>
                <Box>
                    <p className="title-detail-item">Giới thiệu về sản phẩm:
                    </p>
                    <Box className="content-detail-item" sx={{marginTop: "20px"}}
                         dangerouslySetInnerHTML={{ __html: detailPost?.content }}
                    ></Box>
                </Box>
            </Box>
        );
    }

    return (
        <PageContainer title="Web admin phong thủy" description="Quản lý web phong thủy">
            <DetailPost></DetailPost>
        </PageContainer>
    );
}

ItemDetail.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};
