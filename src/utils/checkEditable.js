export const checkCategoryEditable = (node) => {
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
    if ((node.edges && node.edges.length === 0) || node.parent) {
      if (uneditableParentNodes.indexOf(node.data.parentType) > -1)
        return false;
      return true;
    }
    return false;
  }
  
  export const checkNodeEditable = node => (
      node.data.parentType === 'Constant' ||
      node.data.parentType === 'Column' ||
      node.data.parentType === 'HL7' ||
      node.data.parentType === 'regex-info' ||
      node.data.parentType === 'function-info' ||
      node.data.parentType === 'iteration-info' ||
      node.data.parentType === 'jsonproperty-info' ||
      node.data.parentType === 'aggregate-info' ||
      node.data.parentType === 'aggregate-iterator-info' ||
      node.data.parentType === 'jsonelement-info'
    ) ? true : false;

  export const isSingleNode = nodeName => (
      nodeName === 'Constant' ||
      nodeName === 'Column' ||
      nodeName === 'HL7'
    ) ? true : false;