import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const DIAGRAM_CONF = {
  DIAGRAM_PADDING: 30,
  NODE_WIDTH: 300,
  NODE_HEIGHT: 120,
};

const nodeStyle = {
  'width': 'label',
  'height': 'label',
  'background-color': 'white',
  'label': 'data(label)',
  'border-style': 'solid',
  'border-width': '1',
  'border-color': 'black',
  'text-halign': 'center',
  'text-valign': 'center',
  'padding': 15,
  'shape': 'rectangle',
};

const parentEntityStyle = {
  'width': 'label',
  'height': 'label',
  'font-weight': 'bold',
  'background-opacity': 0.075,
  'padding': DIAGRAM_CONF.DIAGRAM_PADDING,
  'text-valign': 'top',
  'text-halign': 'center',
  'text-margin-y': 25,
};

const edgeStyle = {
  'arrow-scale': 1,
  'target-arrow-shape': 'triangle',
  'target-arrow-color': 'black',
  'curve-style': 'bezier',
};

const stylesheet=[
  {
    selector: 'node',
    style: nodeStyle,
  },
  {
    selector: ':parent',
    style: parentEntityStyle,
  },
  {
    selector: 'edge',
    style: edgeStyle,
  }
];

const generateMapping = (source, xWeight, yWeight) => {
  let mappingElements = [];
  switch (source.MappingFieldType) {
    case 'Function':
      mappingElements = generateFunctionMapping(source, xWeight, yWeight);
      break;
    case 'Column':
      mappingElements = generateSingleMapping(source, source.ColumnIdentifier, xWeight, yWeight);
      break;
    case 'Constant':
      mappingElements = generateSingleMapping(source, source.ConstantValue, xWeight, yWeight);
      break;
    case 'Switch':
      mappingElements = generateSwitchMapping(source, xWeight, yWeight);
      break;
    case 'Conditional':
      mappingElements = generateConditionMapping(source, xWeight, yWeight);
      break;
    default: break;
  }
  return mappingElements;
};

