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

export const generateEntity = ({ entityColor, ...infoDetails }) => {
  return {
    data: {
      ...infoDetails,
      entity: infoDetails.label,
    },
    classes: 'entity',
    style: {
      'background-color': entityColor
    }
  };
};

export const generateEdge = ({ ...infoDetails }) => {
  return {
    data: {
      ...infoDetails
    },
    classes: 'edges',
  };
};