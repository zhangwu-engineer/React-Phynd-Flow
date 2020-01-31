export const checkCategoryEditable = (node) => {
    if ((node.edges && node.edges.length === 0) || node.parent) {
      if (
        node.data.parentType === 'conditional-entity' ||
        node.data.parentType === 'switch-entity' ||
        node.data.parentType === 'regex-info' ||
        node.data.parentType === 'function-info' ||
        node.data.parentType === 'iteration-info' ||
        node.data.parentType === 'jsonproperty-info' ||
        node.data.parentType === 'aggregate-info' ||
        node.data.parentType === 'aggregate-iterator-info' ||
        node.data.parentType === 'jsonelement-info' ||
        node.data.parentType === 'jsonelement-operations'
      )
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

  export const isSingleNode = node => (
      node.data.parentType === 'Constant' ||
      node.data.parentType === 'Column' ||
      node.data.parentType === 'HL7'
    ) ? true : false;