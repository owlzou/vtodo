import { defineComponent, PropType } from "vue";
import { TodoType, TodoNode } from "../todotxt";
import { RBadge, IColor } from "rect-ui";

const colorList: IColor[] = ["violet", "red", "pink", "orange", "yellow"];

export default defineComponent({
  props: {
    node: { type: Object as PropType<TodoNode>, required: true },
  },
  components: { RBadge },
  emits: ["clickTag"],
  setup(props, { emit }) {
    switch (props.node!.type) {
      case TodoType.Priority:
        const index = Math.min(
          props.node.val.charCodeAt(0) - "A".charCodeAt(0),
          colorList.length - 1
        );
        return () => (
          <RBadge
            {...{ text: props.node.val, color: colorList[index] }}
          ></RBadge>
        );
      case TodoType.Project:
        return () => (
          <span
            class="tag-project"
            onClick={() => emit(`clickTag`, props.node)}
          >
            +{props.node.val}&nbsp;
          </span>
        );
      case TodoType.Context:
        return () => (
          <span
            class="tag-context"
            onClick={() => emit(`clickTag`, props.node)}
          >
            @{props.node.val}&nbsp;
          </span>
        );
      case TodoType.Date:
        return () => <span class="r-text-green">{props.node.val}&nbsp;</span>;
      case TodoType.CompletedDate:
        return () => <span>{props.node.val}&nbsp;</span>;
      case TodoType.Text:
        return () => <span>{props.node.val}&nbsp;</span>;
      default:
        return () => <></>;
    }
  },
});
