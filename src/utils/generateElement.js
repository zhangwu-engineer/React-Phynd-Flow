export const generateNode = (id, label, parent, parentType, nextType, dataDetails, xWeight, yWeight) => {
  const nodeElement = {
    data: {
      id,
      label,
      parentType,
      nextType,
      dataDetails,
      xWeight,
      yWeight,
    },
    group: 'nodes',
  };
  if (parent) {
    nodeElement.data.parent = parent;
  }
  return nodeElement;
};

export const generateEntity = (id, label, parentType, dataDetails, xWeight, yWeight) => {
  return {
    data: {
      id,
      label,
      parentType,
      dataDetails,
      xWeight,
      yWeight,
      entity: label,
    },
    classes: 'entity',
  };
};

export const generateEdge = (id, source, target) => {
  return {
    data: {
      id,
      source,
      target,
    },
    classes: 'edges',
  };
};