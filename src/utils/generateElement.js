export const generateNode = ({ entityColor, ...infoDetails }) => {
  const nodeElement = {
    data: {
      ...infoDetails
    },
    group: 'nodes',
    style: {
      'background-color': entityColor
    }
  };
  return nodeElement;
};

export const generateEntity = ({ entityColor, label, ...infoDetails }) => {
  return {
    data: {
      ...infoDetails,
      entity: label,
    },
    classes: 'entity',
    style: {
      'background-color': entityColor
    }
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