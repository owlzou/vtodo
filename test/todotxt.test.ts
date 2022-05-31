import { assert } from "chai";
import { TodoTxt, TodoType } from "../src/todotxt";
import { describe, it } from "mocha";

describe("解析测试", () => {
  it("(A) Call Mom", () => {
    const txt1 = new TodoTxt("(A) Call Mom");
    assert.equal(txt1.priority, 1);
  });

  it("Really gotta call Mom (A) @phone @someday", () => {
    const txt = new TodoTxt("Really gotta call Mom (A) @phone @someday");
    assert.equal(txt.priority, 0);
  });

  it("(B)->Submit TPS report", () => {
    const txt = new TodoTxt("(B)->Submit TPS report");
    assert.equal(txt.priority, 0);
  });

  it("2011-03-02 Document +TodoTxt task format", () => {
    const txt = new TodoTxt("2011-03-02 Document +TodoTxt task format");
    assert.equal(txt.date, "2011-03-02");
  });

  it("(A) 2011-03-02 Call Mom", () => {
    const txt = new TodoTxt("(A) 2011-03-02 Call Mom");
    assert.equal(txt.date, "2011-03-02");
  });

  it("(A) Call Mom 2011-03-02", () => {
    const txt = new TodoTxt("(A) Call Mom 2011-03-02");
    assert.equal(txt.date, undefined);
  });

  it("(A) Call Mom +Family +PeaceLoveAndHappiness @iphone @phone", () => {
    const txt = new TodoTxt(
      "(A) Call Mom +Family +PeaceLoveAndHappiness @iphone @phone"
    );
    assert.equal(txt.context.size, 2);
    assert.equal(txt.projects.size, 2);
  });

  it("Email SoAndSo at soandso@example.com", () => {
    const txt = new TodoTxt("Email SoAndSo at soandso@example.com");
    assert.equal(txt.context.size, 0);
  });

  it("Learn how to add 2+2", () => {
    const txt = new TodoTxt("Learn how to add 2+2");
    assert.equal(txt.projects.size, 0);
  });

  it("x 2011-03-03 Call Mom", () => {
    const txt = new TodoTxt("x 2011-03-03 Call Mom");
    assert.equal(txt.completed, true);
    assert.equal(txt.completedDate, "2011-03-03");
    assert.equal(txt.date, undefined);
  });

  it("x 2011-03-02 2011-03-01 Review Tim's pull request + TodoTxtTouch @github", () => {
    const txt = new TodoTxt(
      "x 2011-03-02 2011-03-01 Review Tim's pull request +TodoTxtTouch @github"
    );
    assert.equal(txt.completed, true);
    assert.equal(txt.completedDate, "2011-03-02");
    assert.equal(txt.date, "2011-03-01");
    assert.equal(txt.projects.size, 1);
    assert.equal(txt.context.size, 1);
  });

  it("xylophone lesson", () => {
    const txt = new TodoTxt("xylophone lesson");
    assert.equal(txt.completed, false);
  });

  it("X 2012-01-01 Make resolutions", () => {
    const txt = new TodoTxt("X 2012-01-01 Make resolutions");
    assert.equal(txt.completed, false);
  });

  it("(A) x Find ticket prices", () => {
    const txt = new TodoTxt("(A) x Find ticket prices");
    assert.equal(txt.completed, false);
  });

  it("x_2012-01-01_2011-01-01_Buy books", () => {
    const txt = new TodoTxt("x_2012-01-01_2011-01-01_Buy books");
    assert.equal(txt.completed, false);
  });

  it("2022-01-01 去书店买 @书 +外出", () => {
    const txt = new TodoTxt("2022-01-01 去书店买 @书 +外出");
    assert.equal(txt.context.size, 1);
    assert.equal(txt.projects.size, 1);
    assert.equal(
      txt.nodes.find((i) => i.type == TodoType.Text)!.val,
      "去书店买"
    );
  });

  it("(A) 2022-05-15 默认显示的 +TODO 条 @测试", () => {
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
    assert.deepEqual(txt.nodes[1], { type: TodoType.CompletedDate, val: today })
  })

  it("取消完成时", () => {
    const txt = new TodoTxt("x 2022-05-23 2022-05-01 已完成的带日期的条目测试");
    txt.setComplete(false)
    assert.equal(txt.completed, false);
    assert.equal(txt.nodes[0].val, "2022-05-01")
  })
})