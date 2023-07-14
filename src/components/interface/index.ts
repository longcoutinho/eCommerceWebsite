export interface ITest {
    test: string;
}
export interface Post {
    titleImageUrlStream: string;
    title: string;
    author: string;
    typeId: Number;
    content: String;
    id: Number;
    createAt: string;
    introduction: string;
    priority: Number;
}
export interface Item {
    id: number,
    title: string,
    price: number,
    titleImageUrlStream: string,
    introduction: string,
    createAt: string;
}

export interface Course {
    title: string,
    teacher: string,
    titleImageUrlStream: string,
    videoTime: number,
}

export interface TypePost {
    id: string,
    name: string,
}

export interface TypeItem {
    id: string,
    name: string,
}

export interface Order {
    id: string,
    name: string,
    address: string,
    phone: string,
    note: string,
    createAt: string,
}