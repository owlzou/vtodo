import * as localForage from "localforage";

export async function save(data: string[]): Promise<void> {
    localForage.setItem('data', data).then((_value) => {
        return Promise.resolve();
    }).catch(function (err) {
        console.log(err);
        return Promise.reject(err);
    });
}

export async function load(): Promise<string[]> {
    let data: string[] | null = await localForage.getItem("data");
    return data === null ? INIT_DATA : data;
}

const INIT_DATA = [
    "(A) 点击筛选 @功能 +后期",
    "(B) 自定义字体 @界面",
    "(C) todo.txt 的自定义项目 @解析",
    "搜索功能 @功能",
    "x 2022-05-26 背景 @界面",
]