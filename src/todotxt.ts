// https://github.com/todotxt/todo.txt

export enum TodoType {
    Text,
    Context,  // @context-item
    Project,  // +project
    Priority, // (A)
    Date, // 2022-01-01
    CompletedDate, // 2022-01-01
    Custom,
}

export interface TodoNode {
    type: TodoType
    symbol?: string,
    val: string,
}

export class TodoTxt {
    context: Set<string> = new Set();
    projects: Set<string> = new Set();
    priority = 0
    date: undefined | string = undefined
    completed = false
    completedDate: undefined | string = undefined
    nodes: TodoNode[] = []
    raw: string

    constructor(input: string) {
        input = input.trim();
        this.raw = input;

        let i = 0;
        let textStart = i;
        let textEnd = i;

        // 必须排在前面的内容，i==0
        if (input[i] == 'x' && isWhiteSpace(input[i + 1])) {
            this.completed = true;
            // this.nodes.push({ type: TodoType.Completed, val: input[i] })
            i = i + 2;
            // 完成日期？
            if (isDigit(input[i]) && isWhiteSpace(input[i + 10])) {
                const dateStr = input.substring(i, i + 10);
                const m = dateStr.match(/\d{4}-\d{2}-\d{2}/)
                if (m) {
                    this.completedDate = dateStr;
                    this.nodes.push({ type: TodoType.CompletedDate, val: dateStr })
                    i = i + 11;
                }
            }
        }

        // 优先级 Priority，在完成任务时放弃
        if (!this.completed && input[i] == '(' && isUpperCase(input[i + 1]) && input[i + 2] == ')' && isWhiteSpace(input[i + 3])) {
            this.priority = input.charCodeAt(i + 1) - 'A'.charCodeAt(0) + 1;
            this.nodes.push({ type: TodoType.Priority, val: input[i + 1] });
            i = i + 4;
        }

        // 创建日期 Date
        if (isDigit(input[i])) {
            const dateStr = input.substring(i, i + 10);
            const m = dateStr.match(/\d{4}-\d{2}-\d{2}/)
            if (m) {
                this.date = dateStr;
                this.nodes.push({ type: TodoType.Date, val: dateStr })
                i = i + 10;
            }
        }

        textStart = i;
        while (i < input.length) {
            if (isWhiteSpace(input[i])) {
                const j = i + 1;
                // 上下文物品 Context
                if (input[j] == '@') {
                    const end = chompWhile(input, j, (x) => !isWhiteSpace(x));
                    if (end - j > 1) {
                        if (textEnd > textStart) {
                            this.nodes.push({ type: TodoType.Text, val: input.substring(textStart, textEnd).trim() });
                        }
                        const node = { type: TodoType.Context, val: input.substring(j + 1, end) }
                        this.nodes.push(node);
                        this.context.add(node.val);
                        i = end;
                        textEnd = i;
                        textStart = i;
                        continue;
                    }
                }
                // 项目 Project
                if (input[j] == '+') {
                    const end = chompWhile(input, j, (x) => !isWhiteSpace(x));
                    if (end - j > 1) {
                        if (textEnd > textStart) {
                            this.nodes.push({ type: TodoType.Text, val: input.substring(textStart, textEnd).trim() });
                        }
                        const node = { type: TodoType.Project, val: input.substring(j + 1, end) }
                        this.nodes.push(node);
                        this.projects.add(node.val);
                        i = end;
                        textEnd = i;
                        textStart = i;
                        continue;
                    }
                }
            }
            textEnd = ++i;
        }

        if (textEnd != textStart) {
            this.nodes.push({ type: TodoType.Text, val: input.substring(textStart, textEnd).trim() });
        }
    }

    private toString(): string {
        const content = this.nodes.map(node => {
            switch (node.type) {
                case (TodoType.Priority): {
                    return this.completed ? "" : "(" + node.val + ")"
                }
                case (TodoType.Project): {
                    return "+" + node.val
                }
                case (TodoType.Context): {
                    return "@" + node.val
                }
                default:
                    return node.val
            }
        }).filter(i => i.length > 0).join(" ")
        return this.completed ? "x " + content : content;
    }

    setComplete(complete: Boolean, date: Date = new Date()) {
        if (complete) {
            this.completed = true
            this.completedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate()}`;
            if (this.nodes[0].type == TodoType.Priority) {
                this.nodes.splice(0, 1, { type: TodoType.CompletedDate, val: this.completedDate })
            } else {
                this.nodes.unshift({ type: TodoType.CompletedDate, val: this.completedDate });
            }
        } else {
            this.completed = false;
            this.completedDate = undefined;
            if (this.nodes[0].type === TodoType.CompletedDate) {
                this.nodes.shift();
            }
            if (this.priority > 0) {
                this.nodes.unshift({ type: TodoType.Priority, val: String.fromCharCode('A'.charCodeAt(0) + this.priority - 1) })
            }
        }
        this.raw = this.toString();
    }
}

function chompWhile(input: string, start: number, condition: (i: string) => boolean): number {
    let end = start + 1;
    while (end < input.length && condition(input[end])) {
        end += 1;
    }
    return end
}

function isDigit(val: string): boolean {
    return val >= '0' && val <= '9'
}

function isUpperCase(val: string): boolean {
    return val <= 'Z' && val >= 'A'
}

function isWhiteSpace(val: string): boolean {
    return val == ' '
}

// 排序
export function sortTodoBy(by: TodoType, a: TodoTxt, b: TodoTxt): number {
    // 完成了的排在后面
    if (a.completed && !b.completed) {
        return 1
    } else if (!a.completed && b.completed) {
        return -1
    }

    switch (by) {
        case TodoType.Priority:
            if (a.priority && b.priority) {
                if (a.priority != b.priority) {
                    return a.priority - b.priority;
                }
            } else if (a.priority) {
                return -1;
            } else if (b.priority) {
                return 1;
            }
        case TodoType.Date:
            if (a.date && b.date) {
                if (a.date != b.date) {
                    return new Date(a.date) > new Date(b.date) ? 1 : -1;
                }
            } else if (a.date) {
                return -1;
            } else if (b.date) {
                return 1;
            }
        case TodoType.CompletedDate:
            if (a.completedDate && b.completedDate) {
                if (a.completedDate != b.completedDate) {
                    return new Date(a.completedDate) > new Date(b.completedDate) ? 1 : -1;
                }
            } else if (a.completedDate) {
                return -1;
            } else if (b.completedDate) {
                return 1;
            }
    }
    return -1;
}