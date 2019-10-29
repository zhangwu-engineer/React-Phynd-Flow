import React from 'react';
import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(COSEBilkent);

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

  componentDidMount() {
    this.cy.on('click', function(e) {
      console.log(e);
    });
  }

  componentWillReceiveProps(props) {
    const elementsToAdd = this.generateMapping(props.source);
    const joined = this.state.elements.concat(elementsToAdd);
    this.setState({ elements: joined });
  }

  generateMapping(source) {
    let mappingElements = [];
    switch (source.MappingFieldType) {
      case 'Function':
        mappingElements = this.generateFunctionMapping(source);
        break;
      case 'Column':
        mappingElements = this.generateColumnMapping(source);
        break;
      default: break;
    }
    return mappingElements;
  }

  generateColumnMapping(source) {
    const elements = [
      {
        data: {
          id: source.MappingFieldId,
          label: `${source.MappingFieldType}: ${source.ColumnIdentifier}`,
        },
        group: 'nodes',
      },
    ];
    return elements;
  }

  generateFunctionMapping(source) {
    const nextMappingField = this.generateMapping(source.FunctionParameter);
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
          id: source.MappingFieldId,
          label: 'SourceParameter',
          parent: 'field',
        },
        group: 'nodes',
      },
      {
        data: {
          id: `${source.MappingFieldId}-${source.FunctionParameter.MappingFieldId}`,
          source: source.MappingFieldId,
          target: source.FunctionParameter.MappingFieldId,
        },
        group: "edges",
      },
    ];
    return elements.concat(nextMappingField);
  }

  render() {
    const { elements } = this.state;
    const layout = { 
      name: 'cose-bilkent',
      flow: {
        axis: 'x',
        minSeparation: 40,
      },
      avoidOverlap: true,
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
              'padding': DIGRAM_CONF.nodePadding,
              'text-valign': 'top',
              'text-halign': 'center',
              'text-margin-y': 30,
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