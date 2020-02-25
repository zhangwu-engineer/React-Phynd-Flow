const uneditableParentNodes = [
  'conditional-entity',
  'switch-entity',
  'regex-info',
  'function-info',
  'iteration-info',
  'jsonproperty-info',
  'aggregate-info',
  'aggregate-iterator-info',
  'jsonelement-info',
  'jsonelement-operations',
];

const editableNodes = [
  'Constant',
  'Column',
  'HL7',
  'regex-info',
  'function-info',
  'iteration-info',
  'jsonproperty-info',
  'aggregate-info',
  'aggregate-iterator-info',
  'jsonelement-info'
];

const singleNodes = [
  'Constant',
  'Column',
  'HL7'
];

export const checkCategoryEditable = (node) => {
    if ((node.edges && node.edges.length === 0) || node.parent) {
      if (uneditableParentNodes.indexOf(node.data.parentType) > -1)
        return false;
      return true;
    }
    return false;
  }
  
  export const checkNodeEditable = node => (
      editableNodes.indexOf(node.data.parentType) > -1
    ) ? true : false;

  export const isSingleNode = nodeName => (
    singleNodes.indexOf(nodeName) > -1
    ) ? true : false;