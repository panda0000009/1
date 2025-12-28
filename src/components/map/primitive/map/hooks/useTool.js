export default function (map) {
  let innerTools = [];

  const getTool = (toolName) => {
    let toolItem = innerTools.find((n) => n.toolName == toolName);
    return toolItem ? toolItem.tool : null;
  };

  const addTool = (toolName, tool) => {
    if (!toolName || typeof toolName != "string") {
      throw new Error("toolName is required");
    }
    assertNewTool(toolName);
    innerTools.push({ toolName, tool });
    map.addInteraction(tool.ol);
  };

  const assertNewTool = (toolName) => {
    if (innerTools.find((n) => n.toolName == toolName)) {
      throw new Error("Duplicate tool");
    }
  };

  const removeTool = (toolName) => {
    if (innerTools.find((n) => n.toolName == toolName)) {
      map.removeInteraction(
        innerTools.find((n) => n.toolName == toolName).tool.ol
      );
      innerTools = innerTools.filter((n) => n.toolName != toolName);
    }
  };

  return {
    innerTools,
    getTool,
    addTool,
    removeTool,
  };
}
