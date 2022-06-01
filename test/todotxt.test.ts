import { assert } from "chai";
import { TodoTxt, TodoType } from "../src/todotxt";
import { describe, it } from "mocha";

describe("解析测试", () => {
  it("优先级", () => {
    const txt1 = new TodoTxt("(A) Call Mom");
    assert.equal(txt1.priority, 1, "(A) Call Mom");
  });

  it("优先级需要在最前", () => {
    const txt = new TodoTxt("Really gotta call Mom (A) @phone @someday");
    assert.equal(txt.priority, 0, "Really gotta call Mom (A) @phone @someday");
  });

  it("优先级后需空格", () => {
    const txt = new TodoTxt("(B)->Submit TPS report");
    assert.equal(txt.priority, 0, "(B)->Submit TPS report");
  });

  it("日期默认在最前", () => {
    const txt = new TodoTxt("2011-03-02 Document +TodoTxt task format");
    assert.equal(txt.date, "2011-03-02", "2011-03-02 Document +TodoTxt task format");
  });

  it("或日期在优先级之后", () => {
    const txt = new TodoTxt("(A) Call Mom 2011-03-02");
    assert.equal(txt.date, undefined, "(A) Call Mom 2011-03-02");

    const txt2 = new TodoTxt("(A) 2011-03-02 Call Mom");
    assert.equal(txt2.date, "2011-03-02");
  });

  it("上下文：前面需有空格", () => {
    const txt = new TodoTxt("Email SoAndSo at soandso@example.com");
    assert.equal(txt.context.size, 0);
  });

  it("项目符号：前面需有空格", () => {
    const txt = new TodoTxt("Learn how to add 2+2");
    assert.equal(txt.projects.size, 0);
  });

  it("完成日期跟在完成符号后", () => {
    const txt = new TodoTxt("x 2011-03-03 Call Mom");
    assert.equal(txt.completed, true);
    assert.equal(txt.completedDate, "2011-03-03");
    assert.equal(txt.date, undefined);
  });

  it("长句解析", () => {
    const txt = new TodoTxt("x 2011-03-02 2011-03-01 Review Tim's pull request +TodoTxtTouch @github");
    assert.equal(txt.completed, true);
    assert.equal(txt.completedDate, "2011-03-02");
    assert.equal(txt.date, "2011-03-01");
    assert.equal(txt.projects.size, 1);
    assert.equal(txt.context.size, 1);
  });

  it("完成符号：后面需要有空格", () => {
    const txt = new TodoTxt("xylophone lesson");
    assert.equal(txt.completed, false, "xylophone lesson");
  });

  it("完成符号：需要小写", () => {
    const txt = new TodoTxt("X 2012-01-01 Make resolutions");
    assert.equal(txt.completed, false, "X 2012-01-01 Make resolutions");
  });

  it("完成符号：必须在最前", () => {
    const txt = new TodoTxt("(A) x Find ticket prices");
    assert.equal(txt.completed, false, "(A) x Find ticket prices");
  });

  it("完成符号：后面需要有空格", () => {
    const txt = new TodoTxt("x_2012-01-01_2011-01-01_Buy books");
    assert.equal(txt.completed, false, "x_2012-01-01_2011-01-01_Buy books");
  });

  it("中文测试", () => {
    const txt = new TodoTxt("2022-01-01 去书店买 @书 +外出");
    assert.equal(txt.context.size, 1);
    assert.equal(txt.projects.size, 1);
    assert.equal(txt.nodes[1].val, "去书店买");
  });

  it("详细解析测试", () => {
    const txt = new TodoTxt("(A) 2022-05-15 默认显示的 +TODO 条 @测试");
    const e = [
      { type: TodoType.Priority, val: "A" },
      { type: TodoType.Date, val: "2022-05-15" },
      { type: TodoType.Text, val: "默认显示的" },
      { type: TodoType.Project, val: "TODO" },
      { type: TodoType.Text, val: "条" },
      { type: TodoType.Context, val: "测试" },
    ];
    assert.deepEqual(txt.nodes, e);
  });

  it("顶格识别测试", () => {
    const txt = new TodoTxt("+顶格 的项目识别测试");
    const txt2 = new TodoTxt("@顶格 的上下文识别测试");
    assert.equal([...txt.projects][0], "顶格", "顶格的项目识别")
    assert.equal([...txt2.context][0], "顶格", "顶格的上下文识别")
  })
});

describe("完成/解除完成时钩子测试", () => {
  const date = new Date();
  const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate()}`

  it("完成时", () => {
    const txt = new TodoTxt("todo");
    txt.setComplete(true)
    const e = [{ type: TodoType.CompletedDate, val: today }, { type: TodoType.Text, val: "todo" }];
    assert.equal(txt.completedDate, today);
    assert.deepEqual(txt.nodes, e);
  })

  it("带优先级，完成时", () => {
    const txt = new TodoTxt("(A) 2022-05-15 默认显示的 +TODO 条 @测试");
    txt.setComplete(true)
    assert.equal(txt.completedDate, today);
    assert.deepEqual(txt.nodes[0], { type: TodoType.CompletedDate, val: today })
    assert.deepEqual(txt.nodes[1], { type: TodoType.Date, val: "2022-05-15" })
  })

  it("取消完成时", () => {
    const txt = new TodoTxt("x 2022-05-23 2022-05-01 已完成的带日期的条目测试");
    txt.setComplete(false)
    assert.equal(txt.completed, false);
    assert.equal(txt.nodes[0].val, "2022-05-01")
  })
})