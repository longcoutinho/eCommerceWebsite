import {ReactElement, useEffect, useState} from "react";
import {Checkbox, Box, FormControl, TextField, Button, Input, InputLabel, Select, MenuItem} from "@mui/material";
import axios from "axios";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import Image from "../../../src/components/Image";
import {Alert} from "@mui/lab";
import dynamic from "next/dynamic";
import {TypePost} from "../../../src/components/interface";
import {Backend} from "../../../src/components/contants/FnCommon";
const Editor = dynamic(() => import("../../../src/components/editor"), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

export default function CreateItem() {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<Number>();
  const [content, setContent] = useState();
  const [introduction, setIntroduction] = useState();
  const [image, setImage] = useState<File[]>([]);
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [alertContent, setAlertContent] = useState("");
  const [demoImageURL, setDemoImageURL] = useState("");
  const [typePost, setTypePost] = useState("undefined");
  const [listPostsMenu, setListPostsMenu] = useState<TypePost[]>([])

  const handleChange = (e: any) => {
    console.log("e", e);
    setIntroduction(e);
  };
  const handleChangee = (e: any) => {
    console.log("e", e);
    setContent(e);
  };
  const handleTitle = (e: any) => {
    setTitle(e);
  }
  const handlePrice = (e: string) => {
    console.log(e);
    var num: Number = +e
    setPrice(num);
  }
  const handleImage = (e: any) => {
    let listFile: File[] = [];
    listFile = e.target.files;
    setImage(listFile);
  }

  const validateCreateItem = () => {
    if (title === "") {
      setAlertDisplay(true);
      setAlertType("error");
      setAlertContent("Tên sản phẩm không được để trống!");
    } else if (image === undefined) {
      setAlertDisplay(true);
      setAlertType("error");
      setAlertContent("Vui lòng chọn ảnh đại diện của sản phẩm!");
    } else if (typePost === "undefined") {
      setAlertDisplay(true);
      setAlertType("error");
      setAlertContent("Vui lòng chọn loại sản phẩm!");
    } else if (introduction === undefined) {
      setAlertDisplay(true);
      setAlertType("error");
      setAlertContent("Giới thiệu sản phẩm không được để trống!");
    } else if (content === undefined) {
      setAlertDisplay(true);
      setAlertType("error");
      setAlertContent("Nội dung sản phẩm không được để trống!");
    } else {
      createItem();
    }
  }

  const handleTypePost = (event: any) => {
    setTypePost(event.target.value as string);
  }

  useEffect(() => {
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
    console.log(listPostsMenu);
  },[]);

  const createItem = () => {
    console.log(title);
    console.log(price);
    axios({
      headers: {
        'Accept': '*/*',
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
      method: 'post',
      url: Backend.URL + '/item',
      data: {
        title: title,
        price: price,
        imagesTitle: image,
        introduction: introduction,
        content: content,
        typeId: typePost,
      }
    })
    .then((response) => {
      setAlertDisplay(true);
      setAlertType("success");
      setAlertContent("Tạo bài viết thành công!");
      console.log(response);
    }, (error) => {
      setAlertDisplay(true);
      setAlertType("error");
      setAlertContent("Tạo bài viết thất bại! Mã lỗi: " + error.response.status + ". " + error.response.data);
      console.log(error);
    });
  }


  const ErrorAlert = (props) => {
    return <Alert sx={{display: props.dis?"flex":"none"}} severity={props.type}>{props.content}</Alert>
  }
    

  

  return (
    <PageContainer title="Web admin phong thủy" description="Quản lý web phong thủy">
      <Box sx={{border: '2px solid black', padding: '20px', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <FormControl sx={{width: "100%"}}>
          <TextField label="Tên sản phẩm" onChange={(e: any) => handleTitle(e.target.value)}/>
          <Box>
            <p>Ảnh sản phẩm</p>
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
          <Box>
            <p>Loại sản phẩm</p>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={handleTypePost}
                defaultValue={typePost}
            >
              {listPostsMenu.map((type) => (
                  <MenuItem value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
          </Box>
          <TextField sx={{marginTop: "20px"}} label="Giá tiền 1 đơn vị (VNĐ)" onChange={(e: any) => handlePrice(e.target.value)}/>
          <Box>
            <p>Giới thiệu sản phẩm</p>
            <textarea style={{width: "100%"}} onChange={(e: any) => handleChange(e.target.value)} value={introduction}></textarea>
          </Box>
          <Box>
            <p>Nội dung sản phẩm</p>
            <Editor onChange={(e: any) => handleChangee(e)} value={content} />
          </Box>
        </FormControl>
        <ErrorAlert type={alertType} content={alertContent} dis={alertDisplay}></ErrorAlert>
        <Button variant="contained" sx={{marginTop: '20px', border: '1px solid black'}} onClick={validateCreateItem}>Thêm sản phẩm</Button>
      </Box>
    </PageContainer>
  );
}

CreateItem.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