const generateNode = (id, label, parent, xWeight, yWeight) => {
  const nodeElement = {
    data: {
      id,
      label,
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

const generateEntity = (id, label) => {
  return {
    data: {
      id,
      label,
    },
    classes: 'entity',
  };
};

const generateEdge = (id, source, target) => {
  return {
    data: {
      id,
      source,
      target,
    },
    classes: 'edges',
  };
};

const generateSingleMapping = (source, identifier, xWeight, yWeight) => {
  const elements = [
    generateNode(source.MappingFieldId, `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`, null, xWeight, yWeight),
  ];
  return elements;
};

const generateFunctionMapping = (source, xWeight, yWeight) => {
  const nextMappingField = generateMapping(source.FunctionParameter, xWeight+1, yWeight);
  const currentId = source.MappingFieldId;
  const functionId = source.FunctionParameter.MappingFieldId;

  const elements = [
    generateEntity(`${currentId}`, `Function: ${source.FunctionName}`),
    generateNode(`source-${currentId}`, 'SourceParameter', `${currentId}`, xWeight, yWeight),
    generateEdge(`edge-source-${functionId}`, `source-${currentId}`, functionId),
  ];
  return elements.concat(nextMappingField);
};

const generateSwitchMapping = (source, xWeight, yWeight) => {
  const currentId = source.MappingFieldId;
  const switchId = source.SwitchValue.MappingFieldId;
  const defaultId = source.SwitchDefault.MappingFieldId;

  let elements = [
    generateEntity(`${currentId}`, 'Switch:'),
    generateNode(`value-${switchId}`, 'SwitchValue', `${currentId}`, xWeight, yWeight),
    generateNode(`default-${defaultId}`, 'DefaultValue', `${currentId}`, xWeight, yWeight+1),
    generateNode(`case-source-${currentId}`, 'Cases', `${currentId}`, xWeight, yWeight+2),
    generateEntity(`case-target-${currentId}`, 'Cases'),
    generateEdge(`edge-value-${switchId}`, `value-${switchId}`, switchId),
    generateEdge(`edge-default-${defaultId}`, `case-source-${currentId}`, `case-target-${currentId}`),
    generateEdge(`edge-case-${defaultId}`, `default-${defaultId}`, defaultId),
  ];

  const switchValue = generateMapping(source.SwitchValue, xWeight+1, yWeight);
  const switchDefault = generateMapping(source.SwitchDefault, xWeight+1, yWeight+1);

  source.Cases.map((caseItem, index) => {
    const nextMappingField = generateMapping(caseItem.Value, xWeight+3, yWeight+index);
    const valueId = caseItem.Value.MappingFieldId;
    const wrapper = [
      generateNode(`wrap-${valueId}`, `${caseItem.Key}`, `case-target-${currentId}`, xWeight+2, yWeight+index),
      generateEdge(`edge-each-case-${valueId}`, `wrap-${valueId}`, valueId),
    ];
    elements = elements.concat(wrapper.concat(nextMappingField));
    return wrapper;
  });

  return elements.concat(switchDefault).concat(switchValue);
};

const generateConditionMapping = (source, xWeight, yWeight) => {
  let addWeight = 0;
  if (source.TrueField.MappingFieldType === 'Switch') addWeight = 2;
  if (source.TrueField.MappingFieldType === 'Conditional') addWeight = 3;
  const currentId = source.MappingFieldId;
  const trueId = source.TrueField.MappingFieldId;
  const falseId = source.FalseField.MappingFieldId;

  const elements = [
    generateEntity(`${currentId}`, 'Conditional:'),
    generateNode(`condition-${currentId}`, 'Condition:', `${currentId}`, xWeight, yWeight),
    generateNode(`true-${currentId}`, 'If True:', `${currentId}`, xWeight, yWeight+2),
    generateNode(`false-${currentId}`, 'If False:', `${currentId}`, xWeight, yWeight+3+addWeight),
    generateEdge(`edge-true-${trueId}`, `true-${currentId}`, trueId),
    generateEdge(`edge-false-${falseId}`, `false-${currentId}`, falseId),
  ];

  const trueMappingField = generateMapping(source.TrueField, xWeight+1, yWeight+2);
  const falseMappingField = generateMapping(source.FalseField, xWeight+1, yWeight+3+addWeight);
  const field1 = source.Condition.Field1;
  const field2 = source.Condition.Field2;

  let fields = [
    generateEntity(`fields-${currentId}`, ''),
    generateNode(`field1-${currentId}`, 'Field 1', `fields-${currentId}`, xWeight+1, yWeight),
    generateNode(`field2-${currentId}`, 'Field 2', `fields-${currentId}`, xWeight+1, yWeight+1),
    generateEdge(`edge-fields-${currentId}`, `condition-${currentId}`, `fields-${currentId}`),
    generateEdge(`edge-field1-${currentId}`, `field1-${currentId}`, field1.MappingFieldId),
    generateEdge(`edge-field2-${currentId}`, `field2-${currentId}`, field2.MappingFieldId),
  ];

  const field1MappingField = generateMapping(field1, xWeight+2, yWeight);
  const field2MappingField = generateMapping(field2, xWeight+2, yWeight+1);
  fields = fields.concat(field1MappingField);
  fields = fields.concat(field2MappingField);

  return elements.concat(fields).concat(trueMappingField).concat(falseMappingField);
};

class Diagram extends React.Component {

  state = {
    elements: []
  };

  componentDidMount() {
    this.cy.on('tap', 'node', function(e) {
      console.log(e);
    });
  }

  componentWillReceiveProps(props) {
    const elementsToAdd = generateMapping(props.source, 1, 1);
    const joined = this.state.elements.concat(elementsToAdd);
    this.setState({ elements: joined });
  }

  render() {
    const { elements } = this.state;
    const layout = { 
      name: 'preset',
      fit: false,
      transform: function(node, pos) {
        if (node._private.data.xWeight && node._private.data.yWeight)
          return {
            x: node._private.data.xWeight * DIAGRAM_CONF.NODE_WIDTH,
            y: node._private.data.yWeight * DIAGRAM_CONF.NODE_HEIGHT,
          };
        return pos;
      },
    };
    const xWeightMax = elements.length > 0 ?
      Math.max.apply(Math, elements.map(function(o) { return o.data.xWeight ? o.data.xWeight : 0; }))
      : 0;
    const yWeightMax = elements.length > 0 ?
      Math.max.apply(Math, elements.map(function(o) { return o.data.yWeight ? o.data.yWeight : 0; }))
      : 0;

    return (
      <CytoscapeComponent
        cy={(cy) => { this.cy = cy }}
        elements={CytoscapeComponent.normalizeElements(elements)}
        layout={layout}
        stylesheet={stylesheet}
        style={
          {
            width: (xWeightMax + 1) * DIAGRAM_CONF.NODE_WIDTH,
            height: (yWeightMax + 1.5) * DIAGRAM_CONF.NODE_HEIGHT,
          }
        }
      />
    );
  }
}

export default Diagram;