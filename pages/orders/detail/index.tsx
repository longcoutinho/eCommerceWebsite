import { ReactElement, useState } from "react";
import {Checkbox, Box, FormControl, TextField, Button, Fade} from "@mui/material";
import axios from "axios";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { useEffect} from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
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

export default function DetailOrder() {
    const [content, setContent] = useState<any>();
    const [detailPost, setListPost] = useState<Post>();
    const handleChange = (e: any) => {
        console.log("e", e);
        setContent(e);
    };
    const route = useRouter();
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
                    console.log(res.data);
                    setListPost(newArr);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }, [route.query]);

    const DetailPost = () => {
        return (
            <Box
                className="detail-posts-container flex-col"
            >
                <Box
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

DetailOrder.getLayout = function getLayout(page: ReactElement) {
    return <FullLayout>{page}</FullLayout>;
};
