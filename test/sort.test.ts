import { assert } from "chai";
import { TodoTxt, TodoType, sortTodoBy } from "../src/todotxt";
import { describe, it } from "mocha";

describe("todo.txt 排序测试", () => {
    it("优先级排序", () => {
        const data = ["(A) 第一个优先级", "(A) 2022-05-23 第二个优先级", "(C) c级", "(B) B级"];
        const todos = data.map(i => new TodoTxt(i));
        todos.sort((a, b) => sortTodoBy(TodoType.Priority, a, b))
        assert.equal(todos[2].priority, 2);
        assert.equal(todos[3].priority, 3);
    })

    it("完成日期排序", () => {
        const data = ["x 2022-05-23 完成-1", "x 2022-05-25 2022-05-01 完成-2", "x 没有完成日期", "2022-05-24 没有完成"];
        const todos = data.map(i => new TodoTxt(i));
        todos.sort((a, b) => sortTodoBy(TodoType.CompletedDate, a, b))
        assert.equal(todos[1].completedDate, "2022-05-23")
        assert.equal(todos[2].completedDate, "2022-05-25")
    })

    it("建立日期排序",()=>{
        const data = ["2022-05-23 todo-1", "2022-03-25 todo", "没有日期", "x 2022-04-01 只有完成日期","x 2022-04-02 2022-03-10 建立日期和完成日期"];
        const todos = data.map(i => new TodoTxt(i));
        todos.sort((a, b) => sortTodoBy(TodoType.Date, a, b))
        assert.equal(todos[0].date,"2022-03-25");
    })
})