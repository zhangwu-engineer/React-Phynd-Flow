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
    const elementsToAdd = this.generateMapping(props.source, 1, 1);
    const joined = this.state.elements.concat(elementsToAdd);
    this.setState({ elements: joined });
  }

  generateMapping(source, xWeight, yWeight) {
    let mappingElements = [];
    switch (source.MappingFieldType) {
      case 'Function':
        mappingElements = this.generateFunctionMapping(source, xWeight, yWeight);
        break;
      case 'Column':
        mappingElements = this.generateSingleMapping(source, source.ColumnIdentifier, xWeight, yWeight);
        break;
      case 'Constant':
        mappingElements = this.generateSingleMapping(source, source.ConstantValue, xWeight, yWeight);
        break;
      case 'Switch':
        mappingElements = this.generateSwitchMapping(source, xWeight, yWeight);
        break;
      case 'Conditional':
        mappingElements = this.generateConditionMapping(source, xWeight, yWeight);
        break;
      default: break;
    }
    return mappingElements;
  }

  generateNode(id, label, parent, xWeight, yWeight) {
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
  }

  generateEntity(id, label) {
    return {
      data: {
        id,
        label,
      },
      classes: 'entity',
    };
  }

  generateSingleMapping(source, identifier, xWeight, yWeight) {
    const elements = [
      this.generateNode(source.MappingFieldId, `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`, null, xWeight, yWeight),
    ];
    return elements;
  }

  generateFunctionMapping(source, xWeight, yWeight) {
    const nextMappingField = this.generateMapping(source.FunctionParameter, xWeight+1, yWeight);
    const elements = [
      this.generateEntity(`${source.MappingFieldId}`, `Function: ${source.FunctionName}`),
      this.generateNode(`source-${source.MappingFieldId}`, 'SourceParameter', `${source.MappingFieldId}`, xWeight, yWeight),
      {
        data: {
          id: `edge-source-${source.FunctionParameter.MappingFieldId}`,
          source: `source-${source.MappingFieldId}`,
          target: source.FunctionParameter.MappingFieldId,
        },
        group: 'edges',
      },
    ];
    return elements.concat(nextMappingField);
  }

  generateSwitchMapping(source, xWeight, yWeight) {
    let elements = [
      this.generateEntity(`${source.MappingFieldId}`, 'Switch:'),
      this.generateNode(`value-${source.SwitchValue.MappingFieldId}`, 'SwitchValue', `${source.MappingFieldId}`, xWeight, yWeight),
      this.generateNode(`default-${source.SwitchDefault.MappingFieldId}`, 'DefaultValue', `${source.MappingFieldId}`, xWeight, yWeight+1),
      this.generateNode(`case-source-${source.MappingFieldId}`, 'Cases', `${source.MappingFieldId}`, xWeight, yWeight+2),
      this.generateEntity(`case-target-${source.MappingFieldId}`, 'Cases'),
      {
        data: {
          id: `edge-value-${source.SwitchValue.MappingFieldId}`,
          source: `value-${source.SwitchValue.MappingFieldId}`,
          target: source.SwitchValue.MappingFieldId,
        },
        group: 'edges',
      },
      {
        data: {
          id: `edge-default-${source.SwitchDefault.MappingFieldId}`,
          source: `case-source-${source.MappingFieldId}`,
          target: `case-target-${source.MappingFieldId}`,
        },
        group: 'edges',
      },
      {
        data: {
          id: `edge-case-${source.SwitchDefault.MappingFieldId}`,
          source: `default-${source.SwitchDefault.MappingFieldId}`,
          target: source.SwitchDefault.MappingFieldId,
        },
        group: 'edges',
      },
    ];
    const switchValue = this.generateMapping(source.SwitchValue, xWeight+1, yWeight);
    const switchDefault = this.generateMapping(source.SwitchDefault, xWeight+1, yWeight+1);

    source.Cases.map((caseItem, index) => {
      const nextMappingField = this.generateMapping(caseItem.Value, xWeight+3, yWeight+index);
      const wrapper = [
        this.generateNode(`wrap-${caseItem.Value.MappingFieldId}`, `${caseItem.Key}`, `case-target-${source.MappingFieldId}`, xWeight+2, yWeight+index),
        {
          data: {
            id: `edge-each-case-${caseItem.Value.MappingFieldId}`,
            source: `wrap-${caseItem.Value.MappingFieldId}`,
            target: caseItem.Value.MappingFieldId,
          },
          group: 'edges',
        },
      ];
      elements = elements.concat(wrapper.concat(nextMappingField));
      return wrapper;
    });

    return elements.concat(switchDefault).concat(switchValue);
  }

  generateConditionMapping(source, xWeight, yWeight) {
    let addWeight = 0;
    if (source.TrueField.MappingFieldType === 'Switch') addWeight = 2;
    if (source.TrueField.MappingFieldType === 'Conditional') addWeight = 3;

    const elements = [
      this.generateEntity(`${source.MappingFieldId}`, 'Conditional:'),
      this.generateNode(`condition-${source.MappingFieldId}`, 'Condition:', `${source.MappingFieldId}`, xWeight, yWeight),
      this.generateNode(`true-${source.MappingFieldId}`, 'If True:', `${source.MappingFieldId}`, xWeight, yWeight+2),
      this.generateNode(`false-${source.MappingFieldId}`, 'If False:', `${source.MappingFieldId}`, xWeight, yWeight+3+addWeight),
      {
        data: {
          id: `edge-true-${source.TrueField.MappingFieldId}`,
          source: `true-${source.MappingFieldId}`,
          target: source.TrueField.MappingFieldId,
        },
        group: 'edges',
      },
      {
        data: {
          id: `edge-false-${source.FalseField.MappingFieldId}`,
          source: `false-${source.MappingFieldId}`,
          target: source.FalseField.MappingFieldId,
        },
        group: 'edges',
      },
    ];

    const trueMappingField = this.generateMapping(source.TrueField, xWeight+1, yWeight+2);
    const falseMappingField = this.generateMapping(source.FalseField, xWeight+1, yWeight+3+addWeight);

    let fields = [
      this.generateEntity(`fields-${source.MappingFieldId}`, ''),
      this.generateNode(`field1-${source.MappingFieldId}`, 'Field 1', `fields-${source.MappingFieldId}`, xWeight+1, yWeight),
      this.generateNode(`field2-${source.MappingFieldId}`, 'Field 2', `fields-${source.MappingFieldId}`, xWeight+1, yWeight+1),
      {
        data: {
          id: `edge-fields-${source.MappingFieldId}`,
          source: `condition-${source.MappingFieldId}`,
          target: `fields-${source.MappingFieldId}`,
        },
        group: 'edges',
      },
      {
        data: {
          id: `edge-field1-${source.MappingFieldId}`,
          source: `field1-${source.MappingFieldId}`,
          target: source.Condition.Field1.MappingFieldId,
        },
        group: 'edges',
      },
      {
        data: {
          id: `edge-field2-${source.MappingFieldId}`,
          source: `field2-${source.MappingFieldId}`,
          target: source.Condition.Field2.MappingFieldId,
        },
        group: 'edges',
      },
    ];

    const field1MappingField = this.generateMapping(source.Condition.Field1, xWeight+2, yWeight);
    const field2MappingField = this.generateMapping(source.Condition.Field2, xWeight+2, yWeight+1);
    fields = fields.concat(field1MappingField);
    fields = fields.concat(field2MappingField);

    return elements.concat(fields).concat(trueMappingField).concat(falseMappingField);
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
        stylesheet={[
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
        ]}
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