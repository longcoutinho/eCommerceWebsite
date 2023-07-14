import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconBasket,
  IconShoppingCart,
  IconPlus,
  IconBook,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Bài viết",
  },

  {
    id: uniqueId(),
    title: "Danh sách bài viết",
    icon: IconBook,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Tạo bài viết mới",
    icon: IconPlus,
    href: "/posts/create",
  },
  {
    id: uniqueId(),
    title: "Loại bài viết",
    icon: IconPlus,
    href: "/posts/type",
  },
  {
    navlabel: true,
    subheader: "Sản phẩm",
  },
  {
    id: uniqueId(),
    title: "Danh sách sản phẩm",
    icon: IconBasket,
    href: "/items",
  },
  {
    id: uniqueId(),
    title: "Thêm sản phẩm mới",
    icon: IconPlus,
    href: "/items/create",
  },
  {
    id: uniqueId(),
    title: "Loại sản phẩm",
    icon: IconPlus,
    href: "/items/type",
  },
  {
    navlabel: true,
    subheader: "Đơn hàng",
  },
  {
    id: uniqueId(),
    title: "Danh sách đơn hàng",
    icon: IconShoppingCart,
    href: "/orders",
  },
];

export default Menuitems;
