import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

class Diagram extends React.Component {
  componentDidMount(){
    this.cy.on('click', function(e) {
      console.log(e);
    });
  }
  render(){
    const elements = [
      { data: { id: 'group1', label: 'Group 1' }, position: { x: 120, y: 120 }, classes: 'entity' },
      { data: { id: 'one', label: 'Node 1', parent: 'group1' }, position: { x: 120, y: 120 }, classes: 'node' },
      { data: { id: 'three', label: 'Node 3', parent: 'group1' }, position: { x: 120, y: 220 }, classes: 'node' },
      { data: { id: 'two', label: 'Node 2' }, position: { x: 300, y: 120 }, classes: 'node'},
      {
        data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' },
      },
    ];
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
              'padding': 30,
              'text-valign': 'top',
            }
          },
          {
            selector: '.node',
            style: {
              width: 100,
              height: 30,
              'background-color': 'white',
              'label': 'data(label)',
              'border-style': 'solid',
              'border-width': '1',
              'border-color': 'black',
              'text-valign': 'center',
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
        style={ { width: '100%', height: '400px' } }
      />
    );
  }
}

export default Diagram;