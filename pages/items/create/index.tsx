import { ReactElement, useState } from "react";
import { Checkbox, Box, FormControl, TextField, Button, Input, InputLabel} from "@mui/material";
import axios from "axios";
import PageContainer from "../../../src/components/container/PageContainer";
import FullLayout from "../../../src/layouts/full/FullLayout";
import Editor from "../../../src/components/editor";
import Image from "../../../src/components/Image";
import { Label } from "@mui/icons-material";



export default function CreateItem() {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<Number>();
  const [content, setContent] = useState();
  const [introduction, setIntroduction] = useState();
  const [image, setImage] = useState<File[]>([]);
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
    listFile[0] = e.target.files[0];
    console.log(e.target.files[0]);
    setImage(listFile);
  }
  axios.defaults.baseURL = 'http://10.248.158.167:1112';
  const createPost = (formData: any) => {
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
      url: '/item',
      data: {
        title: title,
        price: price,
        imagesTitle: image,
      }
    })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

    

  

  return (
    <PageContainer title="Web admin phong thủy" description="Quản lý web phong thủy">
      <Box sx={{border: '2px solid black', padding: '20px', display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <FormControl sx={{width: "100%"}}>
          <p>Tên sản phẩm</p>
          <TextField onChange={(e: any) => handleTitle(e.target.value)}/>
          <p>Ảnh sản phẩm</p>
          <input
              type="file" multiple
              accept="image/*"
              name="myImage"
              onChange={(e: any) => handleImage(e)}
            />    
          <Box>
            <p>Ảnh demo</p>
            <Image src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"></Image>
          </Box>
          <p>Giá tiền 1 đơn vị (VNĐ)</p>
          <TextField onChange={(e: any) => handlePrice(e.target.value)}/>    
          <p>Giới thiệu sản phẩm</p>
          <Editor onChange={(e: any) => handleChange(e)} value={introduction} />
          <p>Nội dung sản phẩm</p>

        </FormControl>
        <Button variant="contained" sx={{marginTop: '20px', border: '1px solid black'}} onClick={createPost}>Thêm sản phẩm</Button> 
      </Box>
    </PageContainer>
  );
}

CreateItem.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
