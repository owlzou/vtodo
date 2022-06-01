import { SetupContext } from "vue";
import { TodoType, TodoNode } from "../todotxt";
import { RBadge, IColor } from "rect-ui";

const colorList: IColor[] = ["violet", "red", "pink", "orange", "yellow"];

interface IProps {
  nodes: TodoNode[];
}

const LineItem = (props: IProps, ctx: SetupContext) => {
  const elements = props.nodes.map((node) => {
    switch (node!.type) {
      case TodoType.Priority:
        const index = Math.min(
          node.val.charCodeAt(0) - "A".charCodeAt(0),
          colorList.length - 1
        );
        return (
          <RBadge {...{ text: node.val, color: colorList[index] }}></RBadge>
        );

      case TodoType.Project:
        return (
          <span class="tag-project" onClick={() => ctx.emit(`clickTag`, node)}>
            +{node.val}
          </span>
        );

      case TodoType.Context:
        return (
          <span class="tag-context" onClick={() => ctx.emit(`clickTag`, node)}>
            @{node.val}
          </span>
        );

      case TodoType.Date:
        return <span class="tag-date">{node.val}</span>;
      case TodoType.CompletedDate:
        return <span>{node.val}</span>;
      case TodoType.Text:
        return <span>{node.val}</span>;
      default:
        return <></>;
    }
  });
  return (<>{elements.reduce((pre,cur)=><>{pre}&nbsp;{cur}</>)}</>)
};

LineItem.emits = ["clickTag"];

export default LineItem;
