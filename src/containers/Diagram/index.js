import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const DIGRAM_CONF = {
  startX: 200,
  startY: 100,
  nodeWidth: 'label',
  nodeHeight: 'label',
  nodePadding: 50,
  diagramWidth: '100%',
  diagramHeight: 300,
};

class Diagram extends React.Component {

  state = {
    elements: []
  };

  componentWillReceiveProps(props) {
    switch (props.source.MappingFieldType) {
      case 'Function':
        this.generateFunctionMapping(props.source);
        break;
      default: break;
    }
  }

  componentDidMount() {
    this.cy.on('click', function(e) {
      console.log(e);
    });
  }

  generateFunctionMapping(source) {
    const elements = [
      {
        data: {
          id: 'field',
          label: `Function: ${source.FunctionName}`,
        },
        classes: 'entity',
      },
      {
        data: {
          id: 'sourceParameter',
          label: 'SourceParameter',
          parent: 'field',
        },
        position: { x: DIGRAM_CONF.startX, y: DIGRAM_CONF.startY },
        classes: 'node',
      },
      {
        data: {
          id: 'targetParameter',
          label: `${source.FunctionParameter && source.FunctionParameter.MappingFieldType}: ${source.FunctionParameter && source.FunctionParameter.ColumnIdentifier}`,
        },
        position: { x: DIGRAM_CONF.startX + 300, y: DIGRAM_CONF.startY },
        classes: 'node',
      },
      {
        data: {
          source: 'sourceParameter',
          target: 'targetParameter',
        },
      },
    ];
    this.setState({ elements });
  }

  render(){
    const { elements } = this.state;

    return (
      <CytoscapeComponent
        cy={(cy) => { this.cy = cy }}
        elements={CytoscapeComponent.normalizeElements(elements)}
        stylesheet={[
          {
            selector: ':parent',
            style: {
              'font-weight': 'bold',
              'background-opacity': 0.075,
              'content': 'data(label)',
              'padding': DIGRAM_CONF.nodePadding,
              'text-valign': 'top',
              'text-halign': 'center',
              'text-margin-y': 30,
            }
          },
          {
            selector: '.node',
            style: {
              width: 'label',
              height: 'label',
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
          }
        }
      />
    );
  }
}

export default Diagram;