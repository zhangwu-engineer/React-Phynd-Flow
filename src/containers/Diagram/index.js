import React from 'react';
import Cytoscape from 'cytoscape';
import LAYOUT from 'cytoscape-dagre';
import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(LAYOUT);

const DIGRAM_CONF = {
  startX: 200,
  startY: 100,
  nodeWidth: 'label',
  nodeHeight: 'label',
  diagramPadding: 30,
  diagramWidth: '100%',
  diagramHeight: 500,
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

  generateSingleMapping(source, identifier, xWeight, yWeight) {
    const elements = [
      {
        data: {
          id: source.MappingFieldId,
          label: `${source.MappingFieldType}: ${identifier ? identifier : 'NULL'}`,
          xWeight,
          yWeight,
        },
        group: 'nodes',
      },
    ];
    return elements;
  }

  generateFunctionMapping(source, xWeight, yWeight) {
    const nextMappingField = this.generateMapping(source.FunctionParameter, xWeight+1, yWeight);
    const elements = [
      {
        data: {
          id: `${source.MappingFieldId}`,
          label: `Function: ${source.FunctionName}`,
        },
        classes: 'entity',
      },
      {
        data: {
          id: `source-${source.MappingFieldId}`,
          label: 'SourceParameter',
          parent: `${source.MappingFieldId}`,
          xWeight,
          yWeight,
        },
        group: 'nodes',
      },
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
      {
        data: {
          id: `${source.MappingFieldId}`,
          label: `Switch: `,
        },
        classes: 'entity',
      },
      {
        data: {
          id: `value-${source.SwitchValue.MappingFieldId}`,
          label: 'SwitchValue',
          parent: `${source.MappingFieldId}`,
        },
        group: 'nodes',
      },
      {
        data: {
          id: `case-source-${source.MappingFieldId}`,
          label: 'Cases',
          parent: `${source.MappingFieldId}`,
        },
        group: 'nodes',
      },
      {
        data: {
          id: `case-target-${source.MappingFieldId}`,
          label: 'Cases',
        },
        classes: 'entity',
      },
      {
        data: {
          id: `default-${source.SwitchDefault.MappingFieldId}`,
          label: 'DefaultValue',
          parent: `${source.MappingFieldId}`,
        },
        group: 'nodes',
      },
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
    const switchValue = this.generateMapping(source.SwitchValue);
    const switchDefault = this.generateMapping(source.SwitchDefault);

    source.Cases.map(caseItem => {
      const nextMappingField = this.generateMapping(caseItem.Value);
      const wrapper = [
        {
          data: {
            id: `wrap-${caseItem.Value.MappingFieldId}`,
            label: `${caseItem.Key}`,
            parent: `case-target-${source.MappingFieldId}`,
          },
          group: 'nodes',
        },
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
    const elements = [
      {
        data: {
          id: `${source.MappingFieldId}`,
          label: `Conditional: `,
        },
        classes: 'entity',
      },
      {
        data: {
          id: `condition-${source.MappingFieldId}`,
          label: 'Condition:',
          parent: `${source.MappingFieldId}`,
          xWeight,
          yWeight,
        },
        group: 'nodes',
      },
      {
        data: {
          id: `true-${source.MappingFieldId}`,
          label: 'If True:',
          parent: `${source.MappingFieldId}`,
          xWeight,
          yWeight: yWeight+2,
        },
        group: 'nodes',
      },
      {
        data: {
          id: `false-${source.MappingFieldId}`,
          label: 'If False:',
          parent: `${source.MappingFieldId}`,
          xWeight,
          yWeight: yWeight+3,
        },
        group: 'nodes',
      },
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
    const falseMappingField = this.generateMapping(source.FalseField, xWeight+1, yWeight+3);

    let fields = [
      {
        data: {
          id: `fields-${source.MappingFieldId}`,
        },
        classes: 'entity',
      },
      {
        data: {
          id: `field1-${source.MappingFieldId}`,
          label: 'Field 1',
          parent: `fields-${source.MappingFieldId}`,
          xWeight: xWeight+1,
          yWeight,
        },
        group: 'nodes',
      },
      {
        data: {
          id: `field2-${source.MappingFieldId}`,
          label: 'Field 2',
          parent: `fields-${source.MappingFieldId}`,
          xWeight: xWeight+1,
          yWeight: yWeight+1,
        },
        group: 'nodes',
      },
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
      transform: function(node, pos) { 
        // if (node._private.data.wei === 'Primary')
        //   // return {x: pos.y, y: 200 };
        //   return pos;
        if (node._private.data.xWeight && node._private.data.yWeight)
          return {
            x: node._private.data.xWeight * 300,
            y: node._private.data.yWeight * 100,
          };
        return pos;
      },
    };

    return (
      <CytoscapeComponent
        cy={(cy) => { this.cy = cy }}
        elements={CytoscapeComponent.normalizeElements(elements)}
        layout={layout}
        stylesheet={[
          {
            selector: 'node',
            style: {
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
            }
          },
          {
            selector: ':parent',
            style: {
              'width': 'label',
              'height': 'label',
              'font-weight': 'bold',
              'background-opacity': 0.075,
              'padding': DIGRAM_CONF.diagramPadding,
              'text-valign': 'top',
              'text-halign': 'center',
              'text-margin-y': 25,
            }
          },
          {
            selector: 'edge',
            style: {
              'arrow-scale': 1,
              'target-arrow-shape': 'triangle',
              'target-arrow-color': 'black',
              'curve-style': 'bezier',
            }
          }
        ]}
        style={
          {
            width: DIGRAM_CONF.diagramWidth,
            height: DIGRAM_CONF.diagramHeight,
            padding: DIGRAM_CONF.diagramPadding,
          }
        }
      />
    );
  }
}

export default Diagram;